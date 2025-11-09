"use strict";
/**
 * Capital Projects Management Kit
 *
 * Enterprise-grade utilities for managing capital projects including:
 * - Project initiation and planning
 * - Budget management and forecasting
 * - Milestone tracking and timeline management
 * - Resource allocation and cost control
 * - Change order and risk management
 * - Stakeholder communication and closeout procedures
 *
 * @module PropertyCapitalProjectsKit
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
exports.CapitalProjectsService = exports.BudgetForecastDto = exports.ProjectCloseoutDto = exports.StakeholderCommunicationDto = exports.ProjectRiskDto = exports.ChangeOrderDto = exports.ResourceAllocationDto = exports.ProjectMilestoneDto = exports.ProjectBudgetDto = exports.CreateCapitalProjectDto = exports.CommunicationType = exports.ResourceType = exports.RiskLevel = exports.ChangeOrderStatus = exports.MilestoneStatus = exports.ProjectType = exports.ProjectPriority = exports.ProjectStatus = void 0;
exports.createCapitalProject = createCapitalProject;
exports.generateProjectCharter = generateProjectCharter;
exports.createWorkBreakdownStructure = createWorkBreakdownStructure;
exports.performFeasibilityAnalysis = performFeasibilityAnalysis;
exports.approveProject = approveProject;
exports.allocateProjectBudget = allocateProjectBudget;
exports.trackProjectExpenditure = trackProjectExpenditure;
exports.generateBudgetForecast = generateBudgetForecast;
exports.analyzeBudgetStatus = analyzeBudgetStatus;
exports.manageContingencyReserve = manageContingencyReserve;
exports.createProjectMilestone = createProjectMilestone;
exports.updateMilestoneProgress = updateMilestoneProgress;
exports.validateMilestoneDependencies = validateMilestoneDependencies;
exports.generateMilestoneReport = generateMilestoneReport;
exports.adjustMilestoneTimelines = adjustMilestoneTimelines;
exports.allocateProjectResource = allocateProjectResource;
exports.trackResourceUtilization = trackResourceUtilization;
exports.analyzeResourceUtilization = analyzeResourceUtilization;
exports.optimizeResourceAllocation = optimizeResourceAllocation;
exports.forecastResourceNeeds = forecastResourceNeeds;
exports.analyzeCostVariance = analyzeCostVariance;
exports.calculateEstimateAtCompletion = calculateEstimateAtCompletion;
exports.performEarnedValueAnalysis = performEarnedValueAnalysis;
exports.manageCostBaseline = manageCostBaseline;
exports.createChangeOrder = createChangeOrder;
exports.reviewChangeOrder = reviewChangeOrder;
exports.analyzeChangeOrderImpact = analyzeChangeOrderImpact;
exports.trackChangeOrderImplementation = trackChangeOrderImplementation;
exports.createProjectSchedule = createProjectSchedule;
exports.analyzeSchedulePerformance = analyzeSchedulePerformance;
exports.calculateCriticalPath = calculateCriticalPath;
exports.generateTimelineReport = generateTimelineReport;
exports.registerProjectRisk = registerProjectRisk;
exports.performRiskAssessment = performRiskAssessment;
exports.createRiskMitigationPlan = createRiskMitigationPlan;
exports.updateRiskStatus = updateRiskStatus;
exports.generateRiskMatrix = generateRiskMatrix;
exports.createStakeholderCommunication = createStakeholderCommunication;
exports.generateStakeholderStatusReport = generateStakeholderStatusReport;
exports.trackStakeholderEngagement = trackStakeholderEngagement;
exports.distributeProjectCommunication = distributeProjectCommunication;
exports.initiateProjectCloseout = initiateProjectCloseout;
exports.conductFinalProjectAudit = conductFinalProjectAudit;
exports.archiveProjectDocumentation = archiveProjectDocumentation;
exports.captureLessonsLearned = captureLessonsLearned;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// =====================================================================
// ENUMS
// =====================================================================
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "PLANNING";
    ProjectStatus["APPROVED"] = "APPROVED";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["ON_HOLD"] = "ON_HOLD";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["CANCELLED"] = "CANCELLED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["CRITICAL"] = "CRITICAL";
    ProjectPriority["HIGH"] = "HIGH";
    ProjectPriority["MEDIUM"] = "MEDIUM";
    ProjectPriority["LOW"] = "LOW";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
var ProjectType;
(function (ProjectType) {
    ProjectType["NEW_CONSTRUCTION"] = "NEW_CONSTRUCTION";
    ProjectType["RENOVATION"] = "RENOVATION";
    ProjectType["MAINTENANCE"] = "MAINTENANCE";
    ProjectType["INFRASTRUCTURE"] = "INFRASTRUCTURE";
    ProjectType["TECHNOLOGY"] = "TECHNOLOGY";
    ProjectType["ENVIRONMENTAL"] = "ENVIRONMENTAL";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "PENDING";
    MilestoneStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MilestoneStatus["COMPLETED"] = "COMPLETED";
    MilestoneStatus["DELAYED"] = "DELAYED";
    MilestoneStatus["CANCELLED"] = "CANCELLED";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
var ChangeOrderStatus;
(function (ChangeOrderStatus) {
    ChangeOrderStatus["DRAFT"] = "DRAFT";
    ChangeOrderStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    ChangeOrderStatus["APPROVED"] = "APPROVED";
    ChangeOrderStatus["REJECTED"] = "REJECTED";
    ChangeOrderStatus["IMPLEMENTED"] = "IMPLEMENTED";
})(ChangeOrderStatus || (exports.ChangeOrderStatus = ChangeOrderStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["CRITICAL"] = "CRITICAL";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["LOW"] = "LOW";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["LABOR"] = "LABOR";
    ResourceType["EQUIPMENT"] = "EQUIPMENT";
    ResourceType["MATERIAL"] = "MATERIAL";
    ResourceType["CONTRACTOR"] = "CONTRACTOR";
    ResourceType["CONSULTANT"] = "CONSULTANT";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
var CommunicationType;
(function (CommunicationType) {
    CommunicationType["EMAIL"] = "EMAIL";
    CommunicationType["MEETING"] = "MEETING";
    CommunicationType["REPORT"] = "REPORT";
    CommunicationType["NOTIFICATION"] = "NOTIFICATION";
    CommunicationType["PRESENTATION"] = "PRESENTATION";
})(CommunicationType || (exports.CommunicationType = CommunicationType = {}));
// =====================================================================
// DTOS
// =====================================================================
let CreateCapitalProjectDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _projectType_decorators;
    let _projectType_initializers = [];
    let _projectType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _propertyId_decorators;
    let _propertyId_initializers = [];
    let _propertyId_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _plannedStartDate_decorators;
    let _plannedStartDate_initializers = [];
    let _plannedStartDate_extraInitializers = [];
    let _plannedEndDate_decorators;
    let _plannedEndDate_initializers = [];
    let _plannedEndDate_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    return _a = class CreateCapitalProjectDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.projectType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _projectType_initializers, void 0));
                this.priority = (__runInitializers(this, _projectType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.propertyId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.plannedStartDate = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _plannedStartDate_initializers, void 0));
                this.plannedEndDate = (__runInitializers(this, _plannedStartDate_extraInitializers), __runInitializers(this, _plannedEndDate_initializers, void 0));
                this.projectManagerId = (__runInitializers(this, _plannedEndDate_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
                this.department = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                __runInitializers(this, _department_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project description' }), (0, class_validator_1.IsString)()];
            _projectType_decorators = [(0, swagger_1.ApiProperty)({ enum: ProjectType, description: 'Type of capital project' }), (0, class_validator_1.IsEnum)(ProjectType)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ProjectPriority, description: 'Project priority level' }), (0, class_validator_1.IsEnum)(ProjectPriority)];
            _propertyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Property ID associated with the project' }), (0, class_validator_1.IsUUID)()];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget allocated' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _plannedStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _plannedEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned completion date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _projectManagerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Project manager ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _department_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Department or business unit' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _projectType_decorators, { kind: "field", name: "projectType", static: false, private: false, access: { has: obj => "projectType" in obj, get: obj => obj.projectType, set: (obj, value) => { obj.projectType = value; } }, metadata: _metadata }, _projectType_initializers, _projectType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: obj => "propertyId" in obj, get: obj => obj.propertyId, set: (obj, value) => { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _plannedStartDate_decorators, { kind: "field", name: "plannedStartDate", static: false, private: false, access: { has: obj => "plannedStartDate" in obj, get: obj => obj.plannedStartDate, set: (obj, value) => { obj.plannedStartDate = value; } }, metadata: _metadata }, _plannedStartDate_initializers, _plannedStartDate_extraInitializers);
            __esDecorate(null, null, _plannedEndDate_decorators, { kind: "field", name: "plannedEndDate", static: false, private: false, access: { has: obj => "plannedEndDate" in obj, get: obj => obj.plannedEndDate, set: (obj, value) => { obj.plannedEndDate = value; } }, metadata: _metadata }, _plannedEndDate_initializers, _plannedEndDate_extraInitializers);
            __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCapitalProjectDto = CreateCapitalProjectDto;
let ProjectBudgetDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _allocatedAmount_decorators;
    let _allocatedAmount_initializers = [];
    let _allocatedAmount_extraInitializers = [];
    let _spentAmount_decorators;
    let _spentAmount_initializers = [];
    let _spentAmount_extraInitializers = [];
    let _committedAmount_decorators;
    let _committedAmount_initializers = [];
    let _committedAmount_extraInitializers = [];
    return _a = class ProjectBudgetDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.allocatedAmount = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _allocatedAmount_initializers, void 0));
                this.spentAmount = (__runInitializers(this, _allocatedAmount_extraInitializers), __runInitializers(this, _spentAmount_initializers, void 0));
                this.committedAmount = (__runInitializers(this, _spentAmount_extraInitializers), __runInitializers(this, _committedAmount_initializers, void 0));
                __runInitializers(this, _committedAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget category name' }), (0, class_validator_1.IsString)()];
            _allocatedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocated amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _spentAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Spent amount' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _committedAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Committed amount' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _allocatedAmount_decorators, { kind: "field", name: "allocatedAmount", static: false, private: false, access: { has: obj => "allocatedAmount" in obj, get: obj => obj.allocatedAmount, set: (obj, value) => { obj.allocatedAmount = value; } }, metadata: _metadata }, _allocatedAmount_initializers, _allocatedAmount_extraInitializers);
            __esDecorate(null, null, _spentAmount_decorators, { kind: "field", name: "spentAmount", static: false, private: false, access: { has: obj => "spentAmount" in obj, get: obj => obj.spentAmount, set: (obj, value) => { obj.spentAmount = value; } }, metadata: _metadata }, _spentAmount_initializers, _spentAmount_extraInitializers);
            __esDecorate(null, null, _committedAmount_decorators, { kind: "field", name: "committedAmount", static: false, private: false, access: { has: obj => "committedAmount" in obj, get: obj => obj.committedAmount, set: (obj, value) => { obj.committedAmount = value; } }, metadata: _metadata }, _committedAmount_initializers, _committedAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProjectBudgetDto = ProjectBudgetDto;
let ProjectMilestoneDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _completionPercentage_decorators;
    let _completionPercentage_initializers = [];
    let _completionPercentage_extraInitializers = [];
    return _a = class ProjectMilestoneDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.targetDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.dependencies = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
                this.completionPercentage = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _completionPercentage_initializers, void 0));
                __runInitializers(this, _completionPercentage_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Milestone name' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Milestone description' }), (0, class_validator_1.IsString)()];
            _targetDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target completion date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _dependencies_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Milestone dependencies (milestone IDs)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _completionPercentage_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Completion percentage' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
            __esDecorate(null, null, _completionPercentage_decorators, { kind: "field", name: "completionPercentage", static: false, private: false, access: { has: obj => "completionPercentage" in obj, get: obj => obj.completionPercentage, set: (obj, value) => { obj.completionPercentage = value; } }, metadata: _metadata }, _completionPercentage_initializers, _completionPercentage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProjectMilestoneDto = ProjectMilestoneDto;
let ResourceAllocationDto = (() => {
    var _a;
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _resourceName_decorators;
    let _resourceName_initializers = [];
    let _resourceName_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitCost_decorators;
    let _unitCost_initializers = [];
    let _unitCost_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class ResourceAllocationDto {
            constructor() {
                this.resourceType = __runInitializers(this, _resourceType_initializers, void 0);
                this.resourceName = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _resourceName_initializers, void 0));
                this.quantity = (__runInitializers(this, _resourceName_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitCost = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
                this.startDate = (__runInitializers(this, _unitCost_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.notes = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceType_decorators = [(0, swagger_1.ApiProperty)({ enum: ResourceType, description: 'Type of resource' }), (0, class_validator_1.IsEnum)(ResourceType)];
            _resourceName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource name or identifier' }), (0, class_validator_1.IsString)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity allocated' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _unitCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date for allocation' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date for allocation' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notes about the resource' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _resourceName_decorators, { kind: "field", name: "resourceName", static: false, private: false, access: { has: obj => "resourceName" in obj, get: obj => obj.resourceName, set: (obj, value) => { obj.resourceName = value; } }, metadata: _metadata }, _resourceName_initializers, _resourceName_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: obj => "unitCost" in obj, get: obj => obj.unitCost, set: (obj, value) => { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ResourceAllocationDto = ResourceAllocationDto;
let ChangeOrderDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _scheduleImpact_decorators;
    let _scheduleImpact_initializers = [];
    let _scheduleImpact_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    return _a = class ChangeOrderDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.reason = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.costImpact = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
                this.scheduleImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _scheduleImpact_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _scheduleImpact_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                this.attachments = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change order title' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change order description' }), (0, class_validator_1.IsString)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for change' }), (0, class_validator_1.IsString)()];
            _costImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost impact (can be negative)' }), (0, class_validator_1.IsNumber)()];
            _scheduleImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule impact in days (can be negative)' }), (0, class_validator_1.IsNumber)()];
            _requestedBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Requested by (user ID)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _attachments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Supporting documentation URLs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
            __esDecorate(null, null, _scheduleImpact_decorators, { kind: "field", name: "scheduleImpact", static: false, private: false, access: { has: obj => "scheduleImpact" in obj, get: obj => obj.scheduleImpact, set: (obj, value) => { obj.scheduleImpact = value; } }, metadata: _metadata }, _scheduleImpact_initializers, _scheduleImpact_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ChangeOrderDto = ChangeOrderDto;
let ProjectRiskDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    let _probability_decorators;
    let _probability_initializers = [];
    let _probability_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _mitigationStrategy_decorators;
    let _mitigationStrategy_initializers = [];
    let _mitigationStrategy_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    return _a = class ProjectRiskDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.riskLevel = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
                this.probability = (__runInitializers(this, _riskLevel_extraInitializers), __runInitializers(this, _probability_initializers, void 0));
                this.costImpact = (__runInitializers(this, _probability_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
                this.mitigationStrategy = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _mitigationStrategy_initializers, void 0));
                this.ownerId = (__runInitializers(this, _mitigationStrategy_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk title' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk description' }), (0, class_validator_1.IsString)()];
            _riskLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: RiskLevel, description: 'Risk severity level' }), (0, class_validator_1.IsEnum)(RiskLevel)];
            _probability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Probability of occurrence (0-100)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _costImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Potential cost impact' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _mitigationStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mitigation strategy' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ownerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Risk owner (user ID)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
            __esDecorate(null, null, _probability_decorators, { kind: "field", name: "probability", static: false, private: false, access: { has: obj => "probability" in obj, get: obj => obj.probability, set: (obj, value) => { obj.probability = value; } }, metadata: _metadata }, _probability_initializers, _probability_extraInitializers);
            __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
            __esDecorate(null, null, _mitigationStrategy_decorators, { kind: "field", name: "mitigationStrategy", static: false, private: false, access: { has: obj => "mitigationStrategy" in obj, get: obj => obj.mitigationStrategy, set: (obj, value) => { obj.mitigationStrategy = value; } }, metadata: _metadata }, _mitigationStrategy_initializers, _mitigationStrategy_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProjectRiskDto = ProjectRiskDto;
let StakeholderCommunicationDto = (() => {
    var _a;
    let _communicationType_decorators;
    let _communicationType_initializers = [];
    let _communicationType_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _recipients_decorators;
    let _recipients_initializers = [];
    let _recipients_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    return _a = class StakeholderCommunicationDto {
            constructor() {
                this.communicationType = __runInitializers(this, _communicationType_initializers, void 0);
                this.subject = (__runInitializers(this, _communicationType_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.content = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.recipients = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _recipients_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _recipients_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.attachments = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _communicationType_decorators = [(0, swagger_1.ApiProperty)({ enum: CommunicationType, description: 'Type of communication' }), (0, class_validator_1.IsEnum)(CommunicationType)];
            _subject_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communication subject' }), (0, class_validator_1.IsString)()];
            _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communication content' }), (0, class_validator_1.IsString)()];
            _recipients_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient IDs or emails' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.ArrayMinSize)(1)];
            _scheduledDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled send date/time' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _attachments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Attachment URLs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _communicationType_decorators, { kind: "field", name: "communicationType", static: false, private: false, access: { has: obj => "communicationType" in obj, get: obj => obj.communicationType, set: (obj, value) => { obj.communicationType = value; } }, metadata: _metadata }, _communicationType_initializers, _communicationType_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _recipients_decorators, { kind: "field", name: "recipients", static: false, private: false, access: { has: obj => "recipients" in obj, get: obj => obj.recipients, set: (obj, value) => { obj.recipients = value; } }, metadata: _metadata }, _recipients_initializers, _recipients_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.StakeholderCommunicationDto = StakeholderCommunicationDto;
let ProjectCloseoutDto = (() => {
    var _a;
    let _actualCompletionDate_decorators;
    let _actualCompletionDate_initializers = [];
    let _actualCompletionDate_extraInitializers = [];
    let _finalCost_decorators;
    let _finalCost_initializers = [];
    let _finalCost_extraInitializers = [];
    let _projectSummary_decorators;
    let _projectSummary_initializers = [];
    let _projectSummary_extraInitializers = [];
    let _lessonsLearned_decorators;
    let _lessonsLearned_initializers = [];
    let _lessonsLearned_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _evaluationScore_decorators;
    let _evaluationScore_initializers = [];
    let _evaluationScore_extraInitializers = [];
    return _a = class ProjectCloseoutDto {
            constructor() {
                this.actualCompletionDate = __runInitializers(this, _actualCompletionDate_initializers, void 0);
                this.finalCost = (__runInitializers(this, _actualCompletionDate_extraInitializers), __runInitializers(this, _finalCost_initializers, void 0));
                this.projectSummary = (__runInitializers(this, _finalCost_extraInitializers), __runInitializers(this, _projectSummary_initializers, void 0));
                this.lessonsLearned = (__runInitializers(this, _projectSummary_extraInitializers), __runInitializers(this, _lessonsLearned_initializers, void 0));
                this.deliverables = (__runInitializers(this, _lessonsLearned_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
                this.evaluationScore = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _evaluationScore_initializers, void 0));
                __runInitializers(this, _evaluationScore_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _actualCompletionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual completion date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final project cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _projectSummary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project summary' }), (0, class_validator_1.IsString)()];
            _lessonsLearned_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Lessons learned' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _deliverables_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Final deliverables URLs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _evaluationScore_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Post-project evaluation score (0-100)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _actualCompletionDate_decorators, { kind: "field", name: "actualCompletionDate", static: false, private: false, access: { has: obj => "actualCompletionDate" in obj, get: obj => obj.actualCompletionDate, set: (obj, value) => { obj.actualCompletionDate = value; } }, metadata: _metadata }, _actualCompletionDate_initializers, _actualCompletionDate_extraInitializers);
            __esDecorate(null, null, _finalCost_decorators, { kind: "field", name: "finalCost", static: false, private: false, access: { has: obj => "finalCost" in obj, get: obj => obj.finalCost, set: (obj, value) => { obj.finalCost = value; } }, metadata: _metadata }, _finalCost_initializers, _finalCost_extraInitializers);
            __esDecorate(null, null, _projectSummary_decorators, { kind: "field", name: "projectSummary", static: false, private: false, access: { has: obj => "projectSummary" in obj, get: obj => obj.projectSummary, set: (obj, value) => { obj.projectSummary = value; } }, metadata: _metadata }, _projectSummary_initializers, _projectSummary_extraInitializers);
            __esDecorate(null, null, _lessonsLearned_decorators, { kind: "field", name: "lessonsLearned", static: false, private: false, access: { has: obj => "lessonsLearned" in obj, get: obj => obj.lessonsLearned, set: (obj, value) => { obj.lessonsLearned = value; } }, metadata: _metadata }, _lessonsLearned_initializers, _lessonsLearned_extraInitializers);
            __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
            __esDecorate(null, null, _evaluationScore_decorators, { kind: "field", name: "evaluationScore", static: false, private: false, access: { has: obj => "evaluationScore" in obj, get: obj => obj.evaluationScore, set: (obj, value) => { obj.evaluationScore = value; } }, metadata: _metadata }, _evaluationScore_initializers, _evaluationScore_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProjectCloseoutDto = ProjectCloseoutDto;
let BudgetForecastDto = (() => {
    var _a;
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _projectedSpending_decorators;
    let _projectedSpending_initializers = [];
    let _projectedSpending_extraInitializers = [];
    let _confidenceLevel_decorators;
    let _confidenceLevel_initializers = [];
    let _confidenceLevel_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    return _a = class BudgetForecastDto {
            constructor() {
                this.periodStart = __runInitializers(this, _periodStart_initializers, void 0);
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.projectedSpending = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _projectedSpending_initializers, void 0));
                this.confidenceLevel = (__runInitializers(this, _projectedSpending_extraInitializers), __runInitializers(this, _confidenceLevel_initializers, void 0));
                this.assumptions = (__runInitializers(this, _confidenceLevel_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                __runInitializers(this, _assumptions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast period start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast period end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _projectedSpending_decorators = [(0, swagger_1.ApiProperty)({ description: 'Projected spending amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _confidenceLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Confidence level (0-100)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _assumptions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assumptions and notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _projectedSpending_decorators, { kind: "field", name: "projectedSpending", static: false, private: false, access: { has: obj => "projectedSpending" in obj, get: obj => obj.projectedSpending, set: (obj, value) => { obj.projectedSpending = value; } }, metadata: _metadata }, _projectedSpending_initializers, _projectedSpending_extraInitializers);
            __esDecorate(null, null, _confidenceLevel_decorators, { kind: "field", name: "confidenceLevel", static: false, private: false, access: { has: obj => "confidenceLevel" in obj, get: obj => obj.confidenceLevel, set: (obj, value) => { obj.confidenceLevel = value; } }, metadata: _metadata }, _confidenceLevel_initializers, _confidenceLevel_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BudgetForecastDto = BudgetForecastDto;
// =====================================================================
// 1. PROJECT INITIATION AND PLANNING (5 functions)
// =====================================================================
/**
 * Creates a new capital project with comprehensive initialization
 */
async function createCapitalProject(projectData, transaction) {
    const logger = new common_1.Logger('createCapitalProject');
    try {
        // Validate date logic
        if (projectData.plannedEndDate <= projectData.plannedStartDate) {
            throw new common_1.BadRequestException('Planned end date must be after start date');
        }
        // Calculate planned duration
        const plannedDuration = Math.ceil((projectData.plannedEndDate.getTime() - projectData.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const project = {
            ...projectData,
            status: ProjectStatus.PLANNING,
            plannedDuration,
            actualStartDate: null,
            actualEndDate: null,
            currentBudget: projectData.totalBudget,
            spentBudget: 0,
            completionPercentage: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        logger.log(`Capital project created: ${project.name} with budget $${project.totalBudget}`);
        return project;
    }
    catch (error) {
        logger.error(`Failed to create capital project: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates a detailed project charter with scope and objectives
 */
async function generateProjectCharter(projectId, scope, objectives, constraints, assumptions, transaction) {
    const logger = new common_1.Logger('generateProjectCharter');
    try {
        if (!objectives || objectives.length === 0) {
            throw new common_1.BadRequestException('At least one objective is required for project charter');
        }
        const charter = {
            projectId,
            scope,
            objectives,
            constraints: constraints || [],
            assumptions: assumptions || [],
            generatedDate: new Date(),
            version: 1,
            status: 'DRAFT',
            approvals: [],
        };
        logger.log(`Project charter generated for project ${projectId} with ${objectives.length} objectives`);
        return charter;
    }
    catch (error) {
        logger.error(`Failed to generate project charter: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Creates a work breakdown structure (WBS) for the project
 */
async function createWorkBreakdownStructure(projectId, phases, transaction) {
    const logger = new common_1.Logger('createWorkBreakdownStructure');
    try {
        if (!phases || phases.length === 0) {
            throw new common_1.BadRequestException('At least one phase is required for WBS');
        }
        const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
        const totalEstimatedHours = phases.reduce((sum, phase) => sum + phase.tasks.reduce((taskSum, task) => taskSum + task.estimatedHours, 0), 0);
        const wbs = {
            projectId,
            phases: phases.map((phase, index) => ({
                ...phase,
                phaseNumber: index + 1,
                taskCount: phase.tasks.length,
                estimatedHours: phase.tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
            })),
            totalPhases: phases.length,
            totalTasks,
            totalEstimatedHours,
            createdAt: new Date(),
            version: 1,
        };
        logger.log(`WBS created for project ${projectId}: ${phases.length} phases, ${totalTasks} tasks`);
        return wbs;
    }
    catch (error) {
        logger.error(`Failed to create work breakdown structure: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Performs feasibility analysis for a capital project
 */
async function performFeasibilityAnalysis(projectId, estimatedROI, estimatedPaybackPeriod, technicalFeasibility, operationalFeasibility, economicFeasibility, transaction) {
    const logger = new common_1.Logger('performFeasibilityAnalysis');
    try {
        // Validate feasibility scores (0-100)
        const scores = [technicalFeasibility, operationalFeasibility, economicFeasibility];
        if (scores.some(score => score < 0 || score > 100)) {
            throw new common_1.BadRequestException('Feasibility scores must be between 0 and 100');
        }
        const overallFeasibility = (technicalFeasibility + operationalFeasibility + economicFeasibility) / 3;
        let recommendation;
        if (overallFeasibility >= 80 && estimatedROI > 15) {
            recommendation = 'HIGHLY_RECOMMENDED';
        }
        else if (overallFeasibility >= 60 && estimatedROI > 10) {
            recommendation = 'RECOMMENDED';
        }
        else if (overallFeasibility >= 40) {
            recommendation = 'CONDITIONAL';
        }
        else {
            recommendation = 'NOT_RECOMMENDED';
        }
        const analysis = {
            projectId,
            estimatedROI,
            estimatedPaybackPeriod,
            technicalFeasibility,
            operationalFeasibility,
            economicFeasibility,
            overallFeasibility,
            recommendation,
            analysisDate: new Date(),
            isViable: overallFeasibility >= 60,
        };
        logger.log(`Feasibility analysis completed for project ${projectId}: ${recommendation} (${overallFeasibility.toFixed(1)}%)`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to perform feasibility analysis: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Approves a project and moves it from planning to approved status
 */
async function approveProject(projectId, approvedBy, approvalNotes, approvedBudget, transaction) {
    const logger = new common_1.Logger('approveProject');
    try {
        const approval = {
            projectId,
            approvedBy,
            approvalNotes,
            approvedBudget,
            approvalDate: new Date(),
            status: ProjectStatus.APPROVED,
            conditions: [],
        };
        logger.log(`Project ${projectId} approved by ${approvedBy}`);
        return approval;
    }
    catch (error) {
        logger.error(`Failed to approve project: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 2. BUDGET MANAGEMENT AND FORECASTING (5 functions)
// =====================================================================
/**
 * Allocates budget to different categories within a project
 */
async function allocateProjectBudget(projectId, budgetAllocations, transaction) {
    const logger = new common_1.Logger('allocateProjectBudget');
    try {
        const totalAllocated = budgetAllocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
        const allocations = budgetAllocations.map(allocation => ({
            ...allocation,
            projectId,
            spentAmount: allocation.spentAmount || 0,
            committedAmount: allocation.committedAmount || 0,
            remainingAmount: allocation.allocatedAmount - (allocation.spentAmount || 0) - (allocation.committedAmount || 0),
            createdAt: new Date(),
        }));
        logger.log(`Budget allocated for project ${projectId}: ${budgetAllocations.length} categories, total $${totalAllocated}`);
        return {
            projectId,
            allocations,
            totalAllocated,
            allocationDate: new Date(),
        };
    }
    catch (error) {
        logger.error(`Failed to allocate project budget: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Tracks project expenditures and updates budget status
 */
async function trackProjectExpenditure(projectId, category, amount, description, expenseDate, vendorName, transaction) {
    const logger = new common_1.Logger('trackProjectExpenditure');
    try {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Expenditure amount must be greater than zero');
        }
        const expenditure = {
            projectId,
            category,
            amount,
            description,
            expenseDate,
            vendorName,
            recordedDate: new Date(),
            approvalStatus: 'PENDING',
            receiptUrl: null,
        };
        logger.log(`Expenditure tracked for project ${projectId}: $${amount} in category ${category}`);
        return expenditure;
    }
    catch (error) {
        logger.error(`Failed to track project expenditure: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates budget forecast based on current spending trends
 */
async function generateBudgetForecast(projectId, forecastData, transaction) {
    const logger = new common_1.Logger('generateBudgetForecast');
    try {
        if (forecastData.periodEnd <= forecastData.periodStart) {
            throw new common_1.BadRequestException('Forecast period end must be after start');
        }
        const periodDays = Math.ceil((forecastData.periodEnd.getTime() - forecastData.periodStart.getTime()) / (1000 * 60 * 60 * 24));
        const dailyBurnRate = forecastData.projectedSpending / periodDays;
        const forecast = {
            projectId,
            ...forecastData,
            periodDays,
            dailyBurnRate,
            confidenceLevel: forecastData.confidenceLevel || 75,
            generatedAt: new Date(),
            forecastMethod: 'TREND_ANALYSIS',
        };
        logger.log(`Budget forecast generated for project ${projectId}: $${forecastData.projectedSpending} over ${periodDays} days`);
        return forecast;
    }
    catch (error) {
        logger.error(`Failed to generate budget forecast: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Analyzes current budget status and generates comprehensive report
 */
async function analyzeBudgetStatus(projectId, totalBudget, budgetAllocations, transaction) {
    const logger = new common_1.Logger('analyzeBudgetStatus');
    try {
        const totalSpent = budgetAllocations.reduce((sum, alloc) => sum + alloc.spent, 0);
        const totalCommitted = budgetAllocations.reduce((sum, alloc) => sum + alloc.committed, 0);
        const remainingBudget = totalBudget - totalSpent - totalCommitted;
        const utilizationPercentage = ((totalSpent + totalCommitted) / totalBudget) * 100;
        const categoryBreakdown = budgetAllocations.map(alloc => ({
            category: alloc.category,
            allocated: alloc.allocated,
            spent: alloc.spent,
            remaining: alloc.allocated - alloc.spent - alloc.committed,
        }));
        const analysis = {
            totalBudget,
            totalSpent,
            totalCommitted,
            remainingBudget,
            utilizationPercentage,
            categoryBreakdown,
        };
        logger.log(`Budget analysis completed for project ${projectId}: ${utilizationPercentage.toFixed(1)}% utilized`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to analyze budget status: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Manages budget contingency reserves and releases
 */
async function manageContingencyReserve(projectId, reserveAmount, action, reason, requestedBy, transaction) {
    const logger = new common_1.Logger('manageContingencyReserve');
    try {
        if (reserveAmount <= 0 && action !== 'RELEASE') {
            throw new common_1.BadRequestException('Reserve amount must be greater than zero');
        }
        const reserveAction = {
            projectId,
            action,
            amount: reserveAmount,
            reason,
            requestedBy,
            actionDate: new Date(),
            approvalRequired: reserveAmount > 10000,
            status: reserveAmount > 10000 ? 'PENDING_APPROVAL' : 'APPROVED',
        };
        logger.log(`Contingency reserve ${action.toLowerCase()} for project ${projectId}: $${reserveAmount}`);
        return reserveAction;
    }
    catch (error) {
        logger.error(`Failed to manage contingency reserve: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 3. PROJECT MILESTONE TRACKING (5 functions)
// =====================================================================
/**
 * Creates project milestones with dependencies
 */
async function createProjectMilestone(projectId, milestoneData, transaction) {
    const logger = new common_1.Logger('createProjectMilestone');
    try {
        const milestone = {
            projectId,
            ...milestoneData,
            status: MilestoneStatus.PENDING,
            completionPercentage: milestoneData.completionPercentage || 0,
            actualCompletionDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        logger.log(`Milestone created for project ${projectId}: ${milestone.name}`);
        return milestone;
    }
    catch (error) {
        logger.error(`Failed to create project milestone: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Updates milestone progress and completion status
 */
async function updateMilestoneProgress(milestoneId, completionPercentage, statusUpdate, updatedBy, transaction) {
    const logger = new common_1.Logger('updateMilestoneProgress');
    try {
        if (completionPercentage < 0 || completionPercentage > 100) {
            throw new common_1.BadRequestException('Completion percentage must be between 0 and 100');
        }
        let status = MilestoneStatus.IN_PROGRESS;
        if (completionPercentage === 100) {
            status = MilestoneStatus.COMPLETED;
        }
        else if (completionPercentage === 0) {
            status = MilestoneStatus.PENDING;
        }
        const update = {
            milestoneId,
            completionPercentage,
            status,
            statusUpdate,
            updatedBy,
            updatedAt: new Date(),
            actualCompletionDate: completionPercentage === 100 ? new Date() : null,
        };
        logger.log(`Milestone ${milestoneId} updated: ${completionPercentage}% complete`);
        return update;
    }
    catch (error) {
        logger.error(`Failed to update milestone progress: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Validates milestone dependencies and critical path
 */
async function validateMilestoneDependencies(projectId, milestones, transaction) {
    const logger = new common_1.Logger('validateMilestoneDependencies');
    try {
        const validationResults = {
            projectId,
            isValid: true,
            conflicts: [],
            criticalPath: [],
            validatedAt: new Date(),
        };
        // Check for circular dependencies
        const visited = new Set();
        const recursionStack = new Set();
        function hasCycle(milestoneId) {
            visited.add(milestoneId);
            recursionStack.add(milestoneId);
            const milestone = milestones.find(m => m.id === milestoneId);
            if (milestone && milestone.dependencies) {
                for (const depId of milestone.dependencies) {
                    if (!visited.has(depId)) {
                        if (hasCycle(depId))
                            return true;
                    }
                    else if (recursionStack.has(depId)) {
                        return true;
                    }
                }
            }
            recursionStack.delete(milestoneId);
            return false;
        }
        // Validate each milestone
        for (const milestone of milestones) {
            if (hasCycle(milestone.id)) {
                validationResults.isValid = false;
                validationResults.conflicts.push({
                    milestoneId: milestone.id,
                    issue: 'Circular dependency detected',
                });
            }
            // Check if dependencies are completed before this milestone can start
            for (const depId of milestone.dependencies || []) {
                const dependency = milestones.find(m => m.id === depId);
                if (dependency && dependency.targetDate >= milestone.targetDate) {
                    validationResults.isValid = false;
                    validationResults.conflicts.push({
                        milestoneId: milestone.id,
                        issue: `Dependency ${dependency.name} target date is after this milestone`,
                    });
                }
            }
        }
        logger.log(`Milestone dependencies validated for project ${projectId}: ${validationResults.conflicts.length} conflicts found`);
        return validationResults;
    }
    catch (error) {
        logger.error(`Failed to validate milestone dependencies: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates milestone completion report
 */
async function generateMilestoneReport(projectId, milestones, transaction) {
    const logger = new common_1.Logger('generateMilestoneReport');
    try {
        const totalMilestones = milestones.length;
        const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        const delayedMilestones = milestones.filter(m => m.status === MilestoneStatus.DELAYED || (m.targetDate < new Date() && m.status !== MilestoneStatus.COMPLETED)).length;
        const averageCompletion = milestones.reduce((sum, m) => sum + m.completionPercentage, 0) / totalMilestones;
        const report = {
            projectId,
            totalMilestones,
            completedMilestones,
            delayedMilestones,
            inProgressMilestones: milestones.filter(m => m.status === MilestoneStatus.IN_PROGRESS).length,
            pendingMilestones: milestones.filter(m => m.status === MilestoneStatus.PENDING).length,
            averageCompletion,
            completionRate: (completedMilestones / totalMilestones) * 100,
            generatedAt: new Date(),
            upcomingMilestones: milestones
                .filter(m => m.targetDate > new Date() && m.status !== MilestoneStatus.COMPLETED)
                .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
                .slice(0, 5),
        };
        logger.log(`Milestone report generated for project ${projectId}: ${completedMilestones}/${totalMilestones} completed`);
        return report;
    }
    catch (error) {
        logger.error(`Failed to generate milestone report: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Adjusts milestone timelines based on project delays
 */
async function adjustMilestoneTimelines(projectId, milestoneIds, daysToAdjust, reason, adjustedBy, transaction) {
    const logger = new common_1.Logger('adjustMilestoneTimelines');
    try {
        if (milestoneIds.length === 0) {
            throw new common_1.BadRequestException('At least one milestone must be specified');
        }
        const adjustments = milestoneIds.map(milestoneId => ({
            milestoneId,
            daysAdjusted: daysToAdjust,
            reason,
            adjustedBy,
            adjustedAt: new Date(),
        }));
        logger.log(`Timeline adjusted for ${milestoneIds.length} milestones in project ${projectId}: ${daysToAdjust} days`);
        return {
            projectId,
            adjustments,
            totalMilestonesAdjusted: milestoneIds.length,
            daysAdjusted: daysToAdjust,
        };
    }
    catch (error) {
        logger.error(`Failed to adjust milestone timelines: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 4. RESOURCE ALLOCATION (5 functions)
// =====================================================================
/**
 * Allocates resources to a capital project
 */
async function allocateProjectResource(projectId, resourceData, transaction) {
    const logger = new common_1.Logger('allocateProjectResource');
    try {
        if (resourceData.endDate <= resourceData.startDate) {
            throw new common_1.BadRequestException('Resource end date must be after start date');
        }
        const totalCost = resourceData.quantity * resourceData.unitCost;
        const durationDays = Math.ceil((resourceData.endDate.getTime() - resourceData.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const allocation = {
            projectId,
            ...resourceData,
            totalCost,
            durationDays,
            status: 'ALLOCATED',
            utilizationPercentage: 0,
            createdAt: new Date(),
        };
        logger.log(`Resource allocated for project ${projectId}: ${resourceData.resourceName} (${resourceData.resourceType})`);
        return allocation;
    }
    catch (error) {
        logger.error(`Failed to allocate project resource: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Tracks resource utilization and availability
 */
async function trackResourceUtilization(resourceId, projectId, hoursUsed, utilizationDate, transaction) {
    const logger = new common_1.Logger('trackResourceUtilization');
    try {
        if (hoursUsed < 0) {
            throw new common_1.BadRequestException('Hours used cannot be negative');
        }
        const utilization = {
            resourceId,
            projectId,
            hoursUsed,
            utilizationDate,
            recordedAt: new Date(),
        };
        logger.log(`Resource utilization tracked: ${hoursUsed} hours for resource ${resourceId}`);
        return utilization;
    }
    catch (error) {
        logger.error(`Failed to track resource utilization: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates resource utilization analysis
 */
async function analyzeResourceUtilization(projectId, resources, transaction) {
    const logger = new common_1.Logger('analyzeResourceUtilization');
    try {
        const utilizationByType = new Map();
        for (const resource of resources) {
            if (!utilizationByType.has(resource.resourceType)) {
                utilizationByType.set(resource.resourceType, {
                    resourceType: resource.resourceType,
                    totalAllocated: 0,
                    totalCost: 0,
                    utilizationRate: 0,
                    peakUsagePeriod: { start: new Date(), end: new Date() },
                });
            }
            const typeData = utilizationByType.get(resource.resourceType);
            typeData.totalAllocated += resource.totalAllocatedHours;
            typeData.totalCost += resource.totalCost;
        }
        // Calculate utilization rates
        for (const [type, data] of utilizationByType) {
            const totalUsed = resources
                .filter(r => r.resourceType === type)
                .reduce((sum, r) => sum + r.totalUsedHours, 0);
            data.utilizationRate = data.totalAllocated > 0 ? (totalUsed / data.totalAllocated) * 100 : 0;
        }
        const analysis = Array.from(utilizationByType.values());
        logger.log(`Resource utilization analyzed for project ${projectId}: ${analysis.length} resource types`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to analyze resource utilization: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Optimizes resource allocation across multiple projects
 */
async function optimizeResourceAllocation(resources, transaction) {
    const logger = new common_1.Logger('optimizeResourceAllocation');
    try {
        const recommendations = [];
        for (const resource of resources) {
            const totalAllocated = resource.currentAllocations.reduce((sum, alloc) => sum + alloc.allocatedCapacity, 0);
            const utilizationRate = (totalAllocated / resource.availableCapacity) * 100;
            const isOverallocated = totalAllocated > resource.availableCapacity;
            const suggestedActions = [];
            if (isOverallocated) {
                suggestedActions.push('Reduce allocation from low-priority projects');
                suggestedActions.push('Consider hiring additional resources');
                // Identify low-priority allocations
                const lowPriorityAllocations = resource.currentAllocations.filter(alloc => alloc.priority === ProjectPriority.LOW || alloc.priority === ProjectPriority.MEDIUM);
                if (lowPriorityAllocations.length > 0) {
                    suggestedActions.push(`Consider reallocating from ${lowPriorityAllocations.length} lower priority projects`);
                }
            }
            else if (utilizationRate < 70) {
                suggestedActions.push('Resource underutilized - consider additional project assignments');
            }
            recommendations.push({
                resourceId: resource.id,
                resourceName: resource.name,
                isOverallocated,
                utilizationRate,
                suggestedActions,
            });
        }
        const overallocatedCount = recommendations.filter(r => r.isOverallocated).length;
        logger.log(`Resource optimization completed: ${overallocatedCount} overallocated resources identified`);
        return {
            recommendations,
            overallocatedResources: overallocatedCount,
            totalResourcesAnalyzed: resources.length,
            optimizationDate: new Date(),
        };
    }
    catch (error) {
        logger.error(`Failed to optimize resource allocation: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Forecasts future resource needs based on project pipeline
 */
async function forecastResourceNeeds(projectId, upcomingPhases, transaction) {
    const logger = new common_1.Logger('forecastResourceNeeds');
    try {
        const resourceForecast = new Map();
        for (const phase of upcomingPhases) {
            for (const resource of phase.requiredResources) {
                if (!resourceForecast.has(resource.type)) {
                    resourceForecast.set(resource.type, []);
                }
                resourceForecast.get(resource.type).push({
                    date: phase.startDate,
                    quantity: resource.quantity,
                });
            }
        }
        const forecast = Array.from(resourceForecast.entries()).map(([type, demands]) => ({
            resourceType: type,
            peakDemand: Math.max(...demands.map(d => d.quantity)),
            averageDemand: demands.reduce((sum, d) => sum + d.quantity, 0) / demands.length,
            demandPeriods: demands.sort((a, b) => a.date.getTime() - b.date.getTime()),
        }));
        logger.log(`Resource forecast generated for project ${projectId}: ${forecast.length} resource types`);
        return {
            projectId,
            forecast,
            forecastPeriod: {
                start: Math.min(...upcomingPhases.map(p => p.startDate.getTime())),
                end: Math.max(...upcomingPhases.map(p => p.endDate.getTime())),
            },
            generatedAt: new Date(),
        };
    }
    catch (error) {
        logger.error(`Failed to forecast resource needs: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 5. PROJECT COST CONTROL (4 functions)
// =====================================================================
/**
 * Tracks and analyzes cost variance from baseline
 */
async function analyzeCostVariance(projectId, plannedCost, actualCost, earnedValue, transaction) {
    const logger = new common_1.Logger('analyzeCostVariance');
    try {
        if (plannedCost <= 0) {
            throw new common_1.BadRequestException('Planned cost must be greater than zero');
        }
        const costVariance = earnedValue - actualCost;
        const costVariancePercentage = (costVariance / earnedValue) * 100;
        const costPerformanceIndex = earnedValue / actualCost;
        const scheduleVariance = earnedValue - plannedCost;
        const schedulePerformanceIndex = earnedValue / plannedCost;
        let status;
        if (costPerformanceIndex >= 1 && schedulePerformanceIndex >= 1) {
            status = 'ON_TRACK';
        }
        else if (costPerformanceIndex < 0.9 || schedulePerformanceIndex < 0.9) {
            status = 'CRITICAL';
        }
        else {
            status = 'AT_RISK';
        }
        const analysis = {
            projectId,
            plannedCost,
            actualCost,
            earnedValue,
            costVariance,
            costVariancePercentage,
            costPerformanceIndex,
            scheduleVariance,
            schedulePerformanceIndex,
            status,
            isOverBudget: costVariance < 0,
            isBehindSchedule: scheduleVariance < 0,
            analysisDate: new Date(),
        };
        logger.log(`Cost variance analyzed for project ${projectId}: CPI ${costPerformanceIndex.toFixed(2)}, SPI ${schedulePerformanceIndex.toFixed(2)}`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to analyze cost variance: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates estimate at completion (EAC) projection
 */
async function calculateEstimateAtCompletion(projectId, budgetAtCompletion, actualCost, earnedValue, estimateMethod, manualEstimate, transaction) {
    const logger = new common_1.Logger('calculateEstimateAtCompletion');
    try {
        let estimateAtCompletion;
        const costPerformanceIndex = earnedValue / actualCost;
        const schedulePerformanceIndex = earnedValue / budgetAtCompletion;
        switch (estimateMethod) {
            case 'CPI':
                estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
                break;
            case 'SPI_CPI':
                estimateAtCompletion = budgetAtCompletion / (costPerformanceIndex * schedulePerformanceIndex);
                break;
            case 'MANUAL':
                if (!manualEstimate) {
                    throw new common_1.BadRequestException('Manual estimate required for MANUAL method');
                }
                estimateAtCompletion = manualEstimate;
                break;
            default:
                throw new common_1.BadRequestException('Invalid estimate method');
        }
        const estimateToComplete = estimateAtCompletion - actualCost;
        const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
        const toCompletePerformanceIndex = estimateToComplete / (budgetAtCompletion - earnedValue);
        const projection = {
            projectId,
            budgetAtCompletion,
            estimateAtCompletion,
            estimateToComplete,
            varianceAtCompletion,
            toCompletePerformanceIndex,
            estimateMethod,
            isProjectedOverBudget: estimateAtCompletion > budgetAtCompletion,
            projectedOverage: Math.max(0, estimateAtCompletion - budgetAtCompletion),
            calculatedAt: new Date(),
        };
        logger.log(`EAC calculated for project ${projectId}: $${estimateAtCompletion.toFixed(2)} (${estimateMethod})`);
        return projection;
    }
    catch (error) {
        logger.error(`Failed to calculate estimate at completion: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Implements earned value management (EVM) analysis
 */
async function performEarnedValueAnalysis(projectId, plannedValue, earnedValue, actualCost, budgetAtCompletion, transaction) {
    const logger = new common_1.Logger('performEarnedValueAnalysis');
    try {
        const scheduleVariance = earnedValue - plannedValue;
        const costVariance = earnedValue - actualCost;
        const schedulePerformanceIndex = earnedValue / plannedValue;
        const costPerformanceIndex = earnedValue / actualCost;
        const estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
        const estimateToComplete = estimateAtCompletion - actualCost;
        const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
        const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);
        const percentComplete = (earnedValue / budgetAtCompletion) * 100;
        const percentSpent = (actualCost / budgetAtCompletion) * 100;
        const analysis = {
            projectId,
            plannedValue,
            earnedValue,
            actualCost,
            budgetAtCompletion,
            scheduleVariance,
            costVariance,
            schedulePerformanceIndex,
            costPerformanceIndex,
            estimateAtCompletion,
            estimateToComplete,
            varianceAtCompletion,
            toCompletePerformanceIndex,
            percentComplete,
            percentSpent,
            performanceStatus: {
                schedule: schedulePerformanceIndex >= 1 ? 'ON_TRACK' : 'BEHIND',
                cost: costPerformanceIndex >= 1 ? 'UNDER_BUDGET' : 'OVER_BUDGET',
                overall: schedulePerformanceIndex >= 0.95 && costPerformanceIndex >= 0.95 ? 'HEALTHY' : 'AT_RISK',
            },
            analysisDate: new Date(),
        };
        logger.log(`EVM analysis completed for project ${projectId}: ${analysis.performanceStatus.overall}`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to perform earned value analysis: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Tracks and controls project cost baselines
 */
async function manageCostBaseline(projectId, action, baselineCost, reason, approvedBy, transaction) {
    const logger = new common_1.Logger('manageCostBaseline');
    try {
        if (baselineCost <= 0) {
            throw new common_1.BadRequestException('Baseline cost must be greater than zero');
        }
        const baseline = {
            projectId,
            action,
            baselineCost,
            reason,
            approvedBy,
            effectiveDate: new Date(),
            version: action === 'CREATE' ? 1 : undefined,
            requiresApproval: action === 'REBASELINE',
        };
        logger.log(`Cost baseline ${action.toLowerCase()} for project ${projectId}: $${baselineCost}`);
        return baseline;
    }
    catch (error) {
        logger.error(`Failed to manage cost baseline: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 6. CHANGE ORDER MANAGEMENT (4 functions)
// =====================================================================
/**
 * Creates a change order for the project
 */
async function createChangeOrder(projectId, changeOrderData, transaction) {
    const logger = new common_1.Logger('createChangeOrder');
    try {
        const changeOrder = {
            projectId,
            ...changeOrderData,
            status: ChangeOrderStatus.DRAFT,
            changeOrderNumber: `CO-${Date.now()}`,
            submittedDate: new Date(),
            approvedDate: null,
            implementedDate: null,
            createdAt: new Date(),
        };
        logger.log(`Change order created for project ${projectId}: ${changeOrder.title} (${changeOrderData.costImpact >= 0 ? '+' : ''}$${changeOrderData.costImpact})`);
        return changeOrder;
    }
    catch (error) {
        logger.error(`Failed to create change order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Reviews and approves/rejects change orders
 */
async function reviewChangeOrder(changeOrderId, action, reviewedBy, reviewComments, transaction) {
    const logger = new common_1.Logger('reviewChangeOrder');
    try {
        const status = action === 'APPROVE' ? ChangeOrderStatus.APPROVED : ChangeOrderStatus.REJECTED;
        const review = {
            changeOrderId,
            action,
            status,
            reviewedBy,
            reviewComments,
            reviewDate: new Date(),
            approvalLevel: 'MANAGER',
        };
        logger.log(`Change order ${changeOrderId} ${action.toLowerCase()}ed by ${reviewedBy}`);
        return review;
    }
    catch (error) {
        logger.error(`Failed to review change order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Analyzes change order impact on project scope, budget, and timeline
 */
async function analyzeChangeOrderImpact(projectId, changeOrders, currentBudget, currentEndDate, transaction) {
    const logger = new common_1.Logger('analyzeChangeOrderImpact');
    try {
        const approvedChangeOrders = changeOrders.filter(co => co.status === ChangeOrderStatus.APPROVED || co.status === ChangeOrderStatus.IMPLEMENTED);
        const totalCostImpact = approvedChangeOrders.reduce((sum, co) => sum + co.costImpact, 0);
        const totalScheduleImpact = approvedChangeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0);
        const newBudget = currentBudget + totalCostImpact;
        const newEndDate = new Date(currentEndDate.getTime() + totalScheduleImpact * 24 * 60 * 60 * 1000);
        const budgetImpactPercentage = (totalCostImpact / currentBudget) * 100;
        const scheduleImpactPercentage = (totalScheduleImpact / 365) * 100; // Assuming 1 year baseline
        const analysis = {
            projectId,
            totalChangeOrders: changeOrders.length,
            approvedChangeOrders: approvedChangeOrders.length,
            totalCostImpact,
            totalScheduleImpact,
            currentBudget,
            newBudget,
            budgetImpactPercentage,
            currentEndDate,
            newEndDate,
            scheduleImpactPercentage,
            requiresRebaseline: Math.abs(budgetImpactPercentage) > 10 || Math.abs(totalScheduleImpact) > 30,
            analysisDate: new Date(),
        };
        logger.log(`Change order impact analyzed for project ${projectId}: ${approvedChangeOrders.length} approved, $${totalCostImpact} impact`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to analyze change order impact: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Tracks change order implementation and closeout
 */
async function trackChangeOrderImplementation(changeOrderId, implementationStatus, implementationNotes, actualCostImpact, actualScheduleImpact, transaction) {
    const logger = new common_1.Logger('trackChangeOrderImplementation');
    try {
        const implementation = {
            changeOrderId,
            implementationStatus,
            implementationNotes,
            actualCostImpact,
            actualScheduleImpact,
            updatedAt: new Date(),
            completedDate: implementationStatus === 'COMPLETED' ? new Date() : null,
            status: implementationStatus === 'COMPLETED' ? ChangeOrderStatus.IMPLEMENTED : ChangeOrderStatus.APPROVED,
        };
        logger.log(`Change order ${changeOrderId} implementation updated: ${implementationStatus}`);
        return implementation;
    }
    catch (error) {
        logger.error(`Failed to track change order implementation: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 7. PROJECT TIMELINE MANAGEMENT (4 functions)
// =====================================================================
/**
 * Creates and manages project schedules
 */
async function createProjectSchedule(projectId, startDate, endDate, workingDaysPerWeek, holidays, transaction) {
    const logger = new common_1.Logger('createProjectSchedule');
    try {
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        if (workingDaysPerWeek < 1 || workingDaysPerWeek > 7) {
            throw new common_1.BadRequestException('Working days per week must be between 1 and 7');
        }
        const totalCalendarDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.ceil(totalCalendarDays / 7);
        const estimatedWorkingDays = totalWeeks * workingDaysPerWeek - holidays.length;
        const schedule = {
            projectId,
            startDate,
            endDate,
            workingDaysPerWeek,
            holidays,
            totalCalendarDays,
            estimatedWorkingDays,
            createdAt: new Date(),
            version: 1,
        };
        logger.log(`Project schedule created for ${projectId}: ${estimatedWorkingDays} working days`);
        return schedule;
    }
    catch (error) {
        logger.error(`Failed to create project schedule: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Analyzes schedule performance and identifies delays
 */
async function analyzeSchedulePerformance(projectId, plannedStartDate, plannedEndDate, actualStartDate, currentDate, completionPercentage, transaction) {
    const logger = new common_1.Logger('analyzeSchedulePerformance');
    try {
        const plannedDuration = Math.ceil((plannedEndDate.getTime() - plannedStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const elapsedDays = actualStartDate
            ? Math.ceil((currentDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        const expectedCompletion = (elapsedDays / plannedDuration) * 100;
        const scheduleVariance = completionPercentage - expectedCompletion;
        const isOnSchedule = scheduleVariance >= -5; // Within 5% tolerance
        const estimatedDaysRemaining = ((100 - completionPercentage) / completionPercentage) * elapsedDays;
        const projectedEndDate = actualStartDate
            ? new Date(actualStartDate.getTime() + (elapsedDays + estimatedDaysRemaining) * 24 * 60 * 60 * 1000)
            : plannedEndDate;
        const analysis = {
            plannedDuration,
            actualDuration: elapsedDays,
            remainingDuration: estimatedDaysRemaining,
            isOnSchedule,
            delayedMilestones: 0,
            completedMilestones: 0,
            totalMilestones: 0,
        };
        logger.log(`Schedule performance analyzed for project ${projectId}: ${isOnSchedule ? 'On schedule' : 'Delayed'}`);
        return analysis;
    }
    catch (error) {
        logger.error(`Failed to analyze schedule performance: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Calculates critical path for project activities
 */
async function calculateCriticalPath(projectId, activities, transaction) {
    const logger = new common_1.Logger('calculateCriticalPath');
    try {
        // Build activity map
        const activityMap = new Map(activities.map(a => [a.id, { ...a, earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0 }]));
        // Forward pass - calculate early start and early finish
        const visited = new Set();
        function calculateEarlyDates(activityId) {
            if (visited.has(activityId))
                return;
            const activity = activityMap.get(activityId);
            let maxEarlyFinish = 0;
            for (const depId of activity.dependencies) {
                calculateEarlyDates(depId);
                const dep = activityMap.get(depId);
                maxEarlyFinish = Math.max(maxEarlyFinish, dep.earlyFinish);
            }
            activity.earlyStart = maxEarlyFinish;
            activity.earlyFinish = activity.earlyStart + activity.duration;
            visited.add(activityId);
        }
        // Calculate early dates for all activities
        for (const activity of activities) {
            calculateEarlyDates(activity.id);
        }
        // Find project completion time
        const projectDuration = Math.max(...Array.from(activityMap.values()).map(a => a.earlyFinish));
        // Backward pass - calculate late start and late finish
        for (const activity of Array.from(activityMap.values()).reverse()) {
            // Find successors
            const successors = activities.filter(a => a.dependencies.includes(activity.id));
            if (successors.length === 0) {
                activity.lateFinish = projectDuration;
            }
            else {
                activity.lateFinish = Math.min(...successors.map(s => activityMap.get(s.id).lateStart));
            }
            activity.lateStart = activity.lateFinish - activity.duration;
        }
        // Identify critical path (activities with zero float)
        const criticalActivities = Array.from(activityMap.values())
            .filter(a => a.earlyStart === a.lateStart)
            .map(a => ({ id: a.id, name: a.name, duration: a.duration }));
        const result = {
            projectId,
            projectDuration,
            criticalPath: criticalActivities,
            criticalPathLength: criticalActivities.reduce((sum, a) => sum + a.duration, 0),
            totalFloat: Array.from(activityMap.values()).reduce((sum, a) => sum + (a.lateStart - a.earlyStart), 0),
            calculatedAt: new Date(),
        };
        logger.log(`Critical path calculated for project ${projectId}: ${criticalActivities.length} critical activities, ${projectDuration} days duration`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate critical path: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates project timeline reports and visualizations
 */
async function generateTimelineReport(projectId, plannedStartDate, plannedEndDate, actualStartDate, milestones, transaction) {
    const logger = new common_1.Logger('generateTimelineReport');
    try {
        const currentDate = new Date();
        const projectStatus = !actualStartDate
            ? 'NOT_STARTED'
            : currentDate > plannedEndDate
                ? 'OVERDUE'
                : 'IN_PROGRESS';
        const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED);
        const delayedMilestones = milestones.filter(m => m.targetDate < currentDate && m.status !== MilestoneStatus.COMPLETED);
        const upcomingMilestones = milestones
            .filter(m => m.targetDate > currentDate && m.status !== MilestoneStatus.COMPLETED)
            .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
            .slice(0, 5);
        const report = {
            projectId,
            projectStatus,
            plannedStartDate,
            plannedEndDate,
            actualStartDate,
            totalMilestones: milestones.length,
            completedMilestones: completedMilestones.length,
            delayedMilestones: delayedMilestones.length,
            upcomingMilestones,
            milestoneCompletionRate: (completedMilestones.length / milestones.length) * 100,
            averageDelay: delayedMilestones.length > 0
                ? delayedMilestones.reduce((sum, m) => {
                    const delay = Math.ceil((currentDate.getTime() - m.targetDate.getTime()) / (1000 * 60 * 60 * 24));
                    return sum + delay;
                }, 0) / delayedMilestones.length
                : 0,
            generatedAt: new Date(),
        };
        logger.log(`Timeline report generated for project ${projectId}: ${projectStatus}, ${completedMilestones.length}/${milestones.length} milestones completed`);
        return report;
    }
    catch (error) {
        logger.error(`Failed to generate timeline report: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 8. RISK ASSESSMENT AND MITIGATION (5 functions)
// =====================================================================
/**
 * Registers a new risk for the project
 */
async function registerProjectRisk(projectId, riskData, transaction) {
    const logger = new common_1.Logger('registerProjectRisk');
    try {
        // Calculate risk score (probability * impact)
        const riskScore = (riskData.probability / 100) * riskData.costImpact;
        const risk = {
            projectId,
            ...riskData,
            riskScore,
            status: 'ACTIVE',
            identifiedDate: new Date(),
            mitigatedDate: null,
            createdAt: new Date(),
        };
        logger.log(`Risk registered for project ${projectId}: ${risk.title} (${risk.riskLevel}, score: ${riskScore.toFixed(2)})`);
        return risk;
    }
    catch (error) {
        logger.error(`Failed to register project risk: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Performs comprehensive risk assessment
 */
async function performRiskAssessment(projectId, risks, transaction) {
    const logger = new common_1.Logger('performRiskAssessment');
    try {
        const activeRisks = risks.filter(r => r.status === 'ACTIVE');
        const criticalRisks = activeRisks.filter(r => r.riskLevel === RiskLevel.CRITICAL).length;
        const highRisks = activeRisks.filter(r => r.riskLevel === RiskLevel.HIGH).length;
        const expectedCostImpact = activeRisks.reduce((sum, risk) => {
            const expectedValue = (risk.probability / 100) * risk.costImpact;
            return sum + expectedValue;
        }, 0);
        const topRisks = activeRisks
            .map(risk => ({
            title: risk.title,
            riskScore: (risk.probability / 100) * risk.costImpact,
            mitigationStatus: risk.mitigationStrategy ? 'PLANNED' : 'NO_MITIGATION',
        }))
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5);
        const assessment = {
            totalRisks: activeRisks.length,
            criticalRisks,
            highRisks,
            expectedCostImpact,
            topRisks,
        };
        logger.log(`Risk assessment completed for project ${projectId}: ${activeRisks.length} active risks, $${expectedCostImpact.toFixed(2)} expected impact`);
        return assessment;
    }
    catch (error) {
        logger.error(`Failed to perform risk assessment: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Creates and tracks risk mitigation plans
 */
async function createRiskMitigationPlan(riskId, mitigationStrategy, actionItems, estimatedCost, transaction) {
    const logger = new common_1.Logger('createRiskMitigationPlan');
    try {
        if (!actionItems || actionItems.length === 0) {
            throw new common_1.BadRequestException('At least one action item is required for mitigation plan');
        }
        const plan = {
            riskId,
            mitigationStrategy,
            actionItems: actionItems.map((item, index) => ({
                ...item,
                actionNumber: index + 1,
                status: 'PENDING',
                completedDate: null,
            })),
            estimatedCost,
            totalActionItems: actionItems.length,
            completedActionItems: 0,
            planStatus: 'ACTIVE',
            createdAt: new Date(),
        };
        logger.log(`Risk mitigation plan created for risk ${riskId}: ${actionItems.length} action items, $${estimatedCost} estimated cost`);
        return plan;
    }
    catch (error) {
        logger.error(`Failed to create risk mitigation plan: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Monitors and updates risk status
 */
async function updateRiskStatus(riskId, newStatus, statusNotes, actualImpact, transaction) {
    const logger = new common_1.Logger('updateRiskStatus');
    try {
        const update = {
            riskId,
            previousStatus: 'ACTIVE',
            newStatus,
            statusNotes,
            actualImpact,
            updatedAt: new Date(),
            closedDate: newStatus === 'CLOSED' || newStatus === 'MITIGATED' ? new Date() : null,
        };
        logger.log(`Risk ${riskId} status updated to ${newStatus}`);
        return update;
    }
    catch (error) {
        logger.error(`Failed to update risk status: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates risk matrix and heat map
 */
async function generateRiskMatrix(projectId, risks, transaction) {
    const logger = new common_1.Logger('generateRiskMatrix');
    try {
        // Create risk matrix (5x5 grid)
        const matrix = Array(5)
            .fill(null)
            .map(() => Array(5).fill(null).map(() => []));
        for (const risk of risks) {
            // Map probability and impact to matrix coordinates (0-4)
            const probIndex = Math.min(Math.floor(risk.probability / 20), 4);
            const impactIndex = Math.min(Math.floor(risk.impact / 20000), 4); // Assuming max impact of 100k
            matrix[probIndex][impactIndex].push({
                id: risk.id,
                title: risk.title,
            });
        }
        // Calculate risk distribution
        const distribution = {
            critical: risks.filter(r => r.riskLevel === RiskLevel.CRITICAL).length,
            high: risks.filter(r => r.riskLevel === RiskLevel.HIGH).length,
            medium: risks.filter(r => r.riskLevel === RiskLevel.MEDIUM).length,
            low: risks.filter(r => r.riskLevel === RiskLevel.LOW).length,
        };
        const result = {
            projectId,
            matrix,
            distribution,
            totalRisks: risks.length,
            generatedAt: new Date(),
            riskConcentration: {
                highProbabilityHighImpact: matrix[3][3].length + matrix[3][4].length + matrix[4][3].length + matrix[4][4].length,
                lowProbabilityHighImpact: matrix[0][3].length + matrix[0][4].length + matrix[1][3].length + matrix[1][4].length,
            },
        };
        logger.log(`Risk matrix generated for project ${projectId}: ${risks.length} risks plotted`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to generate risk matrix: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 9. STAKEHOLDER COMMUNICATION (4 functions)
// =====================================================================
/**
 * Creates stakeholder communication records
 */
async function createStakeholderCommunication(projectId, communicationData, transaction) {
    const logger = new common_1.Logger('createStakeholderCommunication');
    try {
        const communication = {
            projectId,
            ...communicationData,
            status: 'DRAFT',
            sentDate: null,
            deliveryStatus: {},
            createdAt: new Date(),
        };
        logger.log(`Stakeholder communication created for project ${projectId}: ${communication.subject} (${communicationData.recipients.length} recipients)`);
        return communication;
    }
    catch (error) {
        logger.error(`Failed to create stakeholder communication: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generates project status reports for stakeholders
 */
async function generateStakeholderStatusReport(projectId, reportingPeriod, metrics, highlights, concerns, nextSteps, transaction) {
    const logger = new common_1.Logger('generateStakeholderStatusReport');
    try {
        let overallStatus;
        if (metrics.scheduleVariance < -10 || metrics.costVariance < -10 || metrics.activeRisks > 5) {
            overallStatus = 'RED';
        }
        else if (metrics.scheduleVariance < -5 || metrics.costVariance < -5 || metrics.activeRisks > 2) {
            overallStatus = 'YELLOW';
        }
        else {
            overallStatus = 'GREEN';
        }
        const report = {
            projectId,
            reportingPeriod,
            generatedDate: new Date(),
            overallStatus,
            metrics,
            highlights: highlights || [],
            concerns: concerns || [],
            nextSteps: nextSteps || [],
            summary: `Project is ${metrics.completionPercentage}% complete with ${overallStatus} status`,
        };
        logger.log(`Stakeholder status report generated for project ${projectId}: ${overallStatus} status`);
        return report;
    }
    catch (error) {
        logger.error(`Failed to generate stakeholder status report: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Manages stakeholder engagement and feedback
 */
async function trackStakeholderEngagement(projectId, stakeholderId, engagementType, engagementDate, topics, feedback, actionItems, transaction) {
    const logger = new common_1.Logger('trackStakeholderEngagement');
    try {
        const engagement = {
            projectId,
            stakeholderId,
            engagementType,
            engagementDate,
            topics,
            feedback,
            actionItems: actionItems || [],
            recordedAt: new Date(),
        };
        logger.log(`Stakeholder engagement tracked for project ${projectId}: ${engagementType} with ${topics.length} topics`);
        return engagement;
    }
    catch (error) {
        logger.error(`Failed to track stakeholder engagement: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Distributes project communications to stakeholders
 */
async function distributeProjectCommunication(communicationId, distributionMethod, scheduledDate, transaction) {
    const logger = new common_1.Logger('distributeProjectCommunication');
    try {
        const distribution = {
            communicationId,
            distributionMethod,
            scheduledDate: scheduledDate || new Date(),
            status: scheduledDate && scheduledDate > new Date() ? 'SCHEDULED' : 'SENT',
            sentDate: scheduledDate && scheduledDate > new Date() ? null : new Date(),
            deliveryMetrics: {
                sent: 0,
                delivered: 0,
                failed: 0,
                opened: 0,
            },
        };
        logger.log(`Communication ${communicationId} ${distribution.status.toLowerCase()} via ${distributionMethod}`);
        return distribution;
    }
    catch (error) {
        logger.error(`Failed to distribute project communication: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// 10. PROJECT CLOSEOUT PROCEDURES (4 functions)
// =====================================================================
/**
 * Initiates project closeout process
 */
async function initiateProjectCloseout(projectId, closeoutData, transaction) {
    const logger = new common_1.Logger('initiateProjectCloseout');
    try {
        const closeout = {
            projectId,
            ...closeoutData,
            closeoutStatus: 'INITIATED',
            closeoutInitiatedDate: new Date(),
            closeoutCompletedDate: null,
            outstandingItems: [],
            approvals: [],
        };
        logger.log(`Project closeout initiated for ${projectId}: final cost $${closeoutData.finalCost}`);
        return closeout;
    }
    catch (error) {
        logger.error(`Failed to initiate project closeout: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Conducts final project audit and variance analysis
 */
async function conductFinalProjectAudit(projectId, plannedBudget, actualCost, plannedEndDate, actualEndDate, plannedScope, deliveredScope, transaction) {
    const logger = new common_1.Logger('conductFinalProjectAudit');
    try {
        const budgetVariance = actualCost - plannedBudget;
        const budgetVariancePercentage = (budgetVariance / plannedBudget) * 100;
        const scheduleVarianceDays = Math.ceil((actualEndDate.getTime() - plannedEndDate.getTime()) / (1000 * 60 * 60 * 24));
        const performanceRating = calculatePerformanceRating(budgetVariancePercentage, scheduleVarianceDays);
        const audit = {
            projectId,
            plannedBudget,
            actualCost,
            budgetVariance,
            budgetVariancePercentage,
            plannedEndDate,
            actualEndDate,
            scheduleVarianceDays,
            plannedScope,
            deliveredScope,
            scopeMetPercentage: 100, // Could be calculated based on detailed scope comparison
            performanceRating,
            auditDate: new Date(),
            recommendations: generateAuditRecommendations(budgetVariancePercentage, scheduleVarianceDays),
        };
        logger.log(`Final project audit completed for ${projectId}: ${performanceRating} performance`);
        return audit;
    }
    catch (error) {
        logger.error(`Failed to conduct final project audit: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Archives project documentation and records
 */
async function archiveProjectDocumentation(projectId, documentCategories, archiveLocation, retentionPeriodYears, transaction) {
    const logger = new common_1.Logger('archiveProjectDocumentation');
    try {
        const totalDocuments = documentCategories.reduce((sum, cat) => sum + cat.documents.length, 0);
        const archiveRecord = {
            projectId,
            documentCategories,
            archiveLocation,
            retentionPeriodYears,
            archiveDate: new Date(),
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + retentionPeriodYears)),
            totalDocuments,
            totalCategories: documentCategories.length,
            archiveStatus: 'COMPLETED',
        };
        logger.log(`Project documentation archived for ${projectId}: ${totalDocuments} documents in ${archiveLocation}`);
        return archiveRecord;
    }
    catch (error) {
        logger.error(`Failed to archive project documentation: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Captures lessons learned and best practices
 */
async function captureLessonsLearned(projectId, successFactors, challenges, improvements, bestPractices, teamFeedback, transaction) {
    const logger = new common_1.Logger('captureLessonsLearned');
    try {
        const lessonsLearned = {
            projectId,
            successFactors: successFactors || [],
            challenges: challenges || [],
            improvements: improvements || [],
            bestPractices: bestPractices || [],
            teamFeedback: teamFeedback || [],
            capturedDate: new Date(),
            status: 'DRAFT',
            reviewedBy: null,
            publishedDate: null,
        };
        const totalInsights = successFactors.length +
            challenges.length +
            improvements.length +
            bestPractices.length;
        logger.log(`Lessons learned captured for project ${projectId}: ${totalInsights} insights from ${teamFeedback.length} contributors`);
        return lessonsLearned;
    }
    catch (error) {
        logger.error(`Failed to capture lessons learned: ${error.message}`, error.stack);
        throw error;
    }
}
// =====================================================================
// HELPER FUNCTIONS
// =====================================================================
/**
 * Calculates performance rating based on variance metrics
 */
function calculatePerformanceRating(budgetVariancePercentage, scheduleVarianceDays) {
    if (Math.abs(budgetVariancePercentage) <= 5 && Math.abs(scheduleVarianceDays) <= 7) {
        return 'EXCELLENT';
    }
    else if (Math.abs(budgetVariancePercentage) <= 10 && Math.abs(scheduleVarianceDays) <= 14) {
        return 'GOOD';
    }
    else if (Math.abs(budgetVariancePercentage) <= 15 && Math.abs(scheduleVarianceDays) <= 30) {
        return 'SATISFACTORY';
    }
    else {
        return 'NEEDS_IMPROVEMENT';
    }
}
/**
 * Generates audit recommendations based on variance analysis
 */
function generateAuditRecommendations(budgetVariancePercentage, scheduleVarianceDays) {
    const recommendations = [];
    if (budgetVariancePercentage > 10) {
        recommendations.push('Implement more rigorous cost control measures');
        recommendations.push('Review and improve budget estimation processes');
        recommendations.push('Enhance change order management procedures');
    }
    else if (budgetVariancePercentage < -10) {
        recommendations.push('Review if scope was fully delivered despite under-budget performance');
        recommendations.push('Consider if cost savings can be applied to future projects');
    }
    if (scheduleVarianceDays > 14) {
        recommendations.push('Improve project timeline estimation methodology');
        recommendations.push('Implement better milestone tracking and early warning systems');
        recommendations.push('Review resource allocation efficiency');
    }
    if (recommendations.length === 0) {
        recommendations.push('Continue applying current project management practices');
        recommendations.push('Document successful strategies for future reference');
    }
    return recommendations;
}
/**
 * Service class for dependency injection
 */
let CapitalProjectsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CapitalProjectsService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(CapitalProjectsService.name);
        }
        // Project Initiation and Planning
        async createCapitalProject(data, transaction) {
            return createCapitalProject(data, transaction);
        }
        async generateProjectCharter(projectId, scope, objectives, constraints, assumptions, transaction) {
            return generateProjectCharter(projectId, scope, objectives, constraints, assumptions, transaction);
        }
        async createWorkBreakdownStructure(projectId, phases, transaction) {
            return createWorkBreakdownStructure(projectId, phases, transaction);
        }
        async performFeasibilityAnalysis(projectId, estimatedROI, estimatedPaybackPeriod, technicalFeasibility, operationalFeasibility, economicFeasibility, transaction) {
            return performFeasibilityAnalysis(projectId, estimatedROI, estimatedPaybackPeriod, technicalFeasibility, operationalFeasibility, economicFeasibility, transaction);
        }
        async approveProject(projectId, approvedBy, approvalNotes, approvedBudget, transaction) {
            return approveProject(projectId, approvedBy, approvalNotes, approvedBudget, transaction);
        }
        // Budget Management
        async allocateProjectBudget(projectId, budgetAllocations, transaction) {
            return allocateProjectBudget(projectId, budgetAllocations, transaction);
        }
        async trackProjectExpenditure(projectId, category, amount, description, expenseDate, vendorName, transaction) {
            return trackProjectExpenditure(projectId, category, amount, description, expenseDate, vendorName, transaction);
        }
        async generateBudgetForecast(projectId, forecastData, transaction) {
            return generateBudgetForecast(projectId, forecastData, transaction);
        }
        async analyzeBudgetStatus(projectId, totalBudget, budgetAllocations, transaction) {
            return analyzeBudgetStatus(projectId, totalBudget, budgetAllocations, transaction);
        }
        async manageContingencyReserve(projectId, reserveAmount, action, reason, requestedBy, transaction) {
            return manageContingencyReserve(projectId, reserveAmount, action, reason, requestedBy, transaction);
        }
        // Milestone Tracking
        async createProjectMilestone(projectId, milestoneData, transaction) {
            return createProjectMilestone(projectId, milestoneData, transaction);
        }
        async updateMilestoneProgress(milestoneId, completionPercentage, statusUpdate, updatedBy, transaction) {
            return updateMilestoneProgress(milestoneId, completionPercentage, statusUpdate, updatedBy, transaction);
        }
        // Resource Allocation
        async allocateProjectResource(projectId, resourceData, transaction) {
            return allocateProjectResource(projectId, resourceData, transaction);
        }
        // Cost Control
        async analyzeCostVariance(projectId, plannedCost, actualCost, earnedValue, transaction) {
            return analyzeCostVariance(projectId, plannedCost, actualCost, earnedValue, transaction);
        }
        // Change Orders
        async createChangeOrder(projectId, changeOrderData, transaction) {
            return createChangeOrder(projectId, changeOrderData, transaction);
        }
        // Risk Management
        async registerProjectRisk(projectId, riskData, transaction) {
            return registerProjectRisk(projectId, riskData, transaction);
        }
        // Stakeholder Communication
        async createStakeholderCommunication(projectId, communicationData, transaction) {
            return createStakeholderCommunication(projectId, communicationData, transaction);
        }
        // Project Closeout
        async initiateProjectCloseout(projectId, closeoutData, transaction) {
            return initiateProjectCloseout(projectId, closeoutData, transaction);
        }
        async captureLessonsLearned(projectId, successFactors, challenges, improvements, bestPractices, teamFeedback, transaction) {
            return captureLessonsLearned(projectId, successFactors, challenges, improvements, bestPractices, teamFeedback, transaction);
        }
    };
    __setFunctionName(_classThis, "CapitalProjectsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CapitalProjectsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CapitalProjectsService = _classThis;
})();
exports.CapitalProjectsService = CapitalProjectsService;
//# sourceMappingURL=property-capital-projects-kit.js.map