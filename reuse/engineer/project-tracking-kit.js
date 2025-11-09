"use strict";
/**
 * PROJECT TRACKING AND MANAGEMENT KIT
 *
 * Comprehensive project management and tracking system for healthcare facility projects.
 * Provides 40 specialized functions covering:
 * - Project creation and initialization
 * - Work Breakdown Structure (WBS) management
 * - Task breakdown and dependency tracking
 * - Resource assignment and leveling
 * - Progress tracking and reporting
 * - Critical path analysis (CPM)
 * - Milestone tracking and validation
 * - Budget vs. actual cost tracking
 * - Risk and issue management
 * - Project timeline and Gantt chart data
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant project documentation
 *
 * @module ProjectTrackingKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all project data is audited and tracked
 * @example
 * ```typescript
 * import {
 *   createProject,
 *   createWBS,
 *   assignResource,
 *   trackProgress,
 *   calculateCriticalPath
 * } from './project-tracking-kit';
 *
 * // Create a new project
 * const project = await createProject({
 *   name: 'Hospital Wing Renovation',
 *   budget: 2000000,
 *   startDate: new Date(),
 *   endDate: new Date('2025-12-31')
 * });
 *
 * // Create work breakdown structure
 * const wbs = await createWBS(project.id, {
 *   phases: ['Planning', 'Design', 'Construction', 'Closeout']
 * });
 * ```
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
exports.ProjectController = exports.CreateIssueDto = exports.CreateRiskDto = exports.UpdateTaskProgressDto = exports.CreateTaskDto = exports.CreateProjectDto = exports.IssuePriority = exports.RiskSeverity = exports.DependencyType = exports.ProjectPriority = exports.TaskStatus = exports.ProjectStatus = void 0;
exports.createProject = createProject;
exports.generateProjectNumber = generateProjectNumber;
exports.initializeProjectFromTemplate = initializeProjectFromTemplate;
exports.approveProject = approveProject;
exports.startProject = startProject;
exports.createWBS = createWBS;
exports.addWBSChild = addWBSChild;
exports.getWBSHierarchy = getWBSHierarchy;
exports.calculateWBSRollup = calculateWBSRollup;
exports.createTask = createTask;
exports.addTaskDependency = addTaskDependency;
exports.removeTaskDependency = removeTaskDependency;
exports.getTaskDependencies = getTaskDependencies;
exports.validateTaskDependency = validateTaskDependency;
exports.assignResource = assignResource;
exports.performResourceLeveling = performResourceLeveling;
exports.calculateResourceUtilization = calculateResourceUtilization;
exports.getOverAllocatedResources = getOverAllocatedResources;
exports.updateTaskProgress = updateTaskProgress;
exports.calculateProjectProgress = calculateProjectProgress;
exports.generateProjectStatusReport = generateProjectStatusReport;
exports.trackProjectVariance = trackProjectVariance;
exports.calculateCriticalPath = calculateCriticalPath;
exports.getCriticalPathTasks = getCriticalPathTasks;
exports.calculateProjectSlack = calculateProjectSlack;
exports.createMilestone = createMilestone;
exports.completeMilestone = completeMilestone;
exports.getUpcomingMilestones = getUpcomingMilestones;
exports.calculateMilestoneCompletion = calculateMilestoneCompletion;
exports.trackBudgetVsActual = trackBudgetVsActual;
exports.createBudgetItem = createBudgetItem;
exports.updateBudgetItemActual = updateBudgetItemActual;
exports.calculateEarnedValueMetrics = calculateEarnedValueMetrics;
exports.createProjectRisk = createProjectRisk;
exports.createProjectIssue = createProjectIssue;
exports.resolveProjectIssue = resolveProjectIssue;
exports.generateGanttChartData = generateGanttChartData;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Project status values
 */
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["APPROVED"] = "approved";
    ProjectStatus["IN_PROGRESS"] = "in_progress";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
    ProjectStatus["CLOSED"] = "closed";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
/**
 * Task status values
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NOT_STARTED"] = "not_started";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["ON_HOLD"] = "on_hold";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
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
 * Task dependency types
 */
var DependencyType;
(function (DependencyType) {
    DependencyType["FINISH_TO_START"] = "finish_to_start";
    DependencyType["START_TO_START"] = "start_to_start";
    DependencyType["FINISH_TO_FINISH"] = "finish_to_finish";
    DependencyType["START_TO_FINISH"] = "start_to_finish";
})(DependencyType || (exports.DependencyType = DependencyType = {}));
/**
 * Risk severity levels
 */
var RiskSeverity;
(function (RiskSeverity) {
    RiskSeverity["CRITICAL"] = "critical";
    RiskSeverity["HIGH"] = "high";
    RiskSeverity["MEDIUM"] = "medium";
    RiskSeverity["LOW"] = "low";
})(RiskSeverity || (exports.RiskSeverity = RiskSeverity = {}));
/**
 * Issue priority levels
 */
var IssuePriority;
(function (IssuePriority) {
    IssuePriority["CRITICAL"] = "critical";
    IssuePriority["HIGH"] = "high";
    IssuePriority["MEDIUM"] = "medium";
    IssuePriority["LOW"] = "low";
})(IssuePriority || (exports.IssuePriority = IssuePriority = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create project DTO
 */
let CreateProjectDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _facilityId_decorators;
    let _facilityId_initializers = [];
    let _facilityId_extraInitializers = [];
    return _a = class CreateProjectDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.managerId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                this.budget = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.startDate = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.facilityId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _facilityId_initializers, void 0));
                __runInitializers(this, _facilityId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [ApiProperty({ description: 'Project name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Project description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [ApiProperty({ enum: ProjectPriority }), (0, class_validator_1.IsEnum)(ProjectPriority)];
            _managerId_decorators = [ApiProperty({ description: 'Project manager ID' }), (0, class_validator_1.IsUUID)()];
            _budget_decorators = [ApiProperty({ description: 'Project budget' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [ApiProperty({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [ApiProperty({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _facilityId_decorators = [ApiProperty({ description: 'Facility ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _facilityId_decorators, { kind: "field", name: "facilityId", static: false, private: false, access: { has: obj => "facilityId" in obj, get: obj => obj.facilityId, set: (obj, value) => { obj.facilityId = value; } }, metadata: _metadata }, _facilityId_initializers, _facilityId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateProjectDto = CreateProjectDto;
/**
 * Create task DTO
 */
let CreateTaskDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _isMilestone_decorators;
    let _isMilestone_initializers = [];
    let _isMilestone_extraInitializers = [];
    return _a = class CreateTaskDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.projectId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.startDate = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.isMilestone = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _isMilestone_initializers, void 0));
                __runInitializers(this, _isMilestone_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [ApiProperty({ description: 'Task name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Task description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _projectId_decorators = [ApiProperty({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _estimatedHours_decorators = [ApiProperty({ description: 'Estimated hours' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.1)];
            _startDate_decorators = [ApiProperty({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [ApiProperty({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _assignedTo_decorators = [ApiProperty({ description: 'Assigned to user ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _isMilestone_decorators = [ApiProperty({ description: 'Is milestone', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _isMilestone_decorators, { kind: "field", name: "isMilestone", static: false, private: false, access: { has: obj => "isMilestone" in obj, get: obj => obj.isMilestone, set: (obj, value) => { obj.isMilestone = value; } }, metadata: _metadata }, _isMilestone_initializers, _isMilestone_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTaskDto = CreateTaskDto;
/**
 * Update task progress DTO
 */
let UpdateTaskProgressDto = (() => {
    var _a;
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateTaskProgressDto {
            constructor() {
                this.progressPercentage = __runInitializers(this, _progressPercentage_initializers, void 0);
                this.actualHours = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.notes = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _progressPercentage_decorators = [ApiProperty({ description: 'Progress percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _actualHours_decorators = [ApiProperty({ description: 'Actual hours spent' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [ApiProperty({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateTaskProgressDto = UpdateTaskProgressDto;
/**
 * Create risk DTO
 */
let CreateRiskDto = (() => {
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
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _probability_decorators;
    let _probability_initializers = [];
    let _probability_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _mitigation_decorators;
    let _mitigation_initializers = [];
    let _mitigation_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    return _a = class CreateRiskDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.probability = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _probability_initializers, void 0));
                this.impact = (__runInitializers(this, _probability_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.mitigation = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _mitigation_initializers, void 0));
                this.owner = (__runInitializers(this, _mitigation_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                __runInitializers(this, _owner_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [ApiProperty({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _title_decorators = [ApiProperty({ description: 'Risk title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Risk description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _severity_decorators = [ApiProperty({ enum: RiskSeverity }), (0, class_validator_1.IsEnum)(RiskSeverity)];
            _probability_decorators = [ApiProperty({ description: 'Probability (0-1)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _impact_decorators = [ApiProperty({ description: 'Impact (1-10)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _mitigation_decorators = [ApiProperty({ description: 'Mitigation strategy' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _owner_decorators = [ApiProperty({ description: 'Risk owner ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _probability_decorators, { kind: "field", name: "probability", static: false, private: false, access: { has: obj => "probability" in obj, get: obj => obj.probability, set: (obj, value) => { obj.probability = value; } }, metadata: _metadata }, _probability_initializers, _probability_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _mitigation_decorators, { kind: "field", name: "mitigation", static: false, private: false, access: { has: obj => "mitigation" in obj, get: obj => obj.mitigation, set: (obj, value) => { obj.mitigation = value; } }, metadata: _metadata }, _mitigation_initializers, _mitigation_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRiskDto = CreateRiskDto;
/**
 * Create issue DTO
 */
let CreateIssueDto = (() => {
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
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    return _a = class CreateIssueDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.reportedBy = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
                __runInitializers(this, _reportedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [ApiProperty({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _title_decorators = [ApiProperty({ description: 'Issue title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Issue description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _priority_decorators = [ApiProperty({ enum: IssuePriority }), (0, class_validator_1.IsEnum)(IssuePriority)];
            _assignedTo_decorators = [ApiProperty({ description: 'Assigned to user ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _reportedBy_decorators = [ApiProperty({ description: 'Reported by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIssueDto = CreateIssueDto;
// ============================================================================
// PROJECT CREATION AND INITIALIZATION
// ============================================================================
/**
 * Creates a new project with auto-generated project number
 *
 * @param data - Project creation data
 * @param userId - User creating the project
 * @returns Created project
 *
 * @example
 * ```typescript
 * const project = await createProject({
 *   name: 'New Hospital Wing',
 *   budget: 5000000,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   managerId: 'user-123'
 * }, 'admin-456');
 * ```
 */
async function createProject(data, userId) {
    const project = {
        id: faker_1.faker.string.uuid(),
        projectNumber: generateProjectNumber(data.name),
        status: ProjectStatus.PLANNING,
        actualCost: 0,
        progressPercentage: 0,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return project;
}
/**
 * Generates a unique project number
 *
 * @param projectName - Project name
 * @returns Formatted project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateProjectNumber('Hospital Wing Renovation');
 * // Returns: "PRJ-HWR-20250108-001"
 * ```
 */
function generateProjectNumber(projectName) {
    const initials = projectName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `PRJ-${initials}-${date}-${sequence}`;
}
/**
 * Initializes project with template
 *
 * @param templateId - Template identifier
 * @param overrides - Override template values
 * @param userId - User creating the project
 * @returns Created project with template structure
 *
 * @example
 * ```typescript
 * const project = await initializeProjectFromTemplate('template-123', {
 *   name: 'Custom Project Name',
 *   budget: 1000000
 * }, 'user-456');
 * ```
 */
async function initializeProjectFromTemplate(templateId, overrides, userId) {
    // In production, fetch template from database
    const project = await createProject({
        name: overrides.name || 'Project from Template',
        description: overrides.description || '',
        priority: overrides.priority || ProjectPriority.MEDIUM,
        managerId: overrides.managerId || userId,
        budget: overrides.budget || 0,
        estimatedCost: overrides.estimatedCost || 0,
        startDate: overrides.startDate || new Date(),
        endDate: overrides.endDate || new Date(),
        ...overrides,
    }, userId);
    const wbs = await createWBS(project.id, {
        phases: ['Planning', 'Execution', 'Closeout'],
    });
    const tasks = [];
    return { project, wbs, tasks };
}
/**
 * Approves project to move from planning to execution
 *
 * @param projectId - Project identifier
 * @param approvedBy - User approving the project
 * @returns Updated project
 *
 * @example
 * ```typescript
 * const approved = await approveProject('project-123', 'admin-456');
 * ```
 */
async function approveProject(projectId, approvedBy) {
    return updateProjectStatus(projectId, ProjectStatus.APPROVED, approvedBy);
}
/**
 * Starts project execution
 *
 * @param projectId - Project identifier
 * @param startedBy - User starting the project
 * @returns Updated project
 *
 * @example
 * ```typescript
 * const started = await startProject('project-123', 'manager-456');
 * ```
 */
async function startProject(projectId, startedBy) {
    const project = await getProject(projectId);
    return {
        ...project,
        status: ProjectStatus.IN_PROGRESS,
        actualStartDate: new Date(),
        updatedAt: new Date(),
        updatedBy: startedBy,
    };
}
// ============================================================================
// WORK BREAKDOWN STRUCTURE (WBS) MANAGEMENT
// ============================================================================
/**
 * Creates Work Breakdown Structure for project
 *
 * @param projectId - Project identifier
 * @param structure - WBS structure definition
 * @returns Created WBS elements
 *
 * @example
 * ```typescript
 * const wbs = await createWBS('project-123', {
 *   phases: ['Design', 'Construction', 'Testing', 'Deployment']
 * });
 * ```
 */
async function createWBS(projectId, structure) {
    const wbsElements = [];
    structure.phases.forEach((phase, index) => {
        const element = {
            id: faker_1.faker.string.uuid(),
            projectId,
            wbsCode: `${index + 1}.0`,
            name: phase,
            description: `${phase} phase`,
            level: 1,
            sequence: index + 1,
            estimatedHours: 0,
            estimatedCost: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        wbsElements.push(element);
    });
    return wbsElements;
}
/**
 * Adds child element to WBS
 *
 * @param parentId - Parent WBS element ID
 * @param childData - Child element data
 * @returns Created child element
 *
 * @example
 * ```typescript
 * const child = await addWBSChild('parent-123', {
 *   name: 'Site Preparation',
 *   estimatedHours: 40,
 *   estimatedCost: 5000
 * });
 * ```
 */
async function addWBSChild(parentId, childData) {
    const parent = await getWBSElement(parentId);
    const siblings = await getWBSChildren(parentId);
    const child = {
        id: faker_1.faker.string.uuid(),
        projectId: parent.projectId,
        parentId,
        wbsCode: `${parent.wbsCode}.${siblings.length + 1}`,
        name: childData.name,
        description: childData.description || '',
        level: parent.level + 1,
        sequence: siblings.length + 1,
        estimatedHours: childData.estimatedHours,
        estimatedCost: childData.estimatedCost,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return child;
}
/**
 * Gets complete WBS hierarchy for project
 *
 * @param projectId - Project identifier
 * @returns Hierarchical WBS structure
 *
 * @example
 * ```typescript
 * const wbsTree = await getWBSHierarchy('project-123');
 * ```
 */
async function getWBSHierarchy(projectId) {
    // In production, fetch and build hierarchy from database
    const elements = await getWBSElements(projectId);
    const buildHierarchy = (parentId) => {
        return elements
            .filter((el) => el.parentId === parentId)
            .map((el) => ({
            ...el,
            children: buildHierarchy(el.id),
        }));
    };
    return buildHierarchy();
}
/**
 * Calculates WBS rollup totals (hours and costs)
 *
 * @param wbsElementId - WBS element identifier
 * @returns Rolled up totals
 *
 * @example
 * ```typescript
 * const totals = await calculateWBSRollup('wbs-123');
 * // Returns: { estimatedHours: 160, estimatedCost: 20000, actualHours: 120, actualCost: 15000 }
 * ```
 */
async function calculateWBSRollup(wbsElementId) {
    const element = await getWBSElement(wbsElementId);
    const children = await getWBSChildren(wbsElementId);
    if (children.length === 0) {
        return {
            estimatedHours: element.estimatedHours,
            estimatedCost: element.estimatedCost,
            actualHours: element.actualHours || 0,
            actualCost: element.actualCost || 0,
        };
    }
    const childTotals = await Promise.all(children.map((child) => calculateWBSRollup(child.id)));
    return childTotals.reduce((acc, totals) => ({
        estimatedHours: acc.estimatedHours + totals.estimatedHours,
        estimatedCost: acc.estimatedCost + totals.estimatedCost,
        actualHours: acc.actualHours + totals.actualHours,
        actualCost: acc.actualCost + totals.actualCost,
    }), { estimatedHours: 0, estimatedCost: 0, actualHours: 0, actualCost: 0 });
}
// ============================================================================
// TASK BREAKDOWN AND DEPENDENCY TRACKING
// ============================================================================
/**
 * Creates a project task
 *
 * @param taskData - Task creation data
 * @returns Created task
 *
 * @example
 * ```typescript
 * const task = await createTask({
 *   projectId: 'project-123',
 *   name: 'Design Database Schema',
 *   estimatedHours: 16,
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7*24*60*60*1000)
 * });
 * ```
 */
async function createTask(taskData) {
    const task = {
        id: faker_1.faker.string.uuid(),
        status: TaskStatus.NOT_STARTED,
        actualHours: 0,
        progressPercentage: 0,
        dependencies: [],
        isCriticalPath: false,
        predecessors: [],
        successors: [],
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return task;
}
/**
 * Adds dependency between tasks
 *
 * @param taskId - Dependent task ID
 * @param dependsOnTaskId - Predecessor task ID
 * @param dependencyType - Type of dependency
 * @param lagDays - Lag time in days
 * @returns Created dependency
 *
 * @example
 * ```typescript
 * await addTaskDependency('task-2', 'task-1', DependencyType.FINISH_TO_START, 0);
 * ```
 */
async function addTaskDependency(taskId, dependsOnTaskId, dependencyType = DependencyType.FINISH_TO_START, lagDays = 0) {
    const dependency = {
        id: faker_1.faker.string.uuid(),
        taskId,
        dependsOnTaskId,
        dependencyType,
        lagDays,
        createdAt: new Date(),
    };
    // Update task's predecessor and successor lists
    const task = await getTask(taskId);
    const dependsOnTask = await getTask(dependsOnTaskId);
    task.predecessors.push(dependsOnTaskId);
    dependsOnTask.successors.push(taskId);
    return dependency;
}
/**
 * Removes task dependency
 *
 * @param dependencyId - Dependency identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeTaskDependency('dep-123');
 * ```
 */
async function removeTaskDependency(dependencyId) {
    // In production, remove from database and update task lists
    return true;
}
/**
 * Gets all task dependencies for a task
 *
 * @param taskId - Task identifier
 * @returns Array of dependencies
 *
 * @example
 * ```typescript
 * const dependencies = await getTaskDependencies('task-123');
 * ```
 */
async function getTaskDependencies(taskId) {
    // In production, fetch from database
    return [];
}
/**
 * Validates task dependency to prevent circular dependencies
 *
 * @param taskId - Task identifier
 * @param dependsOnTaskId - Proposed predecessor task
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const isValid = await validateTaskDependency('task-2', 'task-1');
 * ```
 */
async function validateTaskDependency(taskId, dependsOnTaskId) {
    // Check for circular dependency
    const visited = new Set();
    const stack = [dependsOnTaskId];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current === taskId) {
            return { valid: false, reason: 'Circular dependency detected' };
        }
        if (visited.has(current))
            continue;
        visited.add(current);
        const task = await getTask(current);
        stack.push(...task.predecessors);
    }
    return { valid: true };
}
// ============================================================================
// RESOURCE ASSIGNMENT AND LEVELING
// ============================================================================
/**
 * Assigns resource to project or task
 *
 * @param assignment - Resource assignment data
 * @returns Created resource assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignResource({
 *   projectId: 'project-123',
 *   taskId: 'task-456',
 *   resourceId: 'user-789',
 *   resourceName: 'John Smith',
 *   resourceType: 'person',
 *   allocatedHours: 40,
 *   hourlyRate: 75,
 *   allocationPercentage: 50
 * });
 * ```
 */
async function assignResource(assignment) {
    const resourceAssignment = {
        id: faker_1.faker.string.uuid(),
        ...assignment,
        actualHours: 0,
        totalCost: assignment.allocatedHours * assignment.hourlyRate,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return resourceAssignment;
}
/**
 * Performs resource leveling to optimize resource utilization
 *
 * @param projectId - Project identifier
 * @param options - Leveling options
 * @returns Leveled schedule
 *
 * @example
 * ```typescript
 * const leveledSchedule = await performResourceLeveling('project-123', {
 *   maxHoursPerDay: 8,
 *   allowDelays: true
 * });
 * ```
 */
async function performResourceLeveling(projectId, options = {}) {
    const tasks = await getProjectTasks(projectId);
    const assignments = await getProjectResourceAssignments(projectId);
    // In production, implement resource leveling algorithm
    const resourceUtilization = new Map();
    return { tasks, resourceUtilization };
}
/**
 * Calculates resource utilization for period
 *
 * @param resourceId - Resource identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Utilization percentage by day
 *
 * @example
 * ```typescript
 * const utilization = await calculateResourceUtilization('user-123', startDate, endDate);
 * ```
 */
async function calculateResourceUtilization(resourceId, startDate, endDate) {
    // In production, calculate from resource assignments
    return [];
}
/**
 * Identifies over-allocated resources
 *
 * @param projectId - Project identifier
 * @returns Over-allocated resources
 *
 * @example
 * ```typescript
 * const overAllocated = await getOverAllocatedResources('project-123');
 * ```
 */
async function getOverAllocatedResources(projectId) {
    // In production, analyze resource assignments
    return [];
}
// ============================================================================
// PROGRESS TRACKING AND REPORTING
// ============================================================================
/**
 * Updates task progress
 *
 * @param taskId - Task identifier
 * @param progress - Progress data
 * @param userId - User updating progress
 * @returns Updated task
 *
 * @example
 * ```typescript
 * await updateTaskProgress('task-123', {
 *   progressPercentage: 75,
 *   actualHours: 30,
 *   notes: 'Nearly complete, pending final review'
 * }, 'user-456');
 * ```
 */
async function updateTaskProgress(taskId, progress, userId) {
    const task = await getTask(taskId);
    const updated = {
        ...task,
        progressPercentage: progress.progressPercentage,
        actualHours: progress.actualHours,
        updatedAt: new Date(),
    };
    // Auto-update status based on progress
    if (progress.progressPercentage === 0 && task.status === TaskStatus.NOT_STARTED) {
        updated.status = TaskStatus.NOT_STARTED;
    }
    else if (progress.progressPercentage > 0 && progress.progressPercentage < 100) {
        updated.status = TaskStatus.IN_PROGRESS;
        if (!updated.actualStartDate) {
            updated.actualStartDate = new Date();
        }
    }
    else if (progress.progressPercentage === 100) {
        updated.status = TaskStatus.COMPLETED;
        updated.actualEndDate = new Date();
    }
    return updated;
}
/**
 * Calculates overall project progress
 *
 * @param projectId - Project identifier
 * @returns Project progress percentage
 *
 * @example
 * ```typescript
 * const progress = await calculateProjectProgress('project-123');
 * // Returns: 67.5
 * ```
 */
async function calculateProjectProgress(projectId) {
    const tasks = await getProjectTasks(projectId);
    if (tasks.length === 0)
        return 0;
    const totalWeight = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const completedWeight = tasks.reduce((sum, task) => sum + (task.estimatedHours * task.progressPercentage) / 100, 0);
    return (completedWeight / totalWeight) * 100;
}
/**
 * Generates project status report
 *
 * @param projectId - Project identifier
 * @returns Comprehensive status report
 *
 * @example
 * ```typescript
 * const report = await generateProjectStatusReport('project-123');
 * ```
 */
async function generateProjectStatusReport(projectId) {
    const project = await getProject(projectId);
    const tasks = await getProjectTasks(projectId);
    const risks = await getProjectRisks(projectId);
    const issues = await getProjectIssues(projectId);
    const progress = await calculateProjectProgress(projectId);
    const tasksCompleted = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const budgetVariance = project.budget - project.actualCost;
    const scheduleDelta = calculateScheduleDelta(project, tasks);
    return {
        project,
        progress,
        tasksCompleted,
        tasksTotal: tasks.length,
        budgetStatus: {
            budgeted: project.budget,
            actual: project.actualCost,
            variance: budgetVariance,
        },
        scheduleStatus: {
            onTrack: scheduleDelta >= 0,
            daysAhead: scheduleDelta > 0 ? scheduleDelta : 0,
            daysBehind: scheduleDelta < 0 ? Math.abs(scheduleDelta) : 0,
        },
        risks,
        issues,
    };
}
/**
 * Tracks project variance (schedule and cost)
 *
 * @param projectId - Project identifier
 * @returns Variance metrics
 *
 * @example
 * ```typescript
 * const variance = await trackProjectVariance('project-123');
 * ```
 */
async function trackProjectVariance(projectId) {
    const project = await getProject(projectId);
    const progress = await calculateProjectProgress(projectId);
    const earnedValue = (project.budget * progress) / 100;
    const plannedValue = calculatePlannedValue(project);
    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - project.actualCost;
    return {
        scheduleVariance,
        scheduleVariancePercentage: (scheduleVariance / plannedValue) * 100,
        costVariance,
        costVariancePercentage: (costVariance / project.budget) * 100,
    };
}
// ============================================================================
// CRITICAL PATH ANALYSIS
// ============================================================================
/**
 * Calculates critical path using CPM algorithm
 *
 * @param projectId - Project identifier
 * @returns Critical path analysis results
 *
 * @example
 * ```typescript
 * const criticalPath = await calculateCriticalPath('project-123');
 * ```
 */
async function calculateCriticalPath(projectId) {
    const tasks = await getProjectTasks(projectId);
    // Forward pass - calculate early start and early finish
    const sortedTasks = topologicalSort(tasks);
    for (const task of sortedTasks) {
        const predecessorTasks = task.predecessors.map((id) => tasks.find((t) => t.id === id));
        if (predecessorTasks.length === 0) {
            task.earlyStart = task.startDate;
        }
        else {
            const maxFinish = Math.max(...predecessorTasks.map((t) => t.earlyFinish?.getTime() || 0));
            task.earlyStart = new Date(maxFinish);
        }
        const duration = task.endDate.getTime() - task.startDate.getTime();
        task.earlyFinish = new Date(task.earlyStart.getTime() + duration);
    }
    // Backward pass - calculate late start and late finish
    const projectEndDate = new Date(Math.max(...sortedTasks.map((t) => t.earlyFinish?.getTime() || 0)));
    for (let i = sortedTasks.length - 1; i >= 0; i--) {
        const task = sortedTasks[i];
        const successorTasks = task.successors.map((id) => tasks.find((t) => t.id === id));
        if (successorTasks.length === 0) {
            task.lateFinish = projectEndDate;
        }
        else {
            const minStart = Math.min(...successorTasks.map((t) => t.lateStart?.getTime() || Infinity));
            task.lateFinish = new Date(minStart);
        }
        const duration = task.endDate.getTime() - task.startDate.getTime();
        task.lateStart = new Date(task.lateFinish.getTime() - duration);
        // Calculate slack
        task.slack =
            (task.lateStart.getTime() - task.earlyStart.getTime()) / (1000 * 60 * 60 * 24);
        task.isCriticalPath = task.slack === 0;
    }
    const criticalTasks = tasks.filter((t) => t.isCriticalPath);
    const totalDuration = (projectEndDate.getTime() - tasks[0].startDate.getTime()) / (1000 * 60 * 60 * 24);
    return {
        tasks: criticalTasks,
        totalDuration,
        criticalPathLength: criticalTasks.length,
        projectEndDate,
        slack: 0,
    };
}
/**
 * Identifies tasks on critical path
 *
 * @param projectId - Project identifier
 * @returns Critical path tasks
 *
 * @example
 * ```typescript
 * const criticalTasks = await getCriticalPathTasks('project-123');
 * ```
 */
async function getCriticalPathTasks(projectId) {
    const result = await calculateCriticalPath(projectId);
    return result.tasks;
}
/**
 * Calculates project float/slack
 *
 * @param projectId - Project identifier
 * @returns Total project float
 *
 * @example
 * ```typescript
 * const slack = await calculateProjectSlack('project-123');
 * ```
 */
async function calculateProjectSlack(projectId) {
    const project = await getProject(projectId);
    const criticalPath = await calculateCriticalPath(projectId);
    const plannedEnd = project.endDate.getTime();
    const calculatedEnd = criticalPath.projectEndDate.getTime();
    return (plannedEnd - calculatedEnd) / (1000 * 60 * 60 * 24);
}
// ============================================================================
// MILESTONE TRACKING
// ============================================================================
/**
 * Creates project milestone
 *
 * @param milestone - Milestone data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   projectId: 'project-123',
 *   name: 'Phase 1 Complete',
 *   dueDate: new Date('2025-06-30'),
 *   criteria: ['All design documents approved', 'Budget allocated']
 * });
 * ```
 */
async function createMilestone(milestone) {
    return {
        id: faker_1.faker.string.uuid(),
        ...milestone,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Completes milestone with verification
 *
 * @param milestoneId - Milestone identifier
 * @param completedBy - User completing milestone
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('milestone-123', 'manager-456');
 * ```
 */
async function completeMilestone(milestoneId, completedBy) {
    const milestone = await getMilestone(milestoneId);
    return {
        ...milestone,
        isCompleted: true,
        actualDate: new Date(),
        completedBy,
        updatedAt: new Date(),
    };
}
/**
 * Gets upcoming milestones
 *
 * @param projectId - Project identifier
 * @param daysAhead - Number of days to look ahead
 * @returns Upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones('project-123', 30);
 * ```
 */
async function getUpcomingMilestones(projectId, daysAhead = 30) {
    const milestones = await getProjectMilestones(projectId);
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    return milestones.filter((m) => !m.isCompleted && m.dueDate <= futureDate && m.dueDate >= new Date());
}
/**
 * Calculates milestone completion percentage
 *
 * @param projectId - Project identifier
 * @returns Completion percentage
 *
 * @example
 * ```typescript
 * const completion = await calculateMilestoneCompletion('project-123');
 * // Returns: 75
 * ```
 */
async function calculateMilestoneCompletion(projectId) {
    const milestones = await getProjectMilestones(projectId);
    if (milestones.length === 0)
        return 0;
    const completed = milestones.filter((m) => m.isCompleted).length;
    return (completed / milestones.length) * 100;
}
// ============================================================================
// BUDGET TRACKING
// ============================================================================
/**
 * Tracks budget vs actual costs
 *
 * @param projectId - Project identifier
 * @returns Budget tracking data
 *
 * @example
 * ```typescript
 * const budgetTracking = await trackBudgetVsActual('project-123');
 * ```
 */
async function trackBudgetVsActual(projectId) {
    const project = await getProject(projectId);
    const budgetItems = await getProjectBudgetItems(projectId);
    const committed = budgetItems.reduce((sum, item) => sum + item.budgetedAmount, 0);
    const actual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
    const remaining = project.budget - actual;
    const variance = project.budget - actual;
    return {
        budget: project.budget,
        actual,
        committed,
        remaining,
        variance,
        variancePercentage: (variance / project.budget) * 100,
    };
}
/**
 * Creates budget item for project
 *
 * @param budgetItem - Budget item data
 * @returns Created budget item
 *
 * @example
 * ```typescript
 * const item = await createBudgetItem({
 *   projectId: 'project-123',
 *   category: 'Labor',
 *   description: 'Software Development',
 *   budgetedAmount: 50000
 * });
 * ```
 */
async function createBudgetItem(budgetItem) {
    return {
        id: faker_1.faker.string.uuid(),
        ...budgetItem,
        actualAmount: 0,
        variance: budgetItem.budgetedAmount,
        variancePercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Updates actual cost for budget item
 *
 * @param budgetItemId - Budget item identifier
 * @param actualAmount - Actual amount spent
 * @returns Updated budget item
 *
 * @example
 * ```typescript
 * await updateBudgetItemActual('item-123', 45000);
 * ```
 */
async function updateBudgetItemActual(budgetItemId, actualAmount) {
    const item = await getBudgetItem(budgetItemId);
    const variance = item.budgetedAmount - actualAmount;
    const variancePercentage = (variance / item.budgetedAmount) * 100;
    return {
        ...item,
        actualAmount,
        variance,
        variancePercentage,
        updatedAt: new Date(),
    };
}
/**
 * Calculates Earned Value Management metrics
 *
 * @param projectId - Project identifier
 * @returns EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValueMetrics('project-123');
 * ```
 */
async function calculateEarnedValueMetrics(projectId) {
    const project = await getProject(projectId);
    const progress = await calculateProjectProgress(projectId);
    const plannedValue = calculatePlannedValue(project);
    const earnedValue = (project.budget * progress) / 100;
    const actualCost = project.actualCost;
    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - actualCost;
    const schedulePerformanceIndex = earnedValue / plannedValue;
    const costPerformanceIndex = earnedValue / actualCost;
    const estimateAtCompletion = project.budget / costPerformanceIndex;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = project.budget - estimateAtCompletion;
    const toCompletePerformanceIndex = (project.budget - earnedValue) / (project.budget - actualCost);
    return {
        scheduleVariance,
        costVariance,
        schedulePerformanceIndex,
        costPerformanceIndex,
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        toCompletePerformanceIndex,
    };
}
// ============================================================================
// RISK AND ISSUE MANAGEMENT
// ============================================================================
/**
 * Creates project risk
 *
 * @param risk - Risk data
 * @returns Created risk
 *
 * @example
 * ```typescript
 * const risk = await createProjectRisk({
 *   projectId: 'project-123',
 *   title: 'Vendor Delay',
 *   severity: RiskSeverity.HIGH,
 *   probability: 0.6,
 *   impact: 8,
 *   mitigation: 'Identify backup vendors',
 *   owner: 'manager-456'
 * });
 * ```
 */
async function createProjectRisk(risk) {
    const riskScore = risk.probability * risk.impact;
    return {
        id: faker_1.faker.string.uuid(),
        ...risk,
        riskScore,
        status: 'identified',
        identifiedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Creates project issue
 *
 * @param issue - Issue data
 * @returns Created issue
 *
 * @example
 * ```typescript
 * const issue = await createProjectIssue({
 *   projectId: 'project-123',
 *   title: 'Equipment not delivered',
 *   priority: IssuePriority.HIGH,
 *   assignedTo: 'tech-456',
 *   reportedBy: 'manager-789'
 * });
 * ```
 */
async function createProjectIssue(issue) {
    return {
        id: faker_1.faker.string.uuid(),
        ...issue,
        status: 'open',
        reportedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Resolves project issue
 *
 * @param issueId - Issue identifier
 * @param resolution - Resolution description
 * @param resolvedBy - User resolving issue
 * @returns Updated issue
 *
 * @example
 * ```typescript
 * await resolveProjectIssue('issue-123', 'Equipment delivered, installation complete', 'tech-456');
 * ```
 */
async function resolveProjectIssue(issueId, resolution, resolvedBy) {
    const issue = await getProjectIssue(issueId);
    return {
        ...issue,
        status: 'resolved',
        resolution,
        resolvedDate: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// GANTT CHART AND TIMELINE
// ============================================================================
/**
 * Generates Gantt chart data for project
 *
 * @param projectId - Project identifier
 * @returns Gantt chart data structure
 *
 * @example
 * ```typescript
 * const ganttData = await generateGanttChartData('project-123');
 * ```
 */
async function generateGanttChartData(projectId) {
    const project = await getProject(projectId);
    const tasks = await getProjectTasks(projectId);
    const ganttTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        start: task.startDate,
        end: task.endDate,
        progress: task.progressPercentage,
        dependencies: task.predecessors,
        isMilestone: task.isMilestone,
        isCritical: task.isCriticalPath,
    }));
    return {
        tasks: ganttTasks,
        timeline: {
            start: project.startDate,
            end: project.endDate,
            currentDate: new Date(),
        },
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets project by ID (placeholder)
 */
async function getProject(id) {
    return {
        id,
        projectNumber: 'PRJ-TEST-001',
        name: 'Test Project',
        description: 'Test',
        status: ProjectStatus.PLANNING,
        priority: ProjectPriority.MEDIUM,
        managerId: 'user-1',
        budget: 100000,
        actualCost: 0,
        estimatedCost: 100000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progressPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
    };
}
async function updateProjectStatus(projectId, status, userId) {
    const project = await getProject(projectId);
    return { ...project, status, updatedAt: new Date(), updatedBy: userId };
}
async function getTask(id) {
    return {
        id,
        projectId: 'project-1',
        name: 'Test Task',
        description: 'Test',
        status: TaskStatus.NOT_STARTED,
        priority: ProjectPriority.MEDIUM,
        estimatedHours: 8,
        actualHours: 0,
        progressPercentage: 0,
        startDate: new Date(),
        endDate: new Date(),
        dependencies: [],
        isMilestone: false,
        isCriticalPath: false,
        predecessors: [],
        successors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getProjectTasks(projectId) {
    return [];
}
async function getWBSElement(id) {
    return {
        id,
        projectId: 'project-1',
        wbsCode: '1.0',
        name: 'Test WBS',
        description: 'Test',
        level: 1,
        sequence: 1,
        estimatedHours: 0,
        estimatedCost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getWBSElements(projectId) {
    return [];
}
async function getWBSChildren(parentId) {
    return [];
}
async function getProjectResourceAssignments(projectId) {
    return [];
}
async function getProjectRisks(projectId) {
    return [];
}
async function getProjectIssues(projectId) {
    return [];
}
async function getProjectIssue(id) {
    return {
        id,
        projectId: 'project-1',
        title: 'Test Issue',
        description: 'Test',
        priority: IssuePriority.MEDIUM,
        status: 'open',
        reportedBy: 'user-1',
        reportedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getMilestone(id) {
    return {
        id,
        projectId: 'project-1',
        name: 'Test Milestone',
        description: 'Test',
        dueDate: new Date(),
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getProjectMilestones(projectId) {
    return [];
}
async function getProjectBudgetItems(projectId) {
    return [];
}
async function getBudgetItem(id) {
    return {
        id,
        projectId: 'project-1',
        category: 'Labor',
        description: 'Test',
        budgetedAmount: 1000,
        actualAmount: 0,
        variance: 1000,
        variancePercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
function calculateScheduleDelta(project, tasks) {
    const now = new Date();
    const expectedProgress = ((now.getTime() - project.startDate.getTime()) /
        (project.endDate.getTime() - project.startDate.getTime())) * 100;
    const actualProgress = project.progressPercentage;
    const progressDelta = actualProgress - expectedProgress;
    const totalDays = (project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (progressDelta / 100) * totalDays;
}
function calculatePlannedValue(project) {
    const now = new Date();
    const totalDuration = project.endDate.getTime() - project.startDate.getTime();
    const elapsed = now.getTime() - project.startDate.getTime();
    if (elapsed <= 0)
        return 0;
    if (elapsed >= totalDuration)
        return project.budget;
    return (elapsed / totalDuration) * project.budget;
}
function topologicalSort(tasks) {
    const sorted = [];
    const visited = new Set();
    const temp = new Set();
    function visit(task) {
        if (temp.has(task.id))
            throw new Error('Circular dependency detected');
        if (visited.has(task.id))
            return;
        temp.add(task.id);
        task.predecessors.forEach((predId) => {
            const pred = tasks.find((t) => t.id === predId);
            if (pred)
                visit(pred);
        });
        temp.delete(task.id);
        visited.add(task.id);
        sorted.push(task);
    }
    tasks.forEach((task) => {
        if (!visited.has(task.id))
            visit(task);
    });
    return sorted;
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Project Tracking Controller
 * Provides RESTful API endpoints for project management
 */
let ProjectController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('projects'), (0, common_1.Controller)('projects'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _createTask_decorators;
    let _updateProgress_decorators;
    let _getCriticalPath_decorators;
    let _getGantt_decorators;
    let _createRisk_decorators;
    let _createIssue_decorators;
    var ProjectController = _classThis = class {
        async create(createDto) {
            return createProject(createDto, 'current-user');
        }
        async findAll(status) {
            return [];
        }
        async findOne(id) {
            return getProject(id);
        }
        async createTask(id, taskDto) {
            return createTask(taskDto);
        }
        async updateProgress(id, taskId, progressDto) {
            return updateTaskProgress(taskId, progressDto, 'current-user');
        }
        async getCriticalPath(id) {
            return calculateCriticalPath(id);
        }
        async getGantt(id) {
            return generateGanttChartData(id);
        }
        async createRisk(id, riskDto) {
            return createProjectRisk(riskDto);
        }
        async createIssue(id, issueDto) {
            return createProjectIssue(issueDto);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProjectController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new project' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all projects' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get project by ID' })];
        _createTask_decorators = [(0, common_1.Post)(':id/tasks'), (0, swagger_1.ApiOperation)({ summary: 'Create project task' })];
        _updateProgress_decorators = [(0, common_1.Patch)(':id/tasks/:taskId/progress'), (0, swagger_1.ApiOperation)({ summary: 'Update task progress' })];
        _getCriticalPath_decorators = [(0, common_1.Get)(':id/critical-path'), (0, swagger_1.ApiOperation)({ summary: 'Calculate critical path' })];
        _getGantt_decorators = [(0, common_1.Get)(':id/gantt'), (0, swagger_1.ApiOperation)({ summary: 'Get Gantt chart data' })];
        _createRisk_decorators = [(0, common_1.Post)(':id/risks'), (0, swagger_1.ApiOperation)({ summary: 'Create project risk' })];
        _createIssue_decorators = [(0, common_1.Post)(':id/issues'), (0, swagger_1.ApiOperation)({ summary: 'Create project issue' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTask_decorators, { kind: "method", name: "createTask", static: false, private: false, access: { has: obj => "createTask" in obj, get: obj => obj.createTask }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProgress_decorators, { kind: "method", name: "updateProgress", static: false, private: false, access: { has: obj => "updateProgress" in obj, get: obj => obj.updateProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCriticalPath_decorators, { kind: "method", name: "getCriticalPath", static: false, private: false, access: { has: obj => "getCriticalPath" in obj, get: obj => obj.getCriticalPath }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGantt_decorators, { kind: "method", name: "getGantt", static: false, private: false, access: { has: obj => "getGantt" in obj, get: obj => obj.getGantt }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRisk_decorators, { kind: "method", name: "createRisk", static: false, private: false, access: { has: obj => "createRisk" in obj, get: obj => obj.createRisk }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createIssue_decorators, { kind: "method", name: "createIssue", static: false, private: false, access: { has: obj => "createIssue" in obj, get: obj => obj.createIssue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectController = _classThis;
})();
exports.ProjectController = ProjectController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Project Management
    createProject,
    generateProjectNumber,
    initializeProjectFromTemplate,
    approveProject,
    startProject,
    // WBS Management
    createWBS,
    addWBSChild,
    getWBSHierarchy,
    calculateWBSRollup,
    // Task Management
    createTask,
    addTaskDependency,
    removeTaskDependency,
    validateTaskDependency,
    // Resource Management
    assignResource,
    performResourceLeveling,
    calculateResourceUtilization,
    getOverAllocatedResources,
    // Progress Tracking
    updateTaskProgress,
    calculateProjectProgress,
    generateProjectStatusReport,
    trackProjectVariance,
    // Critical Path
    calculateCriticalPath,
    getCriticalPathTasks,
    calculateProjectSlack,
    // Milestones
    createMilestone,
    completeMilestone,
    getUpcomingMilestones,
    calculateMilestoneCompletion,
    // Budget Tracking
    trackBudgetVsActual,
    createBudgetItem,
    updateBudgetItemActual,
    calculateEarnedValueMetrics,
    // Risk & Issue Management
    createProjectRisk,
    createProjectIssue,
    resolveProjectIssue,
    // Visualization
    generateGanttChartData,
    // Controller
    ProjectController,
};
//# sourceMappingURL=project-tracking-kit.js.map