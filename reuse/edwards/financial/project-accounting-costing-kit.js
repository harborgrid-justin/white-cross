"use strict";
/**
 * LOC: PRJACCT001
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend project management modules
 *   - Project costing services
 *   - Project billing modules
 *   - Earned value management
 *   - Project analytics and forecasting
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
exports.getProjectChangeOrders = exports.approveChangeOrder = exports.createChangeOrder = exports.generateCostToCompleteReport = exports.calculateCostToComplete = exports.generateProjectScorecard = exports.calculateProjectProfitability = exports.generateProjectAnalytics = exports.generateForecastReport = exports.calculateEstimateToComplete = exports.calculateEstimateAtCompletion = exports.createProjectForecast = exports.getRevenueRecognitionHistory = exports.calculateRevenueRecognition = exports.calculateBillingCompletion = exports.getUnbilledCosts = exports.processBilling = exports.createBillingSchedule = exports.calculateSPI = exports.calculateCPI = exports.getEarnedValueTrend = exports.storeEarnedValueMetrics = exports.calculateEarnedValue = exports.calculateCommitmentTotals = exports.getOpenCommitments = exports.updateCommitmentStatus = exports.createProjectCommitment = exports.getProjectCostsByWBS = exports.getProjectCostsByCategory = exports.recordProjectCost = exports.calculateBudgetVariance = exports.getProjectBudgetVsActual = exports.updateProjectBudget = exports.createProjectBudget = exports.calculateWBSRollup = exports.updateWBSElement = exports.getWBSHierarchy = exports.createWBSElement = exports.closeProject = exports.getProjectDetails = exports.updateProject = exports.createProject = exports.createWorkBreakdownStructureModel = exports.createProjectHeaderModel = exports.EarnedValueCalculationDto = exports.CreateBillingScheduleDto = exports.RecordProjectCostDto = exports.CreateProjectBudgetDto = exports.CreateWBSDto = exports.CreateProjectDto = void 0;
/**
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 * Locator: WC-EDW-PRJACCT-001
 * Purpose: Comprehensive Project Accounting & Costing - JD Edwards EnterpriseOne-level project management, costing, billing, earned value
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/projects/*, Project Costing Services, Project Billing, Earned Value Management, Project Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for project setup, budgets, costing, WBS, earned value, billing, commitments, forecasting, analytics
 *
 * LLM Context: Enterprise-grade project accounting competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive project lifecycle management, work breakdown structure (WBS), project budgeting,
 * cost collection, commitment tracking, earned value management (EVM), project billing, revenue recognition,
 * project forecasting, cost-to-complete analysis, project analytics, resource allocation, and multi-project reporting.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateProjectDto = (() => {
    var _a;
    let _projectNumber_decorators;
    let _projectNumber_initializers = [];
    let _projectNumber_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _projectType_decorators;
    let _projectType_initializers = [];
    let _projectType_extraInitializers = [];
    let _projectManager_decorators;
    let _projectManager_initializers = [];
    let _projectManager_extraInitializers = [];
    let _customerCode_decorators;
    let _customerCode_initializers = [];
    let _customerCode_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _plannedEndDate_decorators;
    let _plannedEndDate_initializers = [];
    let _plannedEndDate_extraInitializers = [];
    let _organizationUnit_decorators;
    let _organizationUnit_initializers = [];
    let _organizationUnit_extraInitializers = [];
    let _costCenter_decorators;
    let _costCenter_initializers = [];
    let _costCenter_extraInitializers = [];
    let _fundingSource_decorators;
    let _fundingSource_initializers = [];
    let _fundingSource_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    return _a = class CreateProjectDto {
            constructor() {
                this.projectNumber = __runInitializers(this, _projectNumber_initializers, void 0);
                this.projectName = (__runInitializers(this, _projectNumber_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
                this.projectType = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _projectType_initializers, void 0));
                this.projectManager = (__runInitializers(this, _projectType_extraInitializers), __runInitializers(this, _projectManager_initializers, void 0));
                this.customerCode = (__runInitializers(this, _projectManager_extraInitializers), __runInitializers(this, _customerCode_initializers, void 0));
                this.contractNumber = (__runInitializers(this, _customerCode_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
                this.startDate = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.plannedEndDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _plannedEndDate_initializers, void 0));
                this.organizationUnit = (__runInitializers(this, _plannedEndDate_extraInitializers), __runInitializers(this, _organizationUnit_initializers, void 0));
                this.costCenter = (__runInitializers(this, _organizationUnit_extraInitializers), __runInitializers(this, _costCenter_initializers, void 0));
                this.fundingSource = (__runInitializers(this, _costCenter_extraInitializers), __runInitializers(this, _fundingSource_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _fundingSource_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                __runInitializers(this, _totalBudget_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project number', example: 'PRJ-2024-001' })];
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name', example: 'Building Construction Phase 1' })];
            _projectType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project type', enum: ['capital', 'operating', 'research', 'construction', 'maintenance'] })];
            _projectManager_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project manager', example: 'john.doe' })];
            _customerCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer code', required: false })];
            _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract number', required: false })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project start date', example: '2024-01-01' })];
            _plannedEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned end date', example: '2024-12-31' })];
            _organizationUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization unit' })];
            _costCenter_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center' })];
            _fundingSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Funding source' })];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget amount' })];
            __esDecorate(null, null, _projectNumber_decorators, { kind: "field", name: "projectNumber", static: false, private: false, access: { has: obj => "projectNumber" in obj, get: obj => obj.projectNumber, set: (obj, value) => { obj.projectNumber = value; } }, metadata: _metadata }, _projectNumber_initializers, _projectNumber_extraInitializers);
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _projectType_decorators, { kind: "field", name: "projectType", static: false, private: false, access: { has: obj => "projectType" in obj, get: obj => obj.projectType, set: (obj, value) => { obj.projectType = value; } }, metadata: _metadata }, _projectType_initializers, _projectType_extraInitializers);
            __esDecorate(null, null, _projectManager_decorators, { kind: "field", name: "projectManager", static: false, private: false, access: { has: obj => "projectManager" in obj, get: obj => obj.projectManager, set: (obj, value) => { obj.projectManager = value; } }, metadata: _metadata }, _projectManager_initializers, _projectManager_extraInitializers);
            __esDecorate(null, null, _customerCode_decorators, { kind: "field", name: "customerCode", static: false, private: false, access: { has: obj => "customerCode" in obj, get: obj => obj.customerCode, set: (obj, value) => { obj.customerCode = value; } }, metadata: _metadata }, _customerCode_initializers, _customerCode_extraInitializers);
            __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _plannedEndDate_decorators, { kind: "field", name: "plannedEndDate", static: false, private: false, access: { has: obj => "plannedEndDate" in obj, get: obj => obj.plannedEndDate, set: (obj, value) => { obj.plannedEndDate = value; } }, metadata: _metadata }, _plannedEndDate_initializers, _plannedEndDate_extraInitializers);
            __esDecorate(null, null, _organizationUnit_decorators, { kind: "field", name: "organizationUnit", static: false, private: false, access: { has: obj => "organizationUnit" in obj, get: obj => obj.organizationUnit, set: (obj, value) => { obj.organizationUnit = value; } }, metadata: _metadata }, _organizationUnit_initializers, _organizationUnit_extraInitializers);
            __esDecorate(null, null, _costCenter_decorators, { kind: "field", name: "costCenter", static: false, private: false, access: { has: obj => "costCenter" in obj, get: obj => obj.costCenter, set: (obj, value) => { obj.costCenter = value; } }, metadata: _metadata }, _costCenter_initializers, _costCenter_extraInitializers);
            __esDecorate(null, null, _fundingSource_decorators, { kind: "field", name: "fundingSource", static: false, private: false, access: { has: obj => "fundingSource" in obj, get: obj => obj.fundingSource, set: (obj, value) => { obj.fundingSource = value; } }, metadata: _metadata }, _fundingSource_initializers, _fundingSource_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateProjectDto = CreateProjectDto;
let CreateWBSDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _wbsCode_decorators;
    let _wbsCode_initializers = [];
    let _wbsCode_extraInitializers = [];
    let _wbsName_decorators;
    let _wbsName_initializers = [];
    let _wbsName_extraInitializers = [];
    let _wbsLevel_decorators;
    let _wbsLevel_initializers = [];
    let _wbsLevel_extraInitializers = [];
    let _parentWbsId_decorators;
    let _parentWbsId_initializers = [];
    let _parentWbsId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _responsiblePerson_decorators;
    let _responsiblePerson_initializers = [];
    let _responsiblePerson_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _isBillable_decorators;
    let _isBillable_initializers = [];
    let _isBillable_extraInitializers = [];
    return _a = class CreateWBSDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.wbsCode = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _wbsCode_initializers, void 0));
                this.wbsName = (__runInitializers(this, _wbsCode_extraInitializers), __runInitializers(this, _wbsName_initializers, void 0));
                this.wbsLevel = (__runInitializers(this, _wbsName_extraInitializers), __runInitializers(this, _wbsLevel_initializers, void 0));
                this.parentWbsId = (__runInitializers(this, _wbsLevel_extraInitializers), __runInitializers(this, _parentWbsId_initializers, void 0));
                this.description = (__runInitializers(this, _parentWbsId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.responsiblePerson = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _responsiblePerson_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _responsiblePerson_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.isBillable = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _isBillable_initializers, void 0));
                __runInitializers(this, _isBillable_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' })];
            _wbsCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS code', example: '1.2.3' })];
            _wbsName_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS name', example: 'Site Preparation' })];
            _wbsLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS level in hierarchy' })];
            _parentWbsId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent WBS ID', required: false })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _responsiblePerson_decorators = [(0, swagger_1.ApiProperty)({ description: 'Responsible person' })];
            _budgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount' })];
            _isBillable_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is billable', default: true })];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _wbsCode_decorators, { kind: "field", name: "wbsCode", static: false, private: false, access: { has: obj => "wbsCode" in obj, get: obj => obj.wbsCode, set: (obj, value) => { obj.wbsCode = value; } }, metadata: _metadata }, _wbsCode_initializers, _wbsCode_extraInitializers);
            __esDecorate(null, null, _wbsName_decorators, { kind: "field", name: "wbsName", static: false, private: false, access: { has: obj => "wbsName" in obj, get: obj => obj.wbsName, set: (obj, value) => { obj.wbsName = value; } }, metadata: _metadata }, _wbsName_initializers, _wbsName_extraInitializers);
            __esDecorate(null, null, _wbsLevel_decorators, { kind: "field", name: "wbsLevel", static: false, private: false, access: { has: obj => "wbsLevel" in obj, get: obj => obj.wbsLevel, set: (obj, value) => { obj.wbsLevel = value; } }, metadata: _metadata }, _wbsLevel_initializers, _wbsLevel_extraInitializers);
            __esDecorate(null, null, _parentWbsId_decorators, { kind: "field", name: "parentWbsId", static: false, private: false, access: { has: obj => "parentWbsId" in obj, get: obj => obj.parentWbsId, set: (obj, value) => { obj.parentWbsId = value; } }, metadata: _metadata }, _parentWbsId_initializers, _parentWbsId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _responsiblePerson_decorators, { kind: "field", name: "responsiblePerson", static: false, private: false, access: { has: obj => "responsiblePerson" in obj, get: obj => obj.responsiblePerson, set: (obj, value) => { obj.responsiblePerson = value; } }, metadata: _metadata }, _responsiblePerson_initializers, _responsiblePerson_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _isBillable_decorators, { kind: "field", name: "isBillable", static: false, private: false, access: { has: obj => "isBillable" in obj, get: obj => obj.isBillable, set: (obj, value) => { obj.isBillable = value; } }, metadata: _metadata }, _isBillable_initializers, _isBillable_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWBSDto = CreateWBSDto;
let CreateProjectBudgetDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _wbsId_decorators;
    let _wbsId_initializers = [];
    let _wbsId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _budgetType_decorators;
    let _budgetType_initializers = [];
    let _budgetType_extraInitializers = [];
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _costCategory_decorators;
    let _costCategory_initializers = [];
    let _costCategory_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    return _a = class CreateProjectBudgetDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.wbsId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _wbsId_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _wbsId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.budgetType = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _budgetType_initializers, void 0));
                this.accountCode = (__runInitializers(this, _budgetType_extraInitializers), __runInitializers(this, _accountCode_initializers, void 0));
                this.costCategory = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _costCategory_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _costCategory_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                __runInitializers(this, _budgetAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' })];
            _wbsId_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS ID', required: false })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _budgetType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget type', enum: ['original', 'revised', 'forecast', 'baseline'] })];
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _costCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost category' })];
            _budgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount' })];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _wbsId_decorators, { kind: "field", name: "wbsId", static: false, private: false, access: { has: obj => "wbsId" in obj, get: obj => obj.wbsId, set: (obj, value) => { obj.wbsId = value; } }, metadata: _metadata }, _wbsId_initializers, _wbsId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _budgetType_decorators, { kind: "field", name: "budgetType", static: false, private: false, access: { has: obj => "budgetType" in obj, get: obj => obj.budgetType, set: (obj, value) => { obj.budgetType = value; } }, metadata: _metadata }, _budgetType_initializers, _budgetType_extraInitializers);
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _costCategory_decorators, { kind: "field", name: "costCategory", static: false, private: false, access: { has: obj => "costCategory" in obj, get: obj => obj.costCategory, set: (obj, value) => { obj.costCategory = value; } }, metadata: _metadata }, _costCategory_initializers, _costCategory_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateProjectBudgetDto = CreateProjectBudgetDto;
let RecordProjectCostDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _wbsId_decorators;
    let _wbsId_initializers = [];
    let _wbsId_extraInitializers = [];
    let _costDate_decorators;
    let _costDate_initializers = [];
    let _costDate_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _costCategory_decorators;
    let _costCategory_initializers = [];
    let _costCategory_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitOfMeasure_decorators;
    let _unitOfMeasure_initializers = [];
    let _unitOfMeasure_extraInitializers = [];
    let _unitCost_decorators;
    let _unitCost_initializers = [];
    let _unitCost_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isBillable_decorators;
    let _isBillable_initializers = [];
    let _isBillable_extraInitializers = [];
    return _a = class RecordProjectCostDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.wbsId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _wbsId_initializers, void 0));
                this.costDate = (__runInitializers(this, _wbsId_extraInitializers), __runInitializers(this, _costDate_initializers, void 0));
                this.transactionType = (__runInitializers(this, _costDate_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
                this.accountCode = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _accountCode_initializers, void 0));
                this.costCategory = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _costCategory_initializers, void 0));
                this.quantity = (__runInitializers(this, _costCategory_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitOfMeasure = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitOfMeasure_initializers, void 0));
                this.unitCost = (__runInitializers(this, _unitOfMeasure_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
                this.description = (__runInitializers(this, _unitCost_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isBillable = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isBillable_initializers, void 0));
                __runInitializers(this, _isBillable_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' })];
            _wbsId_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS ID', required: false })];
            _costDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost date' })];
            _transactionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction type', enum: ['labor', 'material', 'equipment', 'subcontract', 'overhead', 'other'] })];
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _costCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost category' })];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity' })];
            _unitOfMeasure_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measure' })];
            _unitCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit cost' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _isBillable_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is billable', default: true })];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _wbsId_decorators, { kind: "field", name: "wbsId", static: false, private: false, access: { has: obj => "wbsId" in obj, get: obj => obj.wbsId, set: (obj, value) => { obj.wbsId = value; } }, metadata: _metadata }, _wbsId_initializers, _wbsId_extraInitializers);
            __esDecorate(null, null, _costDate_decorators, { kind: "field", name: "costDate", static: false, private: false, access: { has: obj => "costDate" in obj, get: obj => obj.costDate, set: (obj, value) => { obj.costDate = value; } }, metadata: _metadata }, _costDate_initializers, _costDate_extraInitializers);
            __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _costCategory_decorators, { kind: "field", name: "costCategory", static: false, private: false, access: { has: obj => "costCategory" in obj, get: obj => obj.costCategory, set: (obj, value) => { obj.costCategory = value; } }, metadata: _metadata }, _costCategory_initializers, _costCategory_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitOfMeasure_decorators, { kind: "field", name: "unitOfMeasure", static: false, private: false, access: { has: obj => "unitOfMeasure" in obj, get: obj => obj.unitOfMeasure, set: (obj, value) => { obj.unitOfMeasure = value; } }, metadata: _metadata }, _unitOfMeasure_initializers, _unitOfMeasure_extraInitializers);
            __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: obj => "unitCost" in obj, get: obj => obj.unitCost, set: (obj, value) => { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isBillable_decorators, { kind: "field", name: "isBillable", static: false, private: false, access: { has: obj => "isBillable" in obj, get: obj => obj.isBillable, set: (obj, value) => { obj.isBillable = value; } }, metadata: _metadata }, _isBillable_initializers, _isBillable_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordProjectCostDto = RecordProjectCostDto;
let CreateBillingScheduleDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _billingType_decorators;
    let _billingType_initializers = [];
    let _billingType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledAmount_decorators;
    let _scheduledAmount_initializers = [];
    let _scheduledAmount_extraInitializers = [];
    let _retainagePercent_decorators;
    let _retainagePercent_initializers = [];
    let _retainagePercent_extraInitializers = [];
    return _a = class CreateBillingScheduleDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.billingType = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _billingType_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _billingType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.scheduledAmount = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledAmount_initializers, void 0));
                this.retainagePercent = (__runInitializers(this, _scheduledAmount_extraInitializers), __runInitializers(this, _retainagePercent_initializers, void 0));
                __runInitializers(this, _retainagePercent_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' })];
            _billingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing type', enum: ['time-material', 'fixed-price', 'milestone', 'cost-plus', 'progress'] })];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' })];
            _scheduledAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled amount' })];
            _retainagePercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retainage percent', default: 0 })];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _billingType_decorators, { kind: "field", name: "billingType", static: false, private: false, access: { has: obj => "billingType" in obj, get: obj => obj.billingType, set: (obj, value) => { obj.billingType = value; } }, metadata: _metadata }, _billingType_initializers, _billingType_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _scheduledAmount_decorators, { kind: "field", name: "scheduledAmount", static: false, private: false, access: { has: obj => "scheduledAmount" in obj, get: obj => obj.scheduledAmount, set: (obj, value) => { obj.scheduledAmount = value; } }, metadata: _metadata }, _scheduledAmount_initializers, _scheduledAmount_extraInitializers);
            __esDecorate(null, null, _retainagePercent_decorators, { kind: "field", name: "retainagePercent", static: false, private: false, access: { has: obj => "retainagePercent" in obj, get: obj => obj.retainagePercent, set: (obj, value) => { obj.retainagePercent = value; } }, metadata: _metadata }, _retainagePercent_initializers, _retainagePercent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBillingScheduleDto = CreateBillingScheduleDto;
let EarnedValueCalculationDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _wbsId_decorators;
    let _wbsId_initializers = [];
    let _wbsId_extraInitializers = [];
    let _measurementDate_decorators;
    let _measurementDate_initializers = [];
    let _measurementDate_extraInitializers = [];
    let _calculationMethod_decorators;
    let _calculationMethod_initializers = [];
    let _calculationMethod_extraInitializers = [];
    return _a = class EarnedValueCalculationDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.wbsId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _wbsId_initializers, void 0));
                this.measurementDate = (__runInitializers(this, _wbsId_extraInitializers), __runInitializers(this, _measurementDate_initializers, void 0));
                this.calculationMethod = (__runInitializers(this, _measurementDate_extraInitializers), __runInitializers(this, _calculationMethod_initializers, void 0));
                __runInitializers(this, _calculationMethod_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' })];
            _wbsId_decorators = [(0, swagger_1.ApiProperty)({ description: 'WBS ID', required: false })];
            _measurementDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement date' })];
            _calculationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation method', enum: ['percent-complete', 'weighted-milestone', 'cost-to-cost'] })];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _wbsId_decorators, { kind: "field", name: "wbsId", static: false, private: false, access: { has: obj => "wbsId" in obj, get: obj => obj.wbsId, set: (obj, value) => { obj.wbsId = value; } }, metadata: _metadata }, _wbsId_initializers, _wbsId_extraInitializers);
            __esDecorate(null, null, _measurementDate_decorators, { kind: "field", name: "measurementDate", static: false, private: false, access: { has: obj => "measurementDate" in obj, get: obj => obj.measurementDate, set: (obj, value) => { obj.measurementDate = value; } }, metadata: _metadata }, _measurementDate_initializers, _measurementDate_extraInitializers);
            __esDecorate(null, null, _calculationMethod_decorators, { kind: "field", name: "calculationMethod", static: false, private: false, access: { has: obj => "calculationMethod" in obj, get: obj => obj.calculationMethod, set: (obj, value) => { obj.calculationMethod = value; } }, metadata: _metadata }, _calculationMethod_initializers, _calculationMethod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EarnedValueCalculationDto = EarnedValueCalculationDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Project Header with comprehensive project tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectHeader model
 *
 * @example
 * ```typescript
 * const Project = createProjectHeaderModel(sequelize);
 * const project = await Project.create({
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   status: 'planning'
 * });
 * ```
 */
const createProjectHeaderModel = (sequelize) => {
    class ProjectHeader extends sequelize_1.Model {
    }
    ProjectHeader.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project identifier',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Project name',
        },
        projectType: {
            type: sequelize_1.DataTypes.ENUM('capital', 'operating', 'research', 'construction', 'maintenance'),
            allowNull: false,
            comment: 'Type of project',
        },
        projectManager: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Project manager user ID',
        },
        customerCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Customer/client code',
        },
        contractNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Contract reference number',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Project start date',
        },
        plannedEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned completion date',
        },
        actualEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled', 'closed'),
            allowNull: false,
            defaultValue: 'planning',
            comment: 'Project status',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        organizationUnit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Organization unit code',
        },
        costCenter: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Cost center code',
        },
        fundingSource: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Funding source code',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total project budget',
        },
        totalActualCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total actual costs',
        },
        totalCommitments: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total commitments',
        },
        totalBilled: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total amount billed',
        },
        totalRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total revenue recognized',
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
            comment: 'User who created the project',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the project',
        },
    }, {
        sequelize,
        tableName: 'project_headers',
        timestamps: true,
        indexes: [
            { fields: ['projectNumber'], unique: true },
            { fields: ['projectType'] },
            { fields: ['status'] },
            { fields: ['projectManager'] },
            { fields: ['fiscalYear'] },
            { fields: ['organizationUnit'] },
            { fields: ['customerCode'] },
        ],
    });
    return ProjectHeader;
};
exports.createProjectHeaderModel = createProjectHeaderModel;
/**
 * Sequelize model for Work Breakdown Structure (WBS) with hierarchical support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkBreakdownStructure model
 *
 * @example
 * ```typescript
 * const WBS = createWorkBreakdownStructureModel(sequelize);
 * const wbs = await WBS.create({
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   budgetAmount: 100000
 * });
 * ```
 */
const createWorkBreakdownStructureModel = (sequelize) => {
    class WorkBreakdownStructure extends sequelize_1.Model {
    }
    WorkBreakdownStructure.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'project_headers',
                key: 'id',
            },
            comment: 'Reference to project',
        },
        wbsCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'WBS code (e.g., 1.2.3)',
        },
        wbsName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'WBS element name',
        },
        wbsLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Hierarchy level',
        },
        parentWbsId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'work_breakdown_structures',
                key: 'id',
            },
            comment: 'Parent WBS element',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed description',
        },
        responsiblePerson: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Person responsible',
        },
        plannedStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned start date',
        },
        plannedEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned end date',
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
        budgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budget amount',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual cost incurred',
        },
        commitments: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Committed amounts',
        },
        percentComplete: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Percent complete',
        },
        isBillable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is billable to customer',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is active',
        },
    }, {
        sequelize,
        tableName: 'work_breakdown_structures',
        timestamps: true,
        indexes: [
            { fields: ['projectId', 'wbsCode'], unique: true },
            { fields: ['projectId'] },
            { fields: ['parentWbsId'] },
            { fields: ['isActive'] },
        ],
    });
    return WorkBreakdownStructure;
};
exports.createWorkBreakdownStructureModel = createWorkBreakdownStructureModel;
// ============================================================================
// PROJECT SETUP & MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new project with comprehensive setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectDto} projectData - Project data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectHeader>} Created project
 *
 * @example
 * ```typescript
 * const project = await createProject(sequelize, {
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction Phase 1',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   startDate: new Date('2024-01-01'),
 *   plannedEndDate: new Date('2024-12-31'),
 *   organizationUnit: 'ORG-100',
 *   costCenter: 'CC-200',
 *   fundingSource: 'FND-300',
 *   totalBudget: 1000000
 * }, 'admin');
 * ```
 */
const createProject = async (sequelize, projectData, userId, transaction) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    const project = await ProjectHeader.create({
        ...projectData,
        fiscalYear: projectData.startDate.getFullYear(),
        totalActualCost: 0,
        totalCommitments: 0,
        totalBilled: 0,
        totalRevenue: 0,
        status: 'planning',
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return project;
};
exports.createProject = createProject;
/**
 * Updates project header information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Partial<ProjectHeader>} updates - Fields to update
 * @param {string} userId - User updating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProject(sequelize, 1, {
 *   projectManager: 'jane.smith',
 *   status: 'active'
 * }, 'admin');
 * ```
 */
const updateProject = async (sequelize, projectId, updates, userId, transaction) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    await ProjectHeader.update({
        ...updates,
        updatedBy: userId,
    }, {
        where: { id: projectId },
        transaction,
    });
};
exports.updateProject = updateProject;
/**
 * Retrieves project details with aggregated financial information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectHeader>} Project details
 *
 * @example
 * ```typescript
 * const project = await getProjectDetails(sequelize, 1);
 * console.log(`Budget: ${project.totalBudget}, Actual: ${project.totalActualCost}`);
 * ```
 */
const getProjectDetails = async (sequelize, projectId) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    const project = await ProjectHeader.findByPk(projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    return project;
};
exports.getProjectDetails = getProjectDetails;
/**
 * Closes a project and performs final cost reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} userId - User closing the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await closeProject(sequelize, 1, 'manager');
 * ```
 */
const closeProject = async (sequelize, projectId, userId, transaction) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    const project = await ProjectHeader.findByPk(projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    if (project.status !== 'completed') {
        throw new Error('Only completed projects can be closed');
    }
    await ProjectHeader.update({
        status: 'closed',
        actualEndDate: new Date(),
        updatedBy: userId,
    }, {
        where: { id: projectId },
        transaction,
    });
};
exports.closeProject = closeProject;
// ============================================================================
// WORK BREAKDOWN STRUCTURE (WBS) FUNCTIONS
// ============================================================================
/**
 * Creates a WBS element in the project hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWBSDto} wbsData - WBS data
 * @param {string} userId - User creating the WBS
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkBreakdownStructure>} Created WBS element
 *
 * @example
 * ```typescript
 * const wbs = await createWBSElement(sequelize, {
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   description: 'Prepare construction site',
 *   responsiblePerson: 'john.doe',
 *   budgetAmount: 100000
 * }, 'admin');
 * ```
 */
const createWBSElement = async (sequelize, wbsData, userId, transaction) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    const project = await ProjectHeader.findByPk(wbsData.projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    const wbs = await WBS.create({
        ...wbsData,
        plannedStartDate: project.startDate,
        plannedEndDate: project.plannedEndDate,
        actualCost: 0,
        commitments: 0,
        percentComplete: 0,
        isBillable: wbsData.isBillable ?? true,
        isActive: true,
    }, { transaction });
    return wbs;
};
exports.createWBSElement = createWBSElement;
/**
 * Retrieves WBS hierarchy for a project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<WorkBreakdownStructure[]>} WBS hierarchy
 *
 * @example
 * ```typescript
 * const wbsHierarchy = await getWBSHierarchy(sequelize, 1);
 * wbsHierarchy.forEach(wbs => console.log(`${wbs.wbsCode}: ${wbs.wbsName}`));
 * ```
 */
const getWBSHierarchy = async (sequelize, projectId) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    const wbsElements = await WBS.findAll({
        where: { projectId, isActive: true },
        order: [['wbsCode', 'ASC']],
    });
    return wbsElements;
};
exports.getWBSHierarchy = getWBSHierarchy;
/**
 * Updates WBS element details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {Partial<WorkBreakdownStructure>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateWBSElement(sequelize, 1, {
 *   percentComplete: 75,
 *   actualCost: 75000
 * });
 * ```
 */
const updateWBSElement = async (sequelize, wbsId, updates, transaction) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    await WBS.update(updates, {
        where: { id: wbsId },
        transaction,
    });
};
exports.updateWBSElement = updateWBSElement;
/**
 * Calculates rollup budget and costs for WBS hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalBudget: number; totalCost: number; totalCommitments: number }>} Rollup totals
 *
 * @example
 * ```typescript
 * const rollup = await calculateWBSRollup(sequelize, 1);
 * console.log(`Total Budget: ${rollup.totalBudget}`);
 * ```
 */
const calculateWBSRollup = async (sequelize, projectId) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    const wbsElements = await WBS.findAll({
        where: { projectId, isActive: true },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
            [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalCost'],
            [sequelize.fn('SUM', sequelize.col('commitments')), 'totalCommitments'],
        ],
    });
    const result = wbsElements[0];
    return {
        totalBudget: Number(result.get('totalBudget') || 0),
        totalCost: Number(result.get('totalCost') || 0),
        totalCommitments: Number(result.get('totalCommitments') || 0),
    };
};
exports.calculateWBSRollup = calculateWBSRollup;
// ============================================================================
// PROJECT BUDGET FUNCTIONS
// ============================================================================
/**
 * Creates project budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBudget>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createProjectBudget(sequelize, {
 *   projectId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   budgetType: 'original',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   budgetAmount: 500000
 * }, 'admin');
 * ```
 */
const createProjectBudget = async (sequelize, budgetData, userId, transaction) => {
    const budget = await sequelize.models.ProjectBudget?.create({
        ...budgetData,
        committedAmount: 0,
        actualAmount: 0,
        varianceAmount: 0,
        variancePercent: 0,
        effectiveDate: new Date(),
        createdBy: userId,
    }, { transaction });
    return budget;
};
exports.createProjectBudget = createProjectBudget;
/**
 * Updates project budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} budgetAmount - New budget amount
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProjectBudget(sequelize, 1, 550000, 'manager');
 * ```
 */
const updateProjectBudget = async (sequelize, budgetId, budgetAmount, userId, transaction) => {
    await sequelize.models.ProjectBudget?.update({
        budgetAmount,
        updatedBy: userId,
    }, {
        where: { id: budgetId },
        transaction,
    });
};
exports.updateProjectBudget = updateProjectBudget;
/**
 * Retrieves project budget vs actual comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<ProjectBudget[]>} Budget comparison
 *
 * @example
 * ```typescript
 * const budgetVsActual = await getProjectBudgetVsActual(sequelize, 1, 2024, 1);
 * budgetVsActual.forEach(b => console.log(`${b.costCategory}: ${b.varianceAmount}`));
 * ```
 */
const getProjectBudgetVsActual = async (sequelize, projectId, fiscalYear, fiscalPeriod) => {
    const budgets = await sequelize.models.ProjectBudget?.findAll({
        where: {
            projectId,
            fiscalYear,
            fiscalPeriod,
        },
        order: [['costCategory', 'ASC']],
    });
    return budgets || [];
};
exports.getProjectBudgetVsActual = getProjectBudgetVsActual;
/**
 * Calculates budget variance at project or WBS level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} [wbsId] - Optional WBS ID
 * @returns {Promise<{ budgetAmount: number; actualAmount: number; variance: number; variancePercent: number }>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance(sequelize, 1);
 * console.log(`Variance: ${variance.variancePercent}%`);
 * ```
 */
const calculateBudgetVariance = async (sequelize, projectId, wbsId) => {
    const whereClause = { projectId };
    if (wbsId) {
        whereClause.wbsId = wbsId;
    }
    const budgets = await sequelize.models.ProjectBudget?.findAll({
        where: whereClause,
        attributes: [
            [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
            [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
        ],
    });
    const result = budgets?.[0];
    const budgetAmount = Number(result?.get('totalBudget') || 0);
    const actualAmount = Number(result?.get('totalActual') || 0);
    const variance = budgetAmount - actualAmount;
    const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;
    return { budgetAmount, actualAmount, variance, variancePercent };
};
exports.calculateBudgetVariance = calculateBudgetVariance;
// ============================================================================
// PROJECT COSTING FUNCTIONS
// ============================================================================
/**
 * Records project cost transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordProjectCostDto} costData - Cost data
 * @param {string} userId - User recording the cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCostDetail>} Recorded cost
 *
 * @example
 * ```typescript
 * const cost = await recordProjectCost(sequelize, {
 *   projectId: 1,
 *   wbsId: 5,
 *   costDate: new Date(),
 *   transactionType: 'labor',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   quantity: 40,
 *   unitOfMeasure: 'hours',
 *   unitCost: 75,
 *   description: 'Engineering hours'
 * }, 'admin');
 * ```
 */
const recordProjectCost = async (sequelize, costData, userId, transaction) => {
    const totalCost = costData.quantity * costData.unitCost;
    const cost = await sequelize.models.ProjectCostDetail?.create({
        ...costData,
        totalCost,
        fiscalYear: costData.costDate.getFullYear(),
        fiscalPeriod: costData.costDate.getMonth() + 1,
        isBillable: costData.isBillable ?? true,
        isBilled: false,
        createdBy: userId,
    }, { transaction });
    // Update WBS actual cost
    if (costData.wbsId) {
        await updateWBSActualCost(sequelize, costData.wbsId, totalCost, transaction);
    }
    // Update project actual cost
    await updateProjectActualCost(sequelize, costData.projectId, totalCost, transaction);
    return cost;
};
exports.recordProjectCost = recordProjectCost;
/**
 * Updates WBS actual cost totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {number} costAmount - Cost amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateWBSActualCost = async (sequelize, wbsId, costAmount, transaction) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    await WBS.increment('actualCost', {
        by: costAmount,
        where: { id: wbsId },
        transaction,
    });
};
/**
 * Updates project actual cost totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} costAmount - Cost amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateProjectActualCost = async (sequelize, projectId, costAmount, transaction) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    await ProjectHeader.increment('totalActualCost', {
        by: costAmount,
        where: { id: projectId },
        transaction,
    });
};
/**
 * Retrieves project costs by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ category: string; totalCost: number }[]>} Costs by category
 *
 * @example
 * ```typescript
 * const costs = await getProjectCostsByCategory(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * costs.forEach(c => console.log(`${c.category}: ${c.totalCost}`));
 * ```
 */
const getProjectCostsByCategory = async (sequelize, projectId, startDate, endDate) => {
    const costs = await sequelize.models.ProjectCostDetail?.findAll({
        where: {
            projectId,
            costDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            'costCategory',
            [sequelize.fn('SUM', sequelize.col('totalCost')), 'totalCost'],
        ],
        group: ['costCategory'],
        order: [[sequelize.fn('SUM', sequelize.col('totalCost')), 'DESC']],
    });
    return (costs || []).map((c) => ({
        category: c.costCategory,
        totalCost: Number(c.get('totalCost')),
    }));
};
exports.getProjectCostsByCategory = getProjectCostsByCategory;
/**
 * Retrieves project costs by WBS element.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ wbsCode: string; wbsName: string; totalCost: number }[]>} Costs by WBS
 *
 * @example
 * ```typescript
 * const wbsCosts = await getProjectCostsByWBS(sequelize, 1);
 * wbsCosts.forEach(w => console.log(`${w.wbsCode}: ${w.totalCost}`));
 * ```
 */
const getProjectCostsByWBS = async (sequelize, projectId) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    const wbsElements = await WBS.findAll({
        where: { projectId, isActive: true },
        attributes: ['wbsCode', 'wbsName', 'actualCost'],
        order: [['wbsCode', 'ASC']],
    });
    return wbsElements.map(w => ({
        wbsCode: w.wbsCode,
        wbsName: w.wbsName,
        totalCost: Number(w.actualCost),
    }));
};
exports.getProjectCostsByWBS = getProjectCostsByWBS;
// ============================================================================
// COMMITMENT TRACKING FUNCTIONS
// ============================================================================
/**
 * Creates project commitment (PO, contract, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectCommitment>} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCommitment>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createProjectCommitment(sequelize, {
 *   projectId: 1,
 *   commitmentType: 'purchase-order',
 *   commitmentNumber: 'PO-2024-001',
 *   commitmentDate: new Date(),
 *   vendorCode: 'VEND-100',
 *   vendorName: 'ABC Suppliers',
 *   description: 'Construction materials',
 *   originalAmount: 50000
 * }, 'admin');
 * ```
 */
const createProjectCommitment = async (sequelize, commitmentData, userId, transaction) => {
    const commitment = await sequelize.models.ProjectCommitment?.create({
        ...commitmentData,
        committedAmount: commitmentData.originalAmount,
        receivedAmount: 0,
        invoicedAmount: 0,
        paidAmount: 0,
        remainingAmount: commitmentData.originalAmount,
        status: 'open',
        createdBy: userId,
    }, { transaction });
    // Update WBS commitments
    if (commitmentData.wbsId) {
        await updateWBSCommitments(sequelize, commitmentData.wbsId, commitmentData.originalAmount, transaction);
    }
    // Update project commitments
    await updateProjectCommitments(sequelize, commitmentData.projectId, commitmentData.originalAmount, transaction);
    return commitment;
};
exports.createProjectCommitment = createProjectCommitment;
/**
 * Updates WBS commitment totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {number} commitmentAmount - Commitment amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateWBSCommitments = async (sequelize, wbsId, commitmentAmount, transaction) => {
    const WBS = (0, exports.createWorkBreakdownStructureModel)(sequelize);
    await WBS.increment('commitments', {
        by: commitmentAmount,
        where: { id: wbsId },
        transaction,
    });
};
/**
 * Updates project commitment totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} commitmentAmount - Commitment amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateProjectCommitments = async (sequelize, projectId, commitmentAmount, transaction) => {
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    await ProjectHeader.increment('totalCommitments', {
        by: commitmentAmount,
        where: { id: projectId },
        transaction,
    });
};
/**
 * Updates commitment status and amounts (receiving, invoicing, payment).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<ProjectCommitment>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCommitmentStatus(sequelize, 1, {
 *   receivedAmount: 25000,
 *   status: 'partial'
 * });
 * ```
 */
const updateCommitmentStatus = async (sequelize, commitmentId, updates, transaction) => {
    await sequelize.models.ProjectCommitment?.update(updates, {
        where: { id: commitmentId },
        transaction,
    });
};
exports.updateCommitmentStatus = updateCommitmentStatus;
/**
 * Retrieves open commitments for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectCommitment[]>} Open commitments
 *
 * @example
 * ```typescript
 * const openCommitments = await getOpenCommitments(sequelize, 1);
 * console.log(`Open commitments: ${openCommitments.length}`);
 * ```
 */
const getOpenCommitments = async (sequelize, projectId) => {
    const commitments = await sequelize.models.ProjectCommitment?.findAll({
        where: {
            projectId,
            status: {
                [sequelize_1.Op.in]: ['open', 'partial'],
            },
        },
        order: [['commitmentDate', 'ASC']],
    });
    return commitments || [];
};
exports.getOpenCommitments = getOpenCommitments;
/**
 * Calculates total committed amounts by project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalCommitted: number; totalReceived: number; totalRemaining: number }>} Commitment totals
 *
 * @example
 * ```typescript
 * const commitmentTotals = await calculateCommitmentTotals(sequelize, 1);
 * console.log(`Total Committed: ${commitmentTotals.totalCommitted}`);
 * ```
 */
const calculateCommitmentTotals = async (sequelize, projectId) => {
    const commitments = await sequelize.models.ProjectCommitment?.findAll({
        where: { projectId },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted'],
            [sequelize.fn('SUM', sequelize.col('receivedAmount')), 'totalReceived'],
            [sequelize.fn('SUM', sequelize.col('remainingAmount')), 'totalRemaining'],
        ],
    });
    const result = commitments?.[0];
    return {
        totalCommitted: Number(result?.get('totalCommitted') || 0),
        totalReceived: Number(result?.get('totalReceived') || 0),
        totalRemaining: Number(result?.get('totalRemaining') || 0),
    };
};
exports.calculateCommitmentTotals = calculateCommitmentTotals;
// ============================================================================
// EARNED VALUE MANAGEMENT (EVM) FUNCTIONS
// ============================================================================
/**
 * Calculates earned value metrics for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueCalculationDto} evmData - EVM calculation data
 * @returns {Promise<EarnedValueMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValue(sequelize, {
 *   projectId: 1,
 *   measurementDate: new Date(),
 *   calculationMethod: 'percent-complete'
 * });
 * console.log(`CPI: ${evm.costPerformanceIndex}, SPI: ${evm.schedulePerformanceIndex}`);
 * ```
 */
const calculateEarnedValue = async (sequelize, evmData) => {
    const project = await (0, exports.getProjectDetails)(sequelize, evmData.projectId);
    const budgetAtCompletion = Number(project.totalBudget);
    const actualCost = Number(project.totalActualCost);
    // For simplicity, calculate based on percent complete
    const percentComplete = 0; // This would be calculated based on actual WBS completion
    const earnedValue = budgetAtCompletion * (percentComplete / 100);
    const plannedValue = budgetAtCompletion * (percentComplete / 100); // Simplified
    const costVariance = earnedValue - actualCost;
    const scheduleVariance = earnedValue - plannedValue;
    const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;
    const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;
    const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);
    return {
        projectId: evmData.projectId,
        wbsId: evmData.wbsId,
        measurementDate: evmData.measurementDate,
        fiscalYear: evmData.measurementDate.getFullYear(),
        fiscalPeriod: evmData.measurementDate.getMonth() + 1,
        plannedValue,
        earnedValue,
        actualCost,
        budgetAtCompletion,
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        costVariance,
        scheduleVariance,
        costPerformanceIndex,
        schedulePerformanceIndex,
        toCompletePerformanceIndex,
        percentComplete,
        percentScheduleComplete: percentComplete,
    };
};
exports.calculateEarnedValue = calculateEarnedValue;
/**
 * Stores earned value metrics snapshot.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueMetrics} evmMetrics - EVM metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await storeEarnedValueMetrics(sequelize, evmMetrics);
 * ```
 */
const storeEarnedValueMetrics = async (sequelize, evmMetrics, transaction) => {
    await sequelize.models.EarnedValueMetrics?.create(evmMetrics, { transaction });
};
exports.storeEarnedValueMetrics = storeEarnedValueMetrics;
/**
 * Retrieves earned value trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<EarnedValueMetrics[]>} EVM trend data
 *
 * @example
 * ```typescript
 * const evmTrend = await getEarnedValueTrend(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * evmTrend.forEach(e => console.log(`${e.measurementDate}: CPI=${e.costPerformanceIndex}`));
 * ```
 */
const getEarnedValueTrend = async (sequelize, projectId, startDate, endDate) => {
    const metrics = await sequelize.models.EarnedValueMetrics?.findAll({
        where: {
            projectId,
            measurementDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['measurementDate', 'ASC']],
    });
    return metrics || [];
};
exports.getEarnedValueTrend = getEarnedValueTrend;
/**
 * Calculates cost performance index (CPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} CPI value
 *
 * @example
 * ```typescript
 * const cpi = await calculateCPI(sequelize, 1);
 * console.log(`CPI: ${cpi} - ${cpi >= 1 ? 'Under budget' : 'Over budget'}`);
 * ```
 */
const calculateCPI = async (sequelize, projectId) => {
    const evm = await (0, exports.calculateEarnedValue)(sequelize, {
        projectId,
        measurementDate: new Date(),
        calculationMethod: 'percent-complete',
    });
    return evm.costPerformanceIndex;
};
exports.calculateCPI = calculateCPI;
/**
 * Calculates schedule performance index (SPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} SPI value
 *
 * @example
 * ```typescript
 * const spi = await calculateSPI(sequelize, 1);
 * console.log(`SPI: ${spi} - ${spi >= 1 ? 'Ahead of schedule' : 'Behind schedule'}`);
 * ```
 */
const calculateSPI = async (sequelize, projectId) => {
    const evm = await (0, exports.calculateEarnedValue)(sequelize, {
        projectId,
        measurementDate: new Date(),
        calculationMethod: 'percent-complete',
    });
    return evm.schedulePerformanceIndex;
};
exports.calculateSPI = calculateSPI;
// ============================================================================
// PROJECT BILLING FUNCTIONS
// ============================================================================
/**
 * Creates project billing schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBillingScheduleDto} billingData - Billing schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBillingSchedule>} Created billing schedule
 *
 * @example
 * ```typescript
 * const billing = await createBillingSchedule(sequelize, {
 *   projectId: 1,
 *   billingType: 'milestone',
 *   scheduledDate: new Date('2024-06-30'),
 *   scheduledAmount: 250000,
 *   retainagePercent: 10
 * }, 'admin');
 * ```
 */
const createBillingSchedule = async (sequelize, billingData, userId, transaction) => {
    const scheduleNumber = `BILL-${billingData.projectId}-${Date.now()}`;
    const retainageAmount = billingData.scheduledAmount * ((billingData.retainagePercent || 0) / 100);
    const billing = await sequelize.models.ProjectBillingSchedule?.create({
        ...billingData,
        scheduleNumber,
        billedAmount: 0,
        unbilledAmount: billingData.scheduledAmount,
        billingPercent: 0,
        retainageAmount,
        status: 'pending',
        createdBy: userId,
    }, { transaction });
    return billing;
};
exports.createBillingSchedule = createBillingSchedule;
/**
 * Processes project billing and creates invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Billing schedule ID
 * @param {number} billingAmount - Amount to bill
 * @param {string} userId - User processing the billing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processBilling(sequelize, 1, 225000, 'admin');
 * ```
 */
const processBilling = async (sequelize, scheduleId, billingAmount, userId, transaction) => {
    const billing = await sequelize.models.ProjectBillingSchedule?.findByPk(scheduleId);
    if (!billing) {
        throw new Error('Billing schedule not found');
    }
    const invoiceNumber = `INV-${billing.projectId}-${Date.now()}`;
    await sequelize.models.ProjectBillingSchedule?.update({
        billedAmount: billingAmount,
        unbilledAmount: billing.scheduledAmount - billingAmount,
        status: 'billed',
        invoiceNumber,
        invoiceDate: new Date(),
        updatedBy: userId,
    }, {
        where: { id: scheduleId },
        transaction,
    });
    // Update project total billed
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    await ProjectHeader.increment('totalBilled', {
        by: billingAmount,
        where: { id: billing.projectId },
        transaction,
    });
};
exports.processBilling = processBilling;
/**
 * Retrieves unbilled project costs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalUnbilled: number; costs: ProjectCostDetail[] }>} Unbilled costs
 *
 * @example
 * ```typescript
 * const unbilled = await getUnbilledCosts(sequelize, 1);
 * console.log(`Unbilled amount: ${unbilled.totalUnbilled}`);
 * ```
 */
const getUnbilledCosts = async (sequelize, projectId) => {
    const costs = await sequelize.models.ProjectCostDetail?.findAll({
        where: {
            projectId,
            isBillable: true,
            isBilled: false,
        },
        order: [['costDate', 'ASC']],
    });
    const totalUnbilled = (costs || []).reduce((sum, cost) => sum + Number(cost.totalCost), 0);
    return {
        totalUnbilled,
        costs: costs || [],
    };
};
exports.getUnbilledCosts = getUnbilledCosts;
/**
 * Calculates billing completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Billing completion percent
 *
 * @example
 * ```typescript
 * const billingPercent = await calculateBillingCompletion(sequelize, 1);
 * console.log(`Billing ${billingPercent}% complete`);
 * ```
 */
const calculateBillingCompletion = async (sequelize, projectId) => {
    const project = await (0, exports.getProjectDetails)(sequelize, projectId);
    const totalBudget = Number(project.totalBudget);
    const totalBilled = Number(project.totalBilled);
    return totalBudget > 0 ? (totalBilled / totalBudget) * 100 : 0;
};
exports.calculateBillingCompletion = calculateBillingCompletion;
// ============================================================================
// REVENUE RECOGNITION FUNCTIONS
// ============================================================================
/**
 * Calculates and records revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} recognitionMethod - Recognition method
 * @param {string} userId - User recording revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectRevenueRecognition>} Revenue recognition record
 *
 * @example
 * ```typescript
 * const revenue = await calculateRevenueRecognition(sequelize, 1, new Date(), 'percentage-completion', 'admin');
 * console.log(`Current period revenue: ${revenue.currentPeriodRevenue}`);
 * ```
 */
const calculateRevenueRecognition = async (sequelize, projectId, recognitionDate, recognitionMethod, userId, transaction) => {
    const project = await (0, exports.getProjectDetails)(sequelize, projectId);
    const totalContractAmount = Number(project.totalBudget);
    const costsIncurred = Number(project.totalActualCost);
    const estimatedTotalCost = totalContractAmount; // Simplified
    const percentComplete = estimatedTotalCost > 0 ? (costsIncurred / estimatedTotalCost) * 100 : 0;
    const revenueToDate = totalContractAmount * (percentComplete / 100);
    // Get previous revenue recognized
    const previousRevenue = await sequelize.models.ProjectRevenueRecognition?.findOne({
        where: { projectId },
        order: [['recognitionDate', 'DESC']],
    });
    const previousRevenueToDate = previousRevenue ? Number(previousRevenue.revenueToDate) : 0;
    const currentPeriodRevenue = revenueToDate - previousRevenueToDate;
    const billedToDate = Number(project.totalBilled);
    const unbilledRevenue = revenueToDate - billedToDate;
    const revenue = await sequelize.models.ProjectRevenueRecognition?.create({
        projectId,
        fiscalYear: recognitionDate.getFullYear(),
        fiscalPeriod: recognitionDate.getMonth() + 1,
        recognitionDate,
        recognitionMethod,
        totalContractAmount,
        costsIncurred,
        estimatedTotalCost,
        percentComplete,
        revenueToDate,
        currentPeriodRevenue,
        billedToDate,
        unbilledRevenue,
        deferredRevenue: 0,
        createdBy: userId,
    }, { transaction });
    // Update project total revenue
    const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
    await ProjectHeader.update({ totalRevenue: revenueToDate }, { where: { id: projectId }, transaction });
    return revenue;
};
exports.calculateRevenueRecognition = calculateRevenueRecognition;
/**
 * Retrieves revenue recognition history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectRevenueRecognition[]>} Revenue history
 *
 * @example
 * ```typescript
 * const revenueHistory = await getRevenueRecognitionHistory(sequelize, 1);
 * revenueHistory.forEach(r => console.log(`${r.recognitionDate}: ${r.currentPeriodRevenue}`));
 * ```
 */
const getRevenueRecognitionHistory = async (sequelize, projectId) => {
    const revenue = await sequelize.models.ProjectRevenueRecognition?.findAll({
        where: { projectId },
        order: [['recognitionDate', 'ASC']],
    });
    return revenue || [];
};
exports.getRevenueRecognitionHistory = getRevenueRecognitionHistory;
// ============================================================================
// PROJECT FORECASTING FUNCTIONS
// ============================================================================
/**
 * Creates project cost forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectForecast>} forecastData - Forecast data
 * @param {string} userId - User creating forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectForecast>} Created forecast
 *
 * @example
 * ```typescript
 * const forecast = await createProjectForecast(sequelize, {
 *   projectId: 1,
 *   forecastDate: new Date(),
 *   costCategory: 'Labor',
 *   originalBudget: 500000,
 *   actualToDate: 300000,
 *   forecastToComplete: 250000,
 *   forecastMethod: 'trend'
 * }, 'manager');
 * ```
 */
const createProjectForecast = async (sequelize, forecastData, userId, transaction) => {
    const estimateAtCompletion = (forecastData.actualToDate || 0) + (forecastData.forecastToComplete || 0);
    const varianceAtCompletion = (forecastData.originalBudget || 0) - estimateAtCompletion;
    const forecast = await sequelize.models.ProjectForecast?.create({
        ...forecastData,
        estimateAtCompletion,
        varianceAtCompletion,
        forecastBy: userId,
        createdBy: userId,
    }, { transaction });
    return forecast;
};
exports.createProjectForecast = createProjectForecast;
/**
 * Calculates estimate at completion (EAC) using EVM.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate at completion
 *
 * @example
 * ```typescript
 * const eac = await calculateEstimateAtCompletion(sequelize, 1);
 * console.log(`Estimate at Completion: ${eac}`);
 * ```
 */
const calculateEstimateAtCompletion = async (sequelize, projectId) => {
    const evm = await (0, exports.calculateEarnedValue)(sequelize, {
        projectId,
        measurementDate: new Date(),
        calculationMethod: 'percent-complete',
    });
    return evm.estimateAtCompletion;
};
exports.calculateEstimateAtCompletion = calculateEstimateAtCompletion;
/**
 * Calculates estimate to complete (ETC).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate to complete
 *
 * @example
 * ```typescript
 * const etc = await calculateEstimateToComplete(sequelize, 1);
 * console.log(`Estimate to Complete: ${etc}`);
 * ```
 */
const calculateEstimateToComplete = async (sequelize, projectId) => {
    const evm = await (0, exports.calculateEarnedValue)(sequelize, {
        projectId,
        measurementDate: new Date(),
        calculationMethod: 'percent-complete',
    });
    return evm.estimateToComplete;
};
exports.calculateEstimateToComplete = calculateEstimateToComplete;
/**
 * Generates project forecast report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectForecast[]>} Forecast report
 *
 * @example
 * ```typescript
 * const forecastReport = await generateForecastReport(sequelize, 1);
 * forecastReport.forEach(f => console.log(`${f.costCategory}: EAC ${f.estimateAtCompletion}`));
 * ```
 */
const generateForecastReport = async (sequelize, projectId) => {
    const forecasts = await sequelize.models.ProjectForecast?.findAll({
        where: { projectId },
        order: [['forecastDate', 'DESC'], ['costCategory', 'ASC']],
    });
    return forecasts || [];
};
exports.generateForecastReport = generateForecastReport;
// ============================================================================
// PROJECT ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates comprehensive project analytics dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectAnalytics>} Analytics dashboard data
 *
 * @example
 * ```typescript
 * const analytics = await generateProjectAnalytics(sequelize, 1);
 * console.log(`Average CPI: ${analytics.averageCPI}`);
 * ```
 */
const generateProjectAnalytics = async (sequelize, projectId) => {
    const project = await (0, exports.getProjectDetails)(sequelize, projectId);
    return {
        projectId,
        analysisDate: new Date(),
        totalProjects: 1,
        activeProjects: project.status === 'active' ? 1 : 0,
        completedProjects: project.status === 'completed' ? 1 : 0,
        totalBudget: Number(project.totalBudget),
        totalActualCost: Number(project.totalActualCost),
        totalCommitments: Number(project.totalCommitments),
        totalVariance: Number(project.totalBudget) - Number(project.totalActualCost),
        averageCostVariance: 0,
        averageScheduleVariance: 0,
        averageCPI: 1.0,
        averageSPI: 1.0,
        onBudgetCount: 0,
        overBudgetCount: 0,
        underBudgetCount: 0,
        onScheduleCount: 0,
        behindScheduleCount: 0,
        aheadScheduleCount: 0,
    };
};
exports.generateProjectAnalytics = generateProjectAnalytics;
/**
 * Calculates project profitability metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ revenue: number; cost: number; profit: number; margin: number }>} Profitability metrics
 *
 * @example
 * ```typescript
 * const profitability = await calculateProjectProfitability(sequelize, 1);
 * console.log(`Profit Margin: ${profitability.margin}%`);
 * ```
 */
const calculateProjectProfitability = async (sequelize, projectId) => {
    const project = await (0, exports.getProjectDetails)(sequelize, projectId);
    const revenue = Number(project.totalRevenue);
    const cost = Number(project.totalActualCost);
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, cost, profit, margin };
};
exports.calculateProjectProfitability = calculateProjectProfitability;
/**
 * Generates project performance scorecard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ budgetScore: string; scheduleScore: string; qualityScore: string; overallScore: string }>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateProjectScorecard(sequelize, 1);
 * console.log(`Overall Score: ${scorecard.overallScore}`);
 * ```
 */
const generateProjectScorecard = async (sequelize, projectId) => {
    const cpi = await (0, exports.calculateCPI)(sequelize, projectId);
    const spi = await (0, exports.calculateSPI)(sequelize, projectId);
    const budgetScore = cpi >= 1.0 ? 'Green' : cpi >= 0.9 ? 'Yellow' : 'Red';
    const scheduleScore = spi >= 1.0 ? 'Green' : spi >= 0.9 ? 'Yellow' : 'Red';
    const qualityScore = 'Green'; // Simplified
    const overallScore = budgetScore === 'Green' && scheduleScore === 'Green' ? 'Green' :
        budgetScore === 'Red' || scheduleScore === 'Red' ? 'Red' : 'Yellow';
    return { budgetScore, scheduleScore, qualityScore, overallScore };
};
exports.generateProjectScorecard = generateProjectScorecard;
// ============================================================================
// COST-TO-COMPLETE FUNCTIONS
// ============================================================================
/**
 * Calculates detailed cost-to-complete analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} costCategory - Cost category
 * @returns {Promise<CostToComplete>} Cost-to-complete analysis
 *
 * @example
 * ```typescript
 * const ctc = await calculateCostToComplete(sequelize, 1, 'Labor');
 * console.log(`Estimate to Complete: ${ctc.estimateToComplete}`);
 * ```
 */
const calculateCostToComplete = async (sequelize, projectId, costCategory) => {
    const budgets = await sequelize.models.ProjectBudget?.findAll({
        where: { projectId, costCategory },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
            [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
            [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted'],
        ],
    });
    const result = budgets?.[0];
    const budgetAmount = Number(result?.get('totalBudget') || 0);
    const actualToDate = Number(result?.get('totalActual') || 0);
    const commitmentsToDate = Number(result?.get('totalCommitted') || 0);
    const percentComplete = budgetAmount > 0 ? (actualToDate / budgetAmount) * 100 : 0;
    const estimateToComplete = budgetAmount - actualToDate;
    const estimateAtCompletion = actualToDate + estimateToComplete;
    const varianceAtCompletion = budgetAmount - estimateAtCompletion;
    return {
        projectId,
        analysisDate: new Date(),
        costCategory,
        budgetAmount,
        actualToDate,
        commitmentsToDate,
        estimateToComplete,
        estimateAtCompletion,
        varianceAtCompletion,
        percentComplete,
        completionMethod: 'budget-percentage',
        riskAdjustment: 0,
        contingency: 0,
        managementReserve: 0,
    };
};
exports.calculateCostToComplete = calculateCostToComplete;
/**
 * Generates cost-to-complete report for all categories.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<CostToComplete[]>} Cost-to-complete report
 *
 * @example
 * ```typescript
 * const ctcReport = await generateCostToCompleteReport(sequelize, 1);
 * ctcReport.forEach(c => console.log(`${c.costCategory}: ${c.estimateToComplete}`));
 * ```
 */
const generateCostToCompleteReport = async (sequelize, projectId) => {
    const categories = await sequelize.models.ProjectBudget?.findAll({
        where: { projectId },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('costCategory')), 'costCategory']],
    });
    const ctcReports = [];
    for (const category of categories || []) {
        const ctc = await (0, exports.calculateCostToComplete)(sequelize, projectId, category.costCategory);
        ctcReports.push(ctc);
    }
    return ctcReports;
};
exports.generateCostToCompleteReport = generateCostToCompleteReport;
// ============================================================================
// CHANGE ORDER MANAGEMENT
// ============================================================================
/**
 * Creates project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectChangeOrder>} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const changeOrder = await createChangeOrder(sequelize, {
 *   projectId: 1,
 *   changeOrderNumber: 'CO-001',
 *   changeType: 'scope',
 *   description: 'Additional site work',
 *   budgetImpact: 50000,
 *   scheduleImpact: 30
 * }, 'manager');
 * ```
 */
const createChangeOrder = async (sequelize, changeOrderData, userId, transaction) => {
    const changeOrder = await sequelize.models.ProjectChangeOrder?.create({
        ...changeOrderData,
        changeOrderDate: new Date(),
        requestedBy: userId,
        status: 'draft',
        createdBy: userId,
    }, { transaction });
    return changeOrder;
};
exports.createChangeOrder = createChangeOrder;
/**
 * Approves and implements project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} changeOrderId - Change order ID
 * @param {string} userId - User approving change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveChangeOrder(sequelize, 1, 'director');
 * ```
 */
const approveChangeOrder = async (sequelize, changeOrderId, userId, transaction) => {
    const changeOrder = await sequelize.models.ProjectChangeOrder?.findByPk(changeOrderId);
    if (!changeOrder) {
        throw new Error('Change order not found');
    }
    await sequelize.models.ProjectChangeOrder?.update({
        status: 'approved',
        approvedBy: userId,
        approvedDate: new Date(),
        implementedDate: new Date(),
    }, {
        where: { id: changeOrderId },
        transaction,
    });
    // Update project budget if budget impact
    if (changeOrder.budgetImpact) {
        const ProjectHeader = (0, exports.createProjectHeaderModel)(sequelize);
        await ProjectHeader.increment('totalBudget', {
            by: changeOrder.budgetImpact,
            where: { id: changeOrder.projectId },
            transaction,
        });
    }
};
exports.approveChangeOrder = approveChangeOrder;
/**
 * Retrieves change orders for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders(sequelize, 1);
 * console.log(`Total change orders: ${changeOrders.length}`);
 * ```
 */
const getProjectChangeOrders = async (sequelize, projectId) => {
    const changeOrders = await sequelize.models.ProjectChangeOrder?.findAll({
        where: { projectId },
        order: [['changeOrderDate', 'DESC']],
    });
    return changeOrders || [];
};
exports.getProjectChangeOrders = getProjectChangeOrders;
//# sourceMappingURL=project-accounting-costing-kit.js.map