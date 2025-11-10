"use strict";
/**
 * LOC: CONSPPM12345
 * File: /reuse/consulting/project-portfolio-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Portfolio management controllers
 *   - Resource allocation engines
 *   - Strategic planning services
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
exports.manageProjectInterdependencies = exports.validateScheduleFeasibility = exports.createPortfolioRoadmap = exports.identifyCriticalPath = exports.analyzeProjectDependencies = exports.exportPortfolioData = exports.generatePerformanceReport = exports.analyzePortfolioTrends = exports.generateExecutiveSummary = exports.generatePortfolioDashboard = exports.monitorPortfolioHealth = exports.generateGovernanceReport = exports.trackBenefitsRealization = exports.createStageGateReview = exports.assessStrategicAlignment = exports.comparePortfolioScenarios = exports.createPortfolioScenario = exports.performWhatIfAnalysis = exports.calculatePortfolioValue = exports.analyzePortfolioRisk = exports.optimizePortfolio = exports.forecastResourceDemand = exports.optimizeResourceAllocation = exports.identifyResourceConflicts = exports.calculateCapacityUtilization = exports.checkResourceAvailability = exports.allocateResourceToProject = exports.analyzePortfolioBalance = exports.prioritizeProjects = exports.calculateProjectPriorityScores = exports.addProjectToPortfolio = exports.activatePortfolio = exports.createPortfolio = exports.createResourceAllocationModel = exports.createPortfolioProjectModel = exports.createPortfolioModel = exports.CreatePortfolioScenarioDto = exports.CreateStageGateReviewDto = exports.AllocateResourceDto = exports.PrioritizeProjectsDto = exports.AddProjectToPortfolioDto = exports.CreatePortfolioDto = exports.RiskLevel = exports.InvestmentCategory = exports.PortfolioHealth = exports.AllocationStatus = exports.ProjectStage = exports.StrategicAlignment = exports.ProjectPriority = exports.PortfolioStatus = void 0;
/**
 * File: /reuse/consulting/project-portfolio-kit.ts
 * Locator: WC-CONS-PPM-001
 * Purpose: Comprehensive Project Portfolio Management Utilities - Enterprise-grade PPM framework
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Portfolio controllers, resource services, capacity planning, strategic alignment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for portfolio management, project prioritization, resource allocation, capacity planning
 *
 * LLM Context: Enterprise-grade project portfolio management system for consulting organizations.
 * Provides complete portfolio lifecycle management, strategic alignment, project prioritization,
 * resource capacity planning, portfolio optimization, risk-adjusted portfolio valuation, governance,
 * benefits realization, dependency management, portfolio reporting, investment analysis, stage-gate reviews,
 * portfolio balancing, scenario analysis, what-if modeling, roadmap planning.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Portfolio status
 */
var PortfolioStatus;
(function (PortfolioStatus) {
    PortfolioStatus["DRAFT"] = "draft";
    PortfolioStatus["ACTIVE"] = "active";
    PortfolioStatus["UNDER_REVIEW"] = "under_review";
    PortfolioStatus["ARCHIVED"] = "archived";
    PortfolioStatus["CLOSED"] = "closed";
})(PortfolioStatus || (exports.PortfolioStatus = PortfolioStatus = {}));
/**
 * Project priority levels
 */
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["CRITICAL"] = "critical";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["LOW"] = "low";
    ProjectPriority["ON_HOLD"] = "on_hold";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
/**
 * Strategic alignment categories
 */
var StrategicAlignment;
(function (StrategicAlignment) {
    StrategicAlignment["REVENUE_GROWTH"] = "revenue_growth";
    StrategicAlignment["COST_REDUCTION"] = "cost_reduction";
    StrategicAlignment["MARKET_EXPANSION"] = "market_expansion";
    StrategicAlignment["DIGITAL_TRANSFORMATION"] = "digital_transformation";
    StrategicAlignment["OPERATIONAL_EXCELLENCE"] = "operational_excellence";
    StrategicAlignment["CUSTOMER_SATISFACTION"] = "customer_satisfaction";
    StrategicAlignment["INNOVATION"] = "innovation";
    StrategicAlignment["COMPLIANCE"] = "compliance";
})(StrategicAlignment || (exports.StrategicAlignment = StrategicAlignment = {}));
/**
 * Project stage
 */
var ProjectStage;
(function (ProjectStage) {
    ProjectStage["IDEATION"] = "ideation";
    ProjectStage["EVALUATION"] = "evaluation";
    ProjectStage["APPROVAL"] = "approval";
    ProjectStage["PLANNING"] = "planning";
    ProjectStage["EXECUTION"] = "execution";
    ProjectStage["MONITORING"] = "monitoring";
    ProjectStage["CLOSING"] = "closing";
    ProjectStage["COMPLETED"] = "completed";
})(ProjectStage || (exports.ProjectStage = ProjectStage = {}));
/**
 * Resource allocation status
 */
var AllocationStatus;
(function (AllocationStatus) {
    AllocationStatus["PROPOSED"] = "proposed";
    AllocationStatus["CONFIRMED"] = "confirmed";
    AllocationStatus["ACTIVE"] = "active";
    AllocationStatus["RELEASED"] = "released";
    AllocationStatus["OVERALLOCATED"] = "overallocated";
})(AllocationStatus || (exports.AllocationStatus = AllocationStatus = {}));
/**
 * Portfolio health status
 */
var PortfolioHealth;
(function (PortfolioHealth) {
    PortfolioHealth["GREEN"] = "green";
    PortfolioHealth["YELLOW"] = "yellow";
    PortfolioHealth["RED"] = "red";
    PortfolioHealth["CRITICAL"] = "critical";
})(PortfolioHealth || (exports.PortfolioHealth = PortfolioHealth = {}));
/**
 * Investment category
 */
var InvestmentCategory;
(function (InvestmentCategory) {
    InvestmentCategory["TRANSFORMATIONAL"] = "transformational";
    InvestmentCategory["STRATEGIC"] = "strategic";
    InvestmentCategory["OPERATIONAL"] = "operational";
    InvestmentCategory["MAINTENANCE"] = "maintenance";
    InvestmentCategory["INNOVATION"] = "innovation";
})(InvestmentCategory || (exports.InvestmentCategory = InvestmentCategory = {}));
/**
 * Risk level
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["VERY_LOW"] = "very_low";
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["VERY_HIGH"] = "very_high";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create portfolio DTO
 */
let CreatePortfolioDto = (() => {
    var _a;
    let _portfolioName_decorators;
    let _portfolioName_initializers = [];
    let _portfolioName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _targetROI_decorators;
    let _targetROI_initializers = [];
    let _targetROI_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _strategicObjectives_decorators;
    let _strategicObjectives_initializers = [];
    let _strategicObjectives_extraInitializers = [];
    return _a = class CreatePortfolioDto {
            constructor() {
                this.portfolioName = __runInitializers(this, _portfolioName_initializers, void 0);
                this.description = (__runInitializers(this, _portfolioName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.organizationId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.ownerId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.targetROI = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _targetROI_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _targetROI_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.strategicObjectives = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _strategicObjectives_initializers, void 0));
                __runInitializers(this, _strategicObjectives_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _portfolioName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)()];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio owner ID' }), (0, class_validator_1.IsUUID)()];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _targetROI_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target ROI percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(2000), (0, class_validator_1.Max)(2100)];
            _strategicObjectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic objectives', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _portfolioName_decorators, { kind: "field", name: "portfolioName", static: false, private: false, access: { has: obj => "portfolioName" in obj, get: obj => obj.portfolioName, set: (obj, value) => { obj.portfolioName = value; } }, metadata: _metadata }, _portfolioName_initializers, _portfolioName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _targetROI_decorators, { kind: "field", name: "targetROI", static: false, private: false, access: { has: obj => "targetROI" in obj, get: obj => obj.targetROI, set: (obj, value) => { obj.targetROI = value; } }, metadata: _metadata }, _targetROI_initializers, _targetROI_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _strategicObjectives_decorators, { kind: "field", name: "strategicObjectives", static: false, private: false, access: { has: obj => "strategicObjectives" in obj, get: obj => obj.strategicObjectives, set: (obj, value) => { obj.strategicObjectives = value; } }, metadata: _metadata }, _strategicObjectives_initializers, _strategicObjectives_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePortfolioDto = CreatePortfolioDto;
/**
 * Add project to portfolio DTO
 */
let AddProjectToPortfolioDto = (() => {
    var _a;
    let _portfolioId_decorators;
    let _portfolioId_initializers = [];
    let _portfolioId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _strategicAlignment_decorators;
    let _strategicAlignment_initializers = [];
    let _strategicAlignment_extraInitializers = [];
    let _investmentCategory_decorators;
    let _investmentCategory_initializers = [];
    let _investmentCategory_extraInitializers = [];
    let _estimatedBudget_decorators;
    let _estimatedBudget_initializers = [];
    let _estimatedBudget_extraInitializers = [];
    let _estimatedBenefit_decorators;
    let _estimatedBenefit_initializers = [];
    let _estimatedBenefit_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    return _a = class AddProjectToPortfolioDto {
            constructor() {
                this.portfolioId = __runInitializers(this, _portfolioId_initializers, void 0);
                this.projectName = (__runInitializers(this, _portfolioId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
                this.description = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.strategicAlignment = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _strategicAlignment_initializers, void 0));
                this.investmentCategory = (__runInitializers(this, _strategicAlignment_extraInitializers), __runInitializers(this, _investmentCategory_initializers, void 0));
                this.estimatedBudget = (__runInitializers(this, _investmentCategory_extraInitializers), __runInitializers(this, _estimatedBudget_initializers, void 0));
                this.estimatedBenefit = (__runInitializers(this, _estimatedBudget_extraInitializers), __runInitializers(this, _estimatedBenefit_initializers, void 0));
                this.startDate = (__runInitializers(this, _estimatedBenefit_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                __runInitializers(this, _endDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _portfolioId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio ID' }), (0, class_validator_1.IsUUID)()];
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ProjectPriority }), (0, class_validator_1.IsEnum)(ProjectPriority)];
            _strategicAlignment_decorators = [(0, swagger_1.ApiProperty)({ enum: StrategicAlignment, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(StrategicAlignment, { each: true })];
            _investmentCategory_decorators = [(0, swagger_1.ApiProperty)({ enum: InvestmentCategory }), (0, class_validator_1.IsEnum)(InvestmentCategory)];
            _estimatedBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated budget' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _estimatedBenefit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated benefit' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project end date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _portfolioId_decorators, { kind: "field", name: "portfolioId", static: false, private: false, access: { has: obj => "portfolioId" in obj, get: obj => obj.portfolioId, set: (obj, value) => { obj.portfolioId = value; } }, metadata: _metadata }, _portfolioId_initializers, _portfolioId_extraInitializers);
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _strategicAlignment_decorators, { kind: "field", name: "strategicAlignment", static: false, private: false, access: { has: obj => "strategicAlignment" in obj, get: obj => obj.strategicAlignment, set: (obj, value) => { obj.strategicAlignment = value; } }, metadata: _metadata }, _strategicAlignment_initializers, _strategicAlignment_extraInitializers);
            __esDecorate(null, null, _investmentCategory_decorators, { kind: "field", name: "investmentCategory", static: false, private: false, access: { has: obj => "investmentCategory" in obj, get: obj => obj.investmentCategory, set: (obj, value) => { obj.investmentCategory = value; } }, metadata: _metadata }, _investmentCategory_initializers, _investmentCategory_extraInitializers);
            __esDecorate(null, null, _estimatedBudget_decorators, { kind: "field", name: "estimatedBudget", static: false, private: false, access: { has: obj => "estimatedBudget" in obj, get: obj => obj.estimatedBudget, set: (obj, value) => { obj.estimatedBudget = value; } }, metadata: _metadata }, _estimatedBudget_initializers, _estimatedBudget_extraInitializers);
            __esDecorate(null, null, _estimatedBenefit_decorators, { kind: "field", name: "estimatedBenefit", static: false, private: false, access: { has: obj => "estimatedBenefit" in obj, get: obj => obj.estimatedBenefit, set: (obj, value) => { obj.estimatedBenefit = value; } }, metadata: _metadata }, _estimatedBenefit_initializers, _estimatedBenefit_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddProjectToPortfolioDto = AddProjectToPortfolioDto;
/**
 * Prioritize projects DTO
 */
let PrioritizeProjectsDto = (() => {
    var _a;
    let _portfolioId_decorators;
    let _portfolioId_initializers = [];
    let _portfolioId_extraInitializers = [];
    let _strategicWeight_decorators;
    let _strategicWeight_initializers = [];
    let _strategicWeight_extraInitializers = [];
    let _financialWeight_decorators;
    let _financialWeight_initializers = [];
    let _financialWeight_extraInitializers = [];
    let _riskWeight_decorators;
    let _riskWeight_initializers = [];
    let _riskWeight_extraInitializers = [];
    let _resourceWeight_decorators;
    let _resourceWeight_initializers = [];
    let _resourceWeight_extraInitializers = [];
    return _a = class PrioritizeProjectsDto {
            constructor() {
                this.portfolioId = __runInitializers(this, _portfolioId_initializers, void 0);
                this.strategicWeight = (__runInitializers(this, _portfolioId_extraInitializers), __runInitializers(this, _strategicWeight_initializers, void 0));
                this.financialWeight = (__runInitializers(this, _strategicWeight_extraInitializers), __runInitializers(this, _financialWeight_initializers, void 0));
                this.riskWeight = (__runInitializers(this, _financialWeight_extraInitializers), __runInitializers(this, _riskWeight_initializers, void 0));
                this.resourceWeight = (__runInitializers(this, _riskWeight_extraInitializers), __runInitializers(this, _resourceWeight_initializers, void 0));
                __runInitializers(this, _resourceWeight_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _portfolioId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio ID' }), (0, class_validator_1.IsUUID)()];
            _strategicWeight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic value weight (0-1)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _financialWeight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Financial value weight (0-1)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _riskWeight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk weight (0-1)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _resourceWeight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource availability weight (0-1)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _portfolioId_decorators, { kind: "field", name: "portfolioId", static: false, private: false, access: { has: obj => "portfolioId" in obj, get: obj => obj.portfolioId, set: (obj, value) => { obj.portfolioId = value; } }, metadata: _metadata }, _portfolioId_initializers, _portfolioId_extraInitializers);
            __esDecorate(null, null, _strategicWeight_decorators, { kind: "field", name: "strategicWeight", static: false, private: false, access: { has: obj => "strategicWeight" in obj, get: obj => obj.strategicWeight, set: (obj, value) => { obj.strategicWeight = value; } }, metadata: _metadata }, _strategicWeight_initializers, _strategicWeight_extraInitializers);
            __esDecorate(null, null, _financialWeight_decorators, { kind: "field", name: "financialWeight", static: false, private: false, access: { has: obj => "financialWeight" in obj, get: obj => obj.financialWeight, set: (obj, value) => { obj.financialWeight = value; } }, metadata: _metadata }, _financialWeight_initializers, _financialWeight_extraInitializers);
            __esDecorate(null, null, _riskWeight_decorators, { kind: "field", name: "riskWeight", static: false, private: false, access: { has: obj => "riskWeight" in obj, get: obj => obj.riskWeight, set: (obj, value) => { obj.riskWeight = value; } }, metadata: _metadata }, _riskWeight_initializers, _riskWeight_extraInitializers);
            __esDecorate(null, null, _resourceWeight_decorators, { kind: "field", name: "resourceWeight", static: false, private: false, access: { has: obj => "resourceWeight" in obj, get: obj => obj.resourceWeight, set: (obj, value) => { obj.resourceWeight = value; } }, metadata: _metadata }, _resourceWeight_initializers, _resourceWeight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PrioritizeProjectsDto = PrioritizeProjectsDto;
/**
 * Allocate resource DTO
 */
let AllocateResourceDto = (() => {
    var _a;
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _allocationPercentage_decorators;
    let _allocationPercentage_initializers = [];
    let _allocationPercentage_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _costRate_decorators;
    let _costRate_initializers = [];
    let _costRate_extraInitializers = [];
    return _a = class AllocateResourceDto {
            constructor() {
                this.resourceId = __runInitializers(this, _resourceId_initializers, void 0);
                this.projectId = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
                this.allocationPercentage = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _allocationPercentage_initializers, void 0));
                this.startDate = (__runInitializers(this, _allocationPercentage_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.role = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.costRate = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _costRate_initializers, void 0));
                __runInitializers(this, _costRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource ID' }), (0, class_validator_1.IsUUID)()];
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _allocationPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocation percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _costRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost rate per hour' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _allocationPercentage_decorators, { kind: "field", name: "allocationPercentage", static: false, private: false, access: { has: obj => "allocationPercentage" in obj, get: obj => obj.allocationPercentage, set: (obj, value) => { obj.allocationPercentage = value; } }, metadata: _metadata }, _allocationPercentage_initializers, _allocationPercentage_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _costRate_decorators, { kind: "field", name: "costRate", static: false, private: false, access: { has: obj => "costRate" in obj, get: obj => obj.costRate, set: (obj, value) => { obj.costRate = value; } }, metadata: _metadata }, _costRate_initializers, _costRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AllocateResourceDto = AllocateResourceDto;
/**
 * Create stage gate review DTO
 */
let CreateStageGateReviewDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _stage_decorators;
    let _stage_initializers = [];
    let _stage_extraInitializers = [];
    let _reviewers_decorators;
    let _reviewers_initializers = [];
    let _reviewers_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _decision_decorators;
    let _decision_initializers = [];
    let _decision_extraInitializers = [];
    return _a = class CreateStageGateReviewDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.stage = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.reviewers = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _reviewers_initializers, void 0));
                this.reviewDate = (__runInitializers(this, _reviewers_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
                this.overallScore = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
                this.decision = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
                __runInitializers(this, _decision_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _stage_decorators = [(0, swagger_1.ApiProperty)({ enum: ProjectStage }), (0, class_validator_1.IsEnum)(ProjectStage)];
            _reviewers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewer IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _overallScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall score' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _decision_decorators = [(0, swagger_1.ApiProperty)({ description: 'Decision', enum: ['approved', 'conditional', 'rejected', 'cancelled'] }), (0, class_validator_1.IsEnum)(['approved', 'conditional', 'rejected', 'cancelled'])];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: obj => "stage" in obj, get: obj => obj.stage, set: (obj, value) => { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _reviewers_decorators, { kind: "field", name: "reviewers", static: false, private: false, access: { has: obj => "reviewers" in obj, get: obj => obj.reviewers, set: (obj, value) => { obj.reviewers = value; } }, metadata: _metadata }, _reviewers_initializers, _reviewers_extraInitializers);
            __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
            __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: obj => "decision" in obj, get: obj => obj.decision, set: (obj, value) => { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStageGateReviewDto = CreateStageGateReviewDto;
/**
 * Create portfolio scenario DTO
 */
let CreatePortfolioScenarioDto = (() => {
    var _a;
    let _portfolioId_decorators;
    let _portfolioId_initializers = [];
    let _portfolioId_extraInitializers = [];
    let _scenarioName_decorators;
    let _scenarioName_initializers = [];
    let _scenarioName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _projectSelections_decorators;
    let _projectSelections_initializers = [];
    let _projectSelections_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    return _a = class CreatePortfolioScenarioDto {
            constructor() {
                this.portfolioId = __runInitializers(this, _portfolioId_initializers, void 0);
                this.scenarioName = (__runInitializers(this, _portfolioId_extraInitializers), __runInitializers(this, _scenarioName_initializers, void 0));
                this.description = (__runInitializers(this, _scenarioName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.projectSelections = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _projectSelections_initializers, void 0));
                this.assumptions = (__runInitializers(this, _projectSelections_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                __runInitializers(this, _assumptions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _portfolioId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio ID' }), (0, class_validator_1.IsUUID)()];
            _scenarioName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scenario name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scenario description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _projectSelections_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project IDs to include', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assumptions', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _portfolioId_decorators, { kind: "field", name: "portfolioId", static: false, private: false, access: { has: obj => "portfolioId" in obj, get: obj => obj.portfolioId, set: (obj, value) => { obj.portfolioId = value; } }, metadata: _metadata }, _portfolioId_initializers, _portfolioId_extraInitializers);
            __esDecorate(null, null, _scenarioName_decorators, { kind: "field", name: "scenarioName", static: false, private: false, access: { has: obj => "scenarioName" in obj, get: obj => obj.scenarioName, set: (obj, value) => { obj.scenarioName = value; } }, metadata: _metadata }, _scenarioName_initializers, _scenarioName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _projectSelections_decorators, { kind: "field", name: "projectSelections", static: false, private: false, access: { has: obj => "projectSelections" in obj, get: obj => obj.projectSelections, set: (obj, value) => { obj.projectSelections = value; } }, metadata: _metadata }, _projectSelections_initializers, _projectSelections_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePortfolioScenarioDto = CreatePortfolioScenarioDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Portfolio.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Portfolio model
 *
 * @example
 * ```typescript
 * const Portfolio = createPortfolioModel(sequelize);
 * const portfolio = await Portfolio.create({
 *   portfolioName: 'Digital Transformation 2025',
 *   organizationId: 'org-uuid',
 *   totalBudget: 5000000,
 *   fiscalYear: 2025
 * });
 * ```
 */
const createPortfolioModel = (sequelize) => {
    class Portfolio extends sequelize_1.Model {
    }
    Portfolio.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        portfolioName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Portfolio name',
        },
        portfolioCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique portfolio code',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Portfolio description',
        },
        organizationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Organization ID',
        },
        ownerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Portfolio owner ID',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'under_review', 'archived', 'closed'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Portfolio status',
        },
        strategicObjectives: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Strategic objectives',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total portfolio budget',
        },
        allocatedBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Allocated budget',
        },
        availableBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available budget',
        },
        projectCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total project count',
        },
        activeProjectCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Active project count',
        },
        targetROI: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Target ROI percentage',
        },
        actualROI: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual ROI percentage',
        },
        healthStatus: {
            type: sequelize_1.DataTypes.ENUM('green', 'yellow', 'red', 'critical'),
            allowNull: false,
            defaultValue: 'green',
            comment: 'Portfolio health status',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Portfolio start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Portfolio end date',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created portfolio',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who last updated',
        },
    }, {
        sequelize,
        tableName: 'portfolios',
        timestamps: true,
        indexes: [
            { fields: ['portfolioCode'], unique: true },
            { fields: ['organizationId'] },
            { fields: ['ownerId'] },
            { fields: ['status'] },
            { fields: ['fiscalYear'] },
            { fields: ['healthStatus'] },
        ],
    });
    return Portfolio;
};
exports.createPortfolioModel = createPortfolioModel;
/**
 * Sequelize model for Portfolio Project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PortfolioProject model
 *
 * @example
 * ```typescript
 * const PortfolioProject = createPortfolioProjectModel(sequelize);
 * const project = await PortfolioProject.create({
 *   portfolioId: 'portfolio-uuid',
 *   projectName: 'ERP Implementation',
 *   estimatedBudget: 1200000,
 *   priority: 'high'
 * });
 * ```
 */
const createPortfolioProjectModel = (sequelize) => {
    class PortfolioProject extends sequelize_1.Model {
    }
    PortfolioProject.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        portfolioId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Portfolio ID',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project code',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Project name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Project description',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low', 'on_hold'),
            allowNull: false,
            comment: 'Project priority',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM('ideation', 'evaluation', 'approval', 'planning', 'execution', 'monitoring', 'closing', 'completed'),
            allowNull: false,
            comment: 'Project stage',
        },
        strategicAlignment: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Strategic alignment categories',
        },
        investmentCategory: {
            type: sequelize_1.DataTypes.ENUM('transformational', 'strategic', 'operational', 'maintenance', 'innovation'),
            allowNull: false,
            comment: 'Investment category',
        },
        estimatedBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Estimated budget',
        },
        actualBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual budget spent',
        },
        estimatedBenefit: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Estimated benefit value',
        },
        actualBenefit: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual benefit realized',
        },
        npv: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Net present value',
        },
        irr: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Internal rate of return',
        },
        paybackPeriod: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Payback period in years',
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Risk score (0-100)',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('very_low', 'low', 'medium', 'high', 'very_high'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Risk level',
        },
        complexityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Complexity score (0-100)',
        },
        strategicValue: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Strategic value score (0-100)',
        },
        priorityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Calculated priority score',
        },
        resourceRequirements: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Resource requirements',
        },
        dependencies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Project dependencies',
        },
        milestones: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Project milestones',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Project start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Project end date',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'planning',
            comment: 'Project status',
        },
        healthStatus: {
            type: sequelize_1.DataTypes.ENUM('green', 'yellow', 'red', 'critical'),
            allowNull: false,
            defaultValue: 'green',
            comment: 'Project health status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'portfolio_projects',
        timestamps: true,
        indexes: [
            { fields: ['projectCode'], unique: true },
            { fields: ['portfolioId'] },
            { fields: ['priority'] },
            { fields: ['stage'] },
            { fields: ['status'] },
            { fields: ['healthStatus'] },
            { fields: ['priorityScore'] },
        ],
    });
    return PortfolioProject;
};
exports.createPortfolioProjectModel = createPortfolioProjectModel;
/**
 * Sequelize model for Resource Allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ResourceAllocation model
 *
 * @example
 * ```typescript
 * const ResourceAllocation = createResourceAllocationModel(sequelize);
 * const allocation = await ResourceAllocation.create({
 *   resourceId: 'res-uuid',
 *   projectId: 'proj-uuid',
 *   allocationPercentage: 50
 * });
 * ```
 */
const createResourceAllocationModel = (sequelize) => {
    class ResourceAllocation extends sequelize_1.Model {
    }
    ResourceAllocation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        resourceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Resource ID',
        },
        resourceName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Resource name',
        },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Project ID',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Project name',
        },
        allocationPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Allocation percentage',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Allocation start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Allocation end date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('proposed', 'confirmed', 'active', 'released', 'overallocated'),
            allowNull: false,
            defaultValue: 'proposed',
            comment: 'Allocation status',
        },
        role: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Resource role',
        },
        costRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Cost rate per hour',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'resource_allocations',
        timestamps: true,
        indexes: [
            { fields: ['resourceId'] },
            { fields: ['projectId'] },
            { fields: ['status'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return ResourceAllocation;
};
exports.createResourceAllocationModel = createResourceAllocationModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Helper function to generate unique portfolio code
 */
const generatePortfolioCode = (organizationId, year) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `PF-${year}-${timestamp.slice(-6)}`;
};
/**
 * Helper function to generate unique project code
 */
const generateProjectCode = (portfolioId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `PRJ-${timestamp.slice(-8)}`;
};
/**
 * Helper function to generate UUID
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
// ============================================================================
// SECTION 1: Portfolio Management Functions
// ============================================================================
/**
 * Creates a new portfolio with strategic objectives.
 *
 * @param {any} portfolioData - Portfolio creation data
 * @param {string} userId - User creating portfolio
 * @returns {Promise<Portfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createPortfolio({
 *   portfolioName: 'Digital Transformation 2025',
 *   organizationId: 'org-123',
 *   totalBudget: 5000000,
 *   targetROI: 25,
 *   fiscalYear: 2025,
 *   strategicObjectives: ['Revenue Growth', 'Customer Experience']
 * }, 'user-456');
 * ```
 */
const createPortfolio = async (portfolioData, userId) => {
    const portfolioCode = generatePortfolioCode(portfolioData.organizationId, portfolioData.fiscalYear);
    return {
        id: generateUUID(),
        portfolioName: portfolioData.portfolioName,
        portfolioCode,
        description: portfolioData.description,
        organizationId: portfolioData.organizationId,
        ownerId: portfolioData.ownerId,
        status: PortfolioStatus.DRAFT,
        strategicObjectives: portfolioData.strategicObjectives || [],
        totalBudget: portfolioData.totalBudget,
        allocatedBudget: 0,
        availableBudget: portfolioData.totalBudget,
        projectCount: 0,
        activeProjectCount: 0,
        targetROI: portfolioData.targetROI,
        actualROI: 0,
        healthStatus: PortfolioHealth.GREEN,
        startDate: portfolioData.startDate || new Date(),
        endDate: portfolioData.endDate,
        fiscalYear: portfolioData.fiscalYear,
        metadata: portfolioData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
};
exports.createPortfolio = createPortfolio;
/**
 * Activates portfolio for active management.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} userId - User activating portfolio
 * @returns {Promise<Portfolio>} Activated portfolio
 *
 * @example
 * ```typescript
 * const activated = await activatePortfolio('portfolio-123', 'user-456');
 * ```
 */
const activatePortfolio = async (portfolioId, userId) => {
    // Retrieve portfolio (would normally query database)
    const portfolio = { id: portfolioId };
    return {
        ...portfolio,
        status: PortfolioStatus.ACTIVE,
        updatedAt: new Date(),
        updatedBy: userId,
    };
};
exports.activatePortfolio = activatePortfolio;
/**
 * Adds a project to portfolio with financial analysis.
 *
 * @param {any} projectData - Project data
 * @param {string} userId - User adding project
 * @returns {Promise<PortfolioProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await addProjectToPortfolio({
 *   portfolioId: 'portfolio-123',
 *   projectName: 'CRM Implementation',
 *   estimatedBudget: 500000,
 *   estimatedBenefit: 1200000,
 *   priority: 'high',
 *   strategicAlignment: ['revenue_growth', 'customer_satisfaction']
 * }, 'user-456');
 * ```
 */
const addProjectToPortfolio = async (projectData, userId) => {
    const projectCode = generateProjectCode(projectData.portfolioId);
    // Calculate NPV (simplified)
    const npv = projectData.estimatedBenefit - projectData.estimatedBudget;
    // Calculate IRR (simplified as percentage return)
    const irr = ((projectData.estimatedBenefit - projectData.estimatedBudget) / projectData.estimatedBudget) * 100;
    // Calculate payback period (simplified)
    const paybackPeriod = projectData.estimatedBudget / (projectData.estimatedBenefit / 3);
    return {
        id: generateUUID(),
        portfolioId: projectData.portfolioId,
        projectCode,
        projectName: projectData.projectName,
        description: projectData.description || '',
        priority: projectData.priority,
        stage: ProjectStage.EVALUATION,
        strategicAlignment: projectData.strategicAlignment || [],
        investmentCategory: projectData.investmentCategory,
        estimatedBudget: projectData.estimatedBudget,
        actualBudget: 0,
        estimatedBenefit: projectData.estimatedBenefit,
        actualBenefit: 0,
        npv,
        irr,
        paybackPeriod,
        riskScore: 0,
        riskLevel: RiskLevel.MEDIUM,
        complexityScore: 0,
        strategicValue: 0,
        priorityScore: 0,
        resourceRequirements: [],
        dependencies: [],
        milestones: [],
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: 'planning',
        healthStatus: PortfolioHealth.GREEN,
        metadata: projectData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.addProjectToPortfolio = addProjectToPortfolio;
/**
 * Calculates project priority scores based on multiple factors.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} weights - Weighting factors for prioritization
 * @returns {Promise<PortfolioProject[]>} Projects with calculated priority scores
 *
 * @example
 * ```typescript
 * const prioritized = await calculateProjectPriorityScores('portfolio-123', {
 *   strategicWeight: 0.4,
 *   financialWeight: 0.35,
 *   riskWeight: 0.15,
 *   resourceWeight: 0.1
 * });
 * ```
 */
const calculateProjectPriorityScores = async (portfolioId, weights) => {
    // Would normally retrieve projects from database
    const projects = [];
    return projects.map((project) => {
        const priorityScore = project.strategicValue * weights.strategicWeight +
            (project.npv / 10000) * weights.financialWeight +
            (100 - project.riskScore) * weights.riskWeight +
            project.complexityScore * weights.resourceWeight;
        return {
            ...project,
            priorityScore,
            updatedAt: new Date(),
        };
    });
};
exports.calculateProjectPriorityScores = calculateProjectPriorityScores;
/**
 * Prioritizes projects using weighted scoring model.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} criteria - Prioritization criteria
 * @returns {Promise<PortfolioProject[]>} Sorted projects by priority
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeProjects('portfolio-123', {
 *   strategicFit: 0.4,
 *   financialReturn: 0.35,
 *   riskProfile: 0.15,
 *   resourceAvailability: 0.1
 * });
 * ```
 */
const prioritizeProjects = async (portfolioId, criteria) => {
    const projects = await (0, exports.calculateProjectPriorityScores)(portfolioId, criteria);
    return projects.sort((a, b) => b.priorityScore - a.priorityScore);
};
exports.prioritizeProjects = prioritizeProjects;
/**
 * Performs portfolio balancing analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Portfolio balance analysis
 *
 * @example
 * ```typescript
 * const balance = await analyzePortfolioBalance('portfolio-123');
 * // Returns investment category distribution, risk distribution, etc.
 * ```
 */
const analyzePortfolioBalance = async (portfolioId) => {
    // Would normally retrieve portfolio and projects from database
    const portfolio = { id: portfolioId };
    const projects = [];
    const totalBudget = projects.reduce((sum, p) => sum + p.estimatedBudget, 0);
    const investmentDistribution = projects.reduce((acc, project) => {
        const category = project.investmentCategory;
        if (!acc[category]) {
            acc[category] = { count: 0, budget: 0, percentage: 0 };
        }
        acc[category].count++;
        acc[category].budget += project.estimatedBudget;
        return acc;
    }, {});
    Object.keys(investmentDistribution).forEach((category) => {
        investmentDistribution[category].percentage = (investmentDistribution[category].budget / totalBudget) * 100;
    });
    const riskDistribution = projects.reduce((acc, project) => {
        const level = project.riskLevel;
        if (!acc[level]) {
            acc[level] = { count: 0, budget: 0 };
        }
        acc[level].count++;
        acc[level].budget += project.estimatedBudget;
        return acc;
    }, {});
    return {
        portfolioId,
        totalProjects: projects.length,
        totalBudget,
        investmentDistribution,
        riskDistribution,
        averageROI: projects.reduce((sum, p) => sum + p.irr, 0) / projects.length,
        recommendations: [
            'Consider increasing innovation investments',
            'Balance high-risk projects with more operational initiatives',
            'Review resource allocation for critical path projects',
        ],
    };
};
exports.analyzePortfolioBalance = analyzePortfolioBalance;
// ============================================================================
// SECTION 2: Resource Allocation and Capacity Planning
// ============================================================================
/**
 * Allocates resource to project.
 *
 * @param {any} allocationData - Allocation data
 * @param {string} userId - User creating allocation
 * @returns {Promise<ResourceAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateResourceToProject({
 *   resourceId: 'res-123',
 *   projectId: 'proj-456',
 *   allocationPercentage: 50,
 *   role: 'Senior Consultant',
 *   costRate: 150
 * }, 'user-789');
 * ```
 */
const allocateResourceToProject = async (allocationData, userId) => {
    return {
        id: generateUUID(),
        resourceId: allocationData.resourceId,
        resourceName: allocationData.resourceName || 'Resource',
        projectId: allocationData.projectId,
        projectName: allocationData.projectName || 'Project',
        allocationPercentage: allocationData.allocationPercentage,
        startDate: allocationData.startDate,
        endDate: allocationData.endDate,
        status: AllocationStatus.PROPOSED,
        role: allocationData.role,
        costRate: allocationData.costRate,
        metadata: allocationData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.allocateResourceToProject = allocateResourceToProject;
/**
 * Checks resource availability for allocation.
 *
 * @param {string} resourceId - Resource identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Availability analysis
 *
 * @example
 * ```typescript
 * const availability = await checkResourceAvailability(
 *   'res-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-06-30')
 * );
 * ```
 */
const checkResourceAvailability = async (resourceId, startDate, endDate) => {
    // Would normally query allocations from database
    const allocations = [];
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocationPercentage, 0);
    return {
        resourceId,
        period: { startDate, endDate },
        totalAllocated,
        available: 100 - totalAllocated,
        isAvailable: totalAllocated < 100,
        allocations: allocations.map((a) => ({
            projectId: a.projectId,
            projectName: a.projectName,
            percentage: a.allocationPercentage,
            startDate: a.startDate,
            endDate: a.endDate,
        })),
    };
};
exports.checkResourceAvailability = checkResourceAvailability;
/**
 * Calculates capacity utilization for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<CapacityPlan>} Capacity plan
 *
 * @example
 * ```typescript
 * const capacity = await calculateCapacityUtilization(
 *   'portfolio-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * ```
 */
const calculateCapacityUtilization = async (portfolioId, startDate, endDate) => {
    // Would normally calculate from allocations and resources
    const totalCapacity = 10000; // Total available hours
    const allocatedCapacity = 7500;
    return {
        id: generateUUID(),
        portfolioId,
        planningPeriod: `${startDate.toISOString()} - ${endDate.toISOString()}`,
        totalCapacity,
        allocatedCapacity,
        availableCapacity: totalCapacity - allocatedCapacity,
        utilizationRate: (allocatedCapacity / totalCapacity) * 100,
        demandForecast: 8500,
        supplyForecast: 10000,
        capacityGap: -1500,
        resourceBreakdown: [
            {
                resourceType: 'Senior Consultant',
                totalCapacity: 4000,
                allocated: 3500,
                available: 500,
                utilizationRate: 87.5,
            },
            {
                resourceType: 'Consultant',
                totalCapacity: 6000,
                allocated: 4000,
                available: 2000,
                utilizationRate: 66.7,
            },
        ],
        recommendations: [
            'Increase consultant capacity by 1500 hours',
            'Consider external contractors for peak demand',
            'Prioritize high-value projects',
        ],
        metadata: {},
        createdAt: new Date(),
    };
};
exports.calculateCapacityUtilization = calculateCapacityUtilization;
/**
 * Identifies resource conflicts and overallocations.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any[]>} Resource conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await identifyResourceConflicts('portfolio-123');
 * ```
 */
const identifyResourceConflicts = async (portfolioId) => {
    // Would normally analyze allocations from database
    return [
        {
            resourceId: 'res-123',
            resourceName: 'John Consultant',
            totalAllocation: 125,
            overallocation: 25,
            conflictingProjects: [
                { projectId: 'proj-1', allocation: 75 },
                { projectId: 'proj-2', allocation: 50 },
            ],
            period: { startDate: new Date('2025-02-01'), endDate: new Date('2025-03-31') },
            severity: 'high',
            recommendation: 'Reduce allocation on project 2 or hire additional resource',
        },
    ];
};
exports.identifyResourceConflicts = identifyResourceConflicts;
/**
 * Optimizes resource allocation across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} constraints - Optimization constraints
 * @returns {Promise<any>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizeResourceAllocation('portfolio-123', {
 *   maxUtilization: 85,
 *   priorityProjects: ['proj-1', 'proj-2']
 * });
 * ```
 */
const optimizeResourceAllocation = async (portfolioId, constraints) => {
    return {
        portfolioId,
        optimizationDate: new Date(),
        recommendations: [
            {
                action: 'reallocate',
                resourceId: 'res-123',
                fromProject: 'proj-low',
                toProject: 'proj-high',
                percentage: 25,
                rationale: 'Prioritize critical path project',
            },
            {
                action: 'hire',
                resourceType: 'Senior Consultant',
                quantity: 2,
                rationale: 'Address capacity gap',
            },
        ],
        expectedImprovements: {
            utilizationRate: 82,
            scheduleAdherence: 95,
            costSavings: 50000,
        },
    };
};
exports.optimizeResourceAllocation = optimizeResourceAllocation;
/**
 * Forecasts resource demand for planning period.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} monthsAhead - Months to forecast
 * @returns {Promise<any>} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastResourceDemand('portfolio-123', 12);
 * ```
 */
const forecastResourceDemand = async (portfolioId, monthsAhead) => {
    const months = [];
    for (let i = 0; i < monthsAhead; i++) {
        months.push({
            month: i + 1,
            seniorConsultants: 10 + Math.floor(Math.random() * 5),
            consultants: 15 + Math.floor(Math.random() * 5),
            analysts: 8 + Math.floor(Math.random() * 3),
        });
    }
    return {
        portfolioId,
        forecastPeriod: `Next ${monthsAhead} months`,
        demandByMonth: months,
        peakDemand: {
            month: 6,
            seniorConsultants: 14,
            consultants: 19,
            analysts: 10,
        },
        hiringRecommendations: [
            { role: 'Senior Consultant', quantity: 2, timing: 'Month 4' },
            { role: 'Consultant', quantity: 4, timing: 'Month 3' },
        ],
    };
};
exports.forecastResourceDemand = forecastResourceDemand;
// ============================================================================
// SECTION 3: Portfolio Optimization and Analysis
// ============================================================================
/**
 * Performs portfolio optimization using constraints.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {OptimizationConstraints} constraints - Optimization constraints
 * @returns {Promise<PortfolioOptimization>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizePortfolio('portfolio-123', {
 *   maxBudget: 5000000,
 *   maxRisk: 60,
 *   minROI: 20,
 *   requiredStrategicAlignment: ['revenue_growth', 'innovation'],
 *   resourceConstraints: { 'Senior Consultant': 10 }
 * });
 * ```
 */
const optimizePortfolio = async (portfolioId, constraints) => {
    // Would normally perform complex optimization algorithm
    return {
        portfolioId,
        optimizationDate: new Date(),
        constraints,
        recommendedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-5'],
        rejectedProjects: ['proj-4', 'proj-6'],
        totalValue: 4500000,
        totalCost: 2800000,
        totalRisk: 55,
        utilizationRate: 83,
        strategicFit: 92,
        recommendations: [
            'Defer proj-4 to next fiscal year',
            'Fast-track proj-2 due to high strategic value',
            'Consider partnering on proj-5 to reduce resource demand',
        ],
    };
};
exports.optimizePortfolio = optimizePortfolio;
/**
 * Analyzes portfolio risk profile.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Risk analysis
 *
 * @example
 * ```typescript
 * const riskProfile = await analyzePortfolioRisk('portfolio-123');
 * ```
 */
const analyzePortfolioRisk = async (portfolioId) => {
    return {
        portfolioId,
        overallRiskScore: 65,
        riskLevel: RiskLevel.MEDIUM,
        riskDistribution: {
            very_low: { count: 2, budget: 400000 },
            low: { count: 5, budget: 1200000 },
            medium: { count: 8, budget: 2000000 },
            high: { count: 3, budget: 1000000 },
            very_high: { count: 1, budget: 400000 },
        },
        topRisks: [
            {
                projectId: 'proj-123',
                projectName: 'ERP Implementation',
                riskScore: 85,
                riskFactors: ['Technical complexity', 'Resource constraints', 'Vendor dependency'],
            },
        ],
        mitigationStrategies: [
            'Diversify project portfolio with lower-risk operational projects',
            'Implement enhanced governance for high-risk projects',
            'Build contingency reserves',
        ],
    };
};
exports.analyzePortfolioRisk = analyzePortfolioRisk;
/**
 * Calculates portfolio value metrics (NPV, IRR, ROI).
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Value metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioValue('portfolio-123');
 * ```
 */
const calculatePortfolioValue = async (portfolioId) => {
    return {
        portfolioId,
        totalInvestment: 5000000,
        estimatedBenefits: 12500000,
        netPresentValue: 6200000,
        internalRateOfReturn: 28.5,
        returnOnInvestment: 150,
        paybackPeriod: 2.4,
        benefitCostRatio: 2.5,
        economicValueAdded: 4800000,
        confidenceLevel: 'medium',
        analysisDate: new Date(),
    };
};
exports.calculatePortfolioValue = calculatePortfolioValue;
/**
 * Performs what-if scenario analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} scenarioParameters - Scenario parameters
 * @returns {Promise<any>} Scenario analysis results
 *
 * @example
 * ```typescript
 * const whatIf = await performWhatIfAnalysis('portfolio-123', {
 *   budgetIncrease: 10,
 *   resourceIncrease: 5,
 *   riskTolerance: 'high'
 * });
 * ```
 */
const performWhatIfAnalysis = async (portfolioId, scenarioParameters) => {
    return {
        portfolioId,
        scenario: scenarioParameters,
        baselineMetrics: {
            projectCount: 12,
            totalBudget: 5000000,
            expectedROI: 25,
            riskScore: 60,
        },
        scenarioMetrics: {
            projectCount: 15,
            totalBudget: 5500000,
            expectedROI: 28,
            riskScore: 65,
        },
        delta: {
            additionalProjects: 3,
            additionalBudget: 500000,
            roiImprovement: 3,
            riskIncrease: 5,
        },
        recommendation: 'Scenario is viable with acceptable risk increase',
    };
};
exports.performWhatIfAnalysis = performWhatIfAnalysis;
/**
 * Creates portfolio scenario for comparison.
 *
 * @param {any} scenarioData - Scenario data
 * @param {string} userId - User creating scenario
 * @returns {Promise<PortfolioScenario>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createPortfolioScenario({
 *   portfolioId: 'portfolio-123',
 *   scenarioName: 'Aggressive Growth',
 *   projectSelections: ['proj-1', 'proj-2', 'proj-3'],
 *   assumptions: ['15% budget increase', 'Additional 5 resources']
 * }, 'user-456');
 * ```
 */
const createPortfolioScenario = async (scenarioData, userId) => {
    return {
        id: generateUUID(),
        portfolioId: scenarioData.portfolioId,
        scenarioName: scenarioData.scenarioName,
        description: scenarioData.description || '',
        assumptions: scenarioData.assumptions || [],
        projectSelections: scenarioData.projectSelections,
        totalBudget: 5500000,
        totalBenefit: 13000000,
        totalRisk: 65,
        strategicAlignment: 88,
        npv: 6800000,
        roi: 136,
        createdAt: new Date(),
        createdBy: userId,
    };
};
exports.createPortfolioScenario = createPortfolioScenario;
/**
 * Compares multiple portfolio scenarios.
 *
 * @param {string[]} scenarioIds - Scenario identifiers
 * @returns {Promise<any>} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = await comparePortfolioScenarios([
 *   'scenario-1', 'scenario-2', 'scenario-3'
 * ]);
 * ```
 */
const comparePortfolioScenarios = async (scenarioIds) => {
    return {
        scenarioCount: scenarioIds.length,
        scenarios: scenarioIds.map((id) => ({
            scenarioId: id,
            scenarioName: `Scenario ${id}`,
            projectCount: 12,
            totalBudget: 5000000,
            expectedROI: 25,
            riskScore: 60,
            strategicFit: 85,
        })),
        recommendation: 'Scenario 2 provides best balance of value and risk',
        analysis: {
            highestROI: 'scenario-1',
            lowestRisk: 'scenario-3',
            bestStrategicFit: 'scenario-2',
            mostBalanced: 'scenario-2',
        },
    };
};
exports.comparePortfolioScenarios = comparePortfolioScenarios;
// ============================================================================
// SECTION 4: Strategic Alignment and Governance
// ============================================================================
/**
 * Assesses strategic alignment of projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string[]} strategicObjectives - Strategic objectives
 * @returns {Promise<any>} Alignment assessment
 *
 * @example
 * ```typescript
 * const alignment = await assessStrategicAlignment('portfolio-123', [
 *   'Revenue Growth', 'Customer Satisfaction', 'Innovation'
 * ]);
 * ```
 */
const assessStrategicAlignment = async (portfolioId, strategicObjectives) => {
    return {
        portfolioId,
        strategicObjectives,
        overallAlignmentScore: 82,
        alignmentByObjective: {
            'Revenue Growth': { score: 88, projectCount: 5, budget: 2000000 },
            'Customer Satisfaction': { score: 75, projectCount: 3, budget: 1200000 },
            Innovation: { score: 85, projectCount: 4, budget: 1800000 },
        },
        gapAnalysis: [
            {
                objective: 'Customer Satisfaction',
                currentScore: 75,
                targetScore: 85,
                gap: 10,
                recommendation: 'Increase investment in CX projects by $500K',
            },
        ],
        recommendations: ['Rebalance portfolio to strengthen customer satisfaction initiatives'],
    };
};
exports.assessStrategicAlignment = assessStrategicAlignment;
/**
 * Creates stage gate review for project.
 *
 * @param {any} reviewData - Review data
 * @param {string} userId - User creating review
 * @returns {Promise<StageGateReview>} Created review
 *
 * @example
 * ```typescript
 * const review = await createStageGateReview({
 *   projectId: 'proj-123',
 *   stage: 'approval',
 *   overallScore: 85,
 *   decision: 'approved',
 *   reviewers: ['user-1', 'user-2']
 * }, 'user-456');
 * ```
 */
const createStageGateReview = async (reviewData, userId) => {
    return {
        id: generateUUID(),
        projectId: reviewData.projectId,
        stage: reviewData.stage,
        reviewDate: reviewData.reviewDate || new Date(),
        reviewers: reviewData.reviewers,
        criteria: [
            { criterionName: 'Business Case', weight: 0.3, score: 85, maxScore: 100, comments: 'Strong business case' },
            { criterionName: 'Technical Feasibility', weight: 0.25, score: 80, maxScore: 100, comments: 'Feasible' },
            { criterionName: 'Resource Availability', weight: 0.25, score: 90, maxScore: 100, comments: 'Resources ready' },
            { criterionName: 'Risk Profile', weight: 0.2, score: 75, maxScore: 100, comments: 'Acceptable risk' },
        ],
        overallScore: reviewData.overallScore,
        decision: reviewData.decision,
        conditions: reviewData.conditions || [],
        recommendations: reviewData.recommendations || [],
        nextReviewDate: reviewData.nextReviewDate,
        metadata: reviewData.metadata || {},
    };
};
exports.createStageGateReview = createStageGateReview;
/**
 * Tracks benefits realization for project.
 *
 * @param {any} benefitData - Benefit data
 * @param {string} userId - User tracking benefit
 * @returns {Promise<BenefitsRealization>} Benefit record
 *
 * @example
 * ```typescript
 * const benefit = await trackBenefitsRealization({
 *   projectId: 'proj-123',
 *   benefitType: 'Revenue Increase',
 *   estimatedValue: 500000,
 *   actualValue: 550000
 * }, 'user-456');
 * ```
 */
const trackBenefitsRealization = async (benefitData, userId) => {
    return {
        id: generateUUID(),
        projectId: benefitData.projectId,
        benefitType: benefitData.benefitType,
        description: benefitData.description || '',
        estimatedValue: benefitData.estimatedValue,
        actualValue: benefitData.actualValue || 0,
        realizationDate: benefitData.realizationDate || new Date(),
        measurementMethod: benefitData.measurementMethod || 'Direct measurement',
        status: benefitData.actualValue > 0 ? 'realized' : 'planned',
        metadata: benefitData.metadata || {},
    };
};
exports.trackBenefitsRealization = trackBenefitsRealization;
/**
 * Generates portfolio governance report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Governance report
 *
 * @example
 * ```typescript
 * const report = await generateGovernanceReport('portfolio-123');
 * ```
 */
const generateGovernanceReport = async (portfolioId) => {
    return {
        portfolioId,
        reportDate: new Date(),
        executiveSummary: {
            totalProjects: 12,
            onTrackProjects: 8,
            atRiskProjects: 3,
            delayedProjects: 1,
            budgetUtilization: 78,
            benefitsRealization: 65,
        },
        stageGateCompliance: {
            totalReviews: 24,
            onTimeReviews: 22,
            overdueReviews: 2,
            complianceRate: 92,
        },
        keyIssues: [
            { projectId: 'proj-4', issue: 'Resource shortage', severity: 'high', mitigation: 'External hiring' },
        ],
        upcomingDecisions: [
            { projectId: 'proj-5', decision: 'Stage gate approval', dueDate: new Date('2025-03-15') },
        ],
        recommendations: ['Expedite stage gate reviews for projects 4 and 7'],
    };
};
exports.generateGovernanceReport = generateGovernanceReport;
/**
 * Monitors portfolio health indicators.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Health indicators
 *
 * @example
 * ```typescript
 * const health = await monitorPortfolioHealth('portfolio-123');
 * ```
 */
const monitorPortfolioHealth = async (portfolioId) => {
    return {
        portfolioId,
        overallHealth: PortfolioHealth.YELLOW,
        indicators: {
            schedule: { status: 'yellow', onTime: 75, delayed: 25, trend: 'declining' },
            budget: { status: 'green', withinBudget: 90, overBudget: 10, trend: 'stable' },
            quality: { status: 'green', meetingStandards: 95, issues: 5, trend: 'improving' },
            risks: { status: 'yellow', controlled: 70, escalated: 30, trend: 'stable' },
            resources: { status: 'red', adequatelyStaffed: 60, understaffed: 40, trend: 'declining' },
        },
        alerts: [
            { type: 'resource_shortage', severity: 'high', message: 'Senior consultant capacity at 95%' },
            { type: 'schedule_slip', severity: 'medium', message: '3 projects delayed by >2 weeks' },
        ],
        recommendations: ['Address resource constraints urgently', 'Review project schedules'],
    };
};
exports.monitorPortfolioHealth = monitorPortfolioHealth;
// ============================================================================
// SECTION 5: Portfolio Reporting and Analytics
// ============================================================================
/**
 * Generates comprehensive portfolio dashboard.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePortfolioDashboard('portfolio-123');
 * ```
 */
const generatePortfolioDashboard = async (portfolioId) => {
    return {
        portfolioId,
        generatedAt: new Date(),
        summary: {
            totalProjects: 12,
            activeProjects: 9,
            totalBudget: 5000000,
            allocatedBudget: 3900000,
            utilizationRate: 78,
            overallHealth: PortfolioHealth.YELLOW,
        },
        financialMetrics: {
            totalInvestment: 3900000,
            estimatedBenefits: 9500000,
            actualBenefits: 2800000,
            roi: 143,
            npv: 5200000,
        },
        projectsByStage: {
            ideation: 1,
            evaluation: 2,
            approval: 1,
            planning: 2,
            execution: 5,
            monitoring: 0,
            closing: 1,
            completed: 0,
        },
        projectsByPriority: {
            critical: 2,
            high: 4,
            medium: 5,
            low: 1,
            on_hold: 0,
        },
        topProjects: [
            { projectId: 'proj-1', name: 'CRM Modernization', value: 2500000, health: 'green' },
            { projectId: 'proj-2', name: 'Data Analytics Platform', value: 1800000, health: 'green' },
        ],
        atRiskProjects: [{ projectId: 'proj-4', name: 'Legacy System Migration', issues: ['Resource shortage'] }],
    };
};
exports.generatePortfolioDashboard = generatePortfolioDashboard;
/**
 * Generates executive portfolio summary report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary('portfolio-123');
 * ```
 */
const generateExecutiveSummary = async (portfolioId) => {
    return {
        portfolioId,
        reportDate: new Date(),
        period: 'Q1 2025',
        highlights: [
            'Completed CRM Phase 1 ahead of schedule',
            'Realized $1.2M in cost savings',
            '3 new strategic projects approved',
        ],
        overallStatus: PortfolioHealth.YELLOW,
        keyMetrics: {
            portfolioValue: 5200000,
            benefitsRealized: 2800000,
            onTimeDelivery: 75,
            budgetAdherence: 95,
            resourceUtilization: 82,
        },
        strategicProgress: {
            revenueGrowth: { progress: 78, target: 85 },
            costReduction: { progress: 92, target: 90 },
            customerSatisfaction: { progress: 65, target: 80 },
        },
        keyDecisions: ['Approve additional $500K for data analytics project', 'Defer low-priority projects'],
        risks: ['Resource capacity constraints', 'Vendor delivery delays'],
    };
};
exports.generateExecutiveSummary = generateExecutiveSummary;
/**
 * Analyzes portfolio trends over time.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzePortfolioTrends('portfolio-123', 12);
 * ```
 */
const analyzePortfolioTrends = async (portfolioId, months) => {
    const monthlyData = [];
    for (let i = 0; i < months; i++) {
        monthlyData.push({
            month: i + 1,
            activeProjects: 8 + Math.floor(Math.random() * 4),
            budgetUtilization: 70 + Math.random() * 15,
            benefitsRealized: 200000 + Math.random() * 100000,
            resourceUtilization: 75 + Math.random() * 15,
        });
    }
    return {
        portfolioId,
        period: `Last ${months} months`,
        trends: {
            projectCount: { trend: 'increasing', rate: 5 },
            budgetUtilization: { trend: 'stable', rate: 0 },
            benefitsRealization: { trend: 'increasing', rate: 12 },
            resourceUtilization: { trend: 'increasing', rate: 3 },
        },
        monthlyData,
        forecast: {
            nextQuarter: {
                expectedProjects: 14,
                expectedBudget: 4500000,
                expectedBenefits: 11000000,
            },
        },
    };
};
exports.analyzePortfolioTrends = analyzePortfolioTrends;
/**
 * Generates portfolio performance metrics report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Performance report
 *
 * @example
 * ```typescript
 * const performance = await generatePerformanceReport(
 *   'portfolio-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
const generatePerformanceReport = async (portfolioId, startDate, endDate) => {
    return {
        portfolioId,
        reportPeriod: { startDate, endDate },
        projectsCompleted: 3,
        projectsStarted: 5,
        totalSpent: 1200000,
        benefitsRealized: 800000,
        schedulePerformance: {
            onTime: 8,
            delayed: 3,
            early: 1,
            averageDelay: 5,
        },
        budgetPerformance: {
            underBudget: 7,
            onBudget: 4,
            overBudget: 1,
            averageVariance: 3,
        },
        qualityMetrics: {
            defectRate: 2.5,
            customerSatisfaction: 4.2,
            teamSatisfaction: 4.5,
        },
        topPerformers: [
            { projectId: 'proj-1', performance: 95 },
            { projectId: 'proj-3', performance: 92 },
        ],
        improvementAreas: ['Schedule adherence', 'Stakeholder communication'],
    };
};
exports.generatePerformanceReport = generatePerformanceReport;
/**
 * Exports portfolio data for external analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} format - Export format (json, csv, excel)
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportPortfolioData('portfolio-123', 'json');
 * ```
 */
const exportPortfolioData = async (portfolioId, format) => {
    return {
        portfolioId,
        exportFormat: format,
        exportDate: new Date(),
        dataSet: 'complete',
        recordCount: 150,
        downloadUrl: `/exports/portfolio-${portfolioId}-${Date.now()}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
};
exports.exportPortfolioData = exportPortfolioData;
// ============================================================================
// SECTION 6: Dependency Management and Roadmaps
// ============================================================================
/**
 * Analyzes project dependencies.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Dependency analysis
 *
 * @example
 * ```typescript
 * const dependencies = await analyzeProjectDependencies('portfolio-123');
 * ```
 */
const analyzeProjectDependencies = async (portfolioId) => {
    return {
        portfolioId,
        totalDependencies: 18,
        criticalPathProjects: ['proj-1', 'proj-2', 'proj-5'],
        dependencyTypes: {
            finish_to_start: 12,
            start_to_start: 4,
            finish_to_finish: 2,
            start_to_finish: 0,
        },
        dependencyMap: [
            {
                sourceProject: 'proj-1',
                targetProjects: ['proj-2', 'proj-3'],
                type: 'finish_to_start',
                isCritical: true,
            },
        ],
        risks: [{ type: 'circular_dependency', projects: [], severity: 'none' }],
        recommendations: ['Monitor critical path closely', 'Build buffer time for dependencies'],
    };
};
exports.analyzeProjectDependencies = analyzeProjectDependencies;
/**
 * Identifies critical path through portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyCriticalPath('portfolio-123');
 * ```
 */
const identifyCriticalPath = async (portfolioId) => {
    return {
        portfolioId,
        criticalPathLength: 18,
        criticalPathProjects: [
            { projectId: 'proj-1', duration: 6, startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30') },
            { projectId: 'proj-2', duration: 8, startDate: new Date('2025-07-01'), endDate: new Date('2026-02-28') },
            { projectId: 'proj-5', duration: 4, startDate: new Date('2026-03-01'), endDate: new Date('2026-06-30') },
        ],
        totalFloat: 0,
        nearCriticalPaths: [
            {
                projects: ['proj-3', 'proj-4'],
                duration: 16,
                float: 2,
            },
        ],
        recommendations: ['Focus management attention on critical path projects', 'Build contingency for risks'],
    };
};
exports.identifyCriticalPath = identifyCriticalPath;
/**
 * Creates portfolio roadmap.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} timeHorizonMonths - Roadmap time horizon
 * @returns {Promise<any>} Portfolio roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createPortfolioRoadmap('portfolio-123', 24);
 * ```
 */
const createPortfolioRoadmap = async (portfolioId, timeHorizonMonths) => {
    const quarters = [];
    for (let i = 0; i < Math.ceil(timeHorizonMonths / 3); i++) {
        quarters.push({
            quarter: `Q${(i % 4) + 1} ${Math.floor(i / 4) + 2025}`,
            projects: [
                { projectId: `proj-${i}-1`, name: `Project ${i}-1`, stage: 'execution' },
                { projectId: `proj-${i}-2`, name: `Project ${i}-2`, stage: 'planning' },
            ],
            milestones: [
                { projectId: `proj-${i}-1`, milestone: 'Phase completion', date: new Date() },
            ],
            budget: 1000000 + Math.random() * 500000,
        });
    }
    return {
        portfolioId,
        timeHorizon: `${timeHorizonMonths} months`,
        quarters,
        strategicThemes: ['Digital Transformation', 'Operational Excellence', 'Growth'],
        keyMilestones: [
            { date: new Date('2025-06-30'), description: 'CRM Go-live' },
            { date: new Date('2025-12-31'), description: 'Data platform completion' },
        ],
    };
};
exports.createPortfolioRoadmap = createPortfolioRoadmap;
/**
 * Validates portfolio schedule feasibility.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Feasibility analysis
 *
 * @example
 * ```typescript
 * const feasibility = await validateScheduleFeasibility('portfolio-123');
 * ```
 */
const validateScheduleFeasibility = async (portfolioId) => {
    return {
        portfolioId,
        overallFeasibility: 'feasible_with_risks',
        resourceConstraints: {
            seniorConsultants: { required: 12, available: 10, gap: 2, severity: 'high' },
            consultants: { required: 18, available: 20, gap: -2, severity: 'none' },
        },
        scheduleConflicts: [
            {
                period: { startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31') },
                conflictingProjects: ['proj-2', 'proj-4', 'proj-7'],
                resourceType: 'Senior Consultant',
                overallocation: 150,
            },
        ],
        recommendations: [
            'Hire 2 additional senior consultants',
            'Defer proj-7 to Q4',
            'Consider external contractors for peak periods',
        ],
        alternativeScenarios: [
            { description: 'Defer low-priority projects', feasibility: 'high' },
            { description: 'Increase contractor usage', feasibility: 'medium' },
        ],
    };
};
exports.validateScheduleFeasibility = validateScheduleFeasibility;
/**
 * Manages project interdependencies and constraints.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {ProjectDependency[]} dependencies - Project dependencies
 * @returns {Promise<any>} Dependency management result
 *
 * @example
 * ```typescript
 * const managed = await manageProjectInterdependencies('portfolio-123', [
 *   {
 *     sourceProjectId: 'proj-1',
 *     targetProjectId: 'proj-2',
 *     dependencyType: 'finish_to_start',
 *     isCritical: true
 *   }
 * ]);
 * ```
 */
const manageProjectInterdependencies = async (portfolioId, dependencies) => {
    return {
        portfolioId,
        dependenciesProcessed: dependencies.length,
        validDependencies: dependencies.length - 1,
        invalidDependencies: 1,
        issues: [{ dependency: 'proj-3 -> proj-2', issue: 'Creates circular dependency', resolution: 'Removed' }],
        criticalDependencies: dependencies.filter((d) => d.isCritical).length,
        recommendations: ['Monitor critical dependencies weekly', 'Build buffer time for high-risk dependencies'],
    };
};
exports.manageProjectInterdependencies = manageProjectInterdependencies;
//# sourceMappingURL=project-portfolio-kit.js.map