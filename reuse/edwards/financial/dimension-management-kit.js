"use strict";
/**
 * LOC: EDWDIM001
 * File: /reuse/edwards/financial/dimension-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/config (Configuration management)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial dimension modules
 *   - Chart of accounts services
 *   - Cost center management services
 *   - Financial reporting modules
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
exports.createLocationModel = exports.createDepartmentModel = exports.createProjectModel = exports.createCostCenterModel = exports.createChartOfAccountsDimensionModel = exports.DimensionHierarchyDto = exports.CreateLocationDto = exports.CreateDepartmentDto = exports.CreateProjectDto = exports.CreateCostCenterDto = exports.CreateChartOfAccountsDto = void 0;
exports.createChartOfAccountsDimension = createChartOfAccountsDimension;
exports.getChartOfAccountsHierarchy = getChartOfAccountsHierarchy;
exports.updateChartOfAccountsDimension = updateChartOfAccountsDimension;
exports.deactivateChartOfAccountsDimension = deactivateChartOfAccountsDimension;
exports.createCostCenter = createCostCenter;
exports.getCostCenterWithBudgetAnalysis = getCostCenterWithBudgetAnalysis;
exports.updateCostCenterActuals = updateCostCenterActuals;
exports.getCostCenterHierarchy = getCostCenterHierarchy;
exports.rollupCostCenterActuals = rollupCostCenterActuals;
exports.createProject = createProject;
exports.updateProjectStatus = updateProjectStatus;
exports.updateProjectCosts = updateProjectCosts;
exports.getActiveProjects = getActiveProjects;
exports.createDepartment = createDepartment;
exports.getDepartmentHierarchy = getDepartmentHierarchy;
exports.createLocation = createLocation;
exports.getLocationsByCountry = getLocationsByCountry;
exports.validateDimensionAccess = validateDimensionAccess;
exports.validateDimensionCombination = validateDimensionCombination;
/**
 * File: /reuse/edwards/financial/dimension-management-kit.ts
 * Locator: WC-EDW-DIM-001
 * Purpose: Comprehensive Financial Dimension Management - JD Edwards EnterpriseOne-level chart of accounts, cost centers, projects, hierarchies
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, ConfigModule
 * Downstream: ../backend/edwards/*, Dimension Services, Financial Reporting, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 38 functions for dimension management, hierarchies, cost centers, projects, departments, locations, custom dimensions, security, reporting
 *
 * LLM Context: Enterprise-grade financial dimension management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive dimension definition, hierarchy management, cost center tracking, project accounting dimensions,
 * department structures, location management, custom dimension support, dimension security, validation, and reporting.
 * Implements robust NestJS ConfigModule integration for environment-based configuration and validation.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateChartOfAccountsDto = (() => {
    var _a;
    let _dimensionCode_decorators;
    let _dimensionCode_initializers = [];
    let _dimensionCode_extraInitializers = [];
    let _dimensionName_decorators;
    let _dimensionName_initializers = [];
    let _dimensionName_extraInitializers = [];
    let _dimensionType_decorators;
    let _dimensionType_initializers = [];
    let _dimensionType_extraInitializers = [];
    let _segmentNumber_decorators;
    let _segmentNumber_initializers = [];
    let _segmentNumber_extraInitializers = [];
    let _segmentName_decorators;
    let _segmentName_initializers = [];
    let _segmentName_extraInitializers = [];
    let _parentDimensionId_decorators;
    let _parentDimensionId_initializers = [];
    let _parentDimensionId_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class CreateChartOfAccountsDto {
            constructor() {
                this.dimensionCode = __runInitializers(this, _dimensionCode_initializers, void 0);
                this.dimensionName = (__runInitializers(this, _dimensionCode_extraInitializers), __runInitializers(this, _dimensionName_initializers, void 0));
                this.dimensionType = (__runInitializers(this, _dimensionName_extraInitializers), __runInitializers(this, _dimensionType_initializers, void 0));
                this.segmentNumber = (__runInitializers(this, _dimensionType_extraInitializers), __runInitializers(this, _segmentNumber_initializers, void 0));
                this.segmentName = (__runInitializers(this, _segmentNumber_extraInitializers), __runInitializers(this, _segmentName_initializers, void 0));
                this.parentDimensionId = (__runInitializers(this, _segmentName_extraInitializers), __runInitializers(this, _parentDimensionId_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _parentDimensionId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dimensionCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension code', example: '1000' })];
            _dimensionName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension name', example: 'Cash and Cash Equivalents' })];
            _dimensionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension type', enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] })];
            _segmentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment number', example: 1 })];
            _segmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment name', example: 'Account' })];
            _parentDimensionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent dimension ID', required: false })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false })];
            __esDecorate(null, null, _dimensionCode_decorators, { kind: "field", name: "dimensionCode", static: false, private: false, access: { has: obj => "dimensionCode" in obj, get: obj => obj.dimensionCode, set: (obj, value) => { obj.dimensionCode = value; } }, metadata: _metadata }, _dimensionCode_initializers, _dimensionCode_extraInitializers);
            __esDecorate(null, null, _dimensionName_decorators, { kind: "field", name: "dimensionName", static: false, private: false, access: { has: obj => "dimensionName" in obj, get: obj => obj.dimensionName, set: (obj, value) => { obj.dimensionName = value; } }, metadata: _metadata }, _dimensionName_initializers, _dimensionName_extraInitializers);
            __esDecorate(null, null, _dimensionType_decorators, { kind: "field", name: "dimensionType", static: false, private: false, access: { has: obj => "dimensionType" in obj, get: obj => obj.dimensionType, set: (obj, value) => { obj.dimensionType = value; } }, metadata: _metadata }, _dimensionType_initializers, _dimensionType_extraInitializers);
            __esDecorate(null, null, _segmentNumber_decorators, { kind: "field", name: "segmentNumber", static: false, private: false, access: { has: obj => "segmentNumber" in obj, get: obj => obj.segmentNumber, set: (obj, value) => { obj.segmentNumber = value; } }, metadata: _metadata }, _segmentNumber_initializers, _segmentNumber_extraInitializers);
            __esDecorate(null, null, _segmentName_decorators, { kind: "field", name: "segmentName", static: false, private: false, access: { has: obj => "segmentName" in obj, get: obj => obj.segmentName, set: (obj, value) => { obj.segmentName = value; } }, metadata: _metadata }, _segmentName_initializers, _segmentName_extraInitializers);
            __esDecorate(null, null, _parentDimensionId_decorators, { kind: "field", name: "parentDimensionId", static: false, private: false, access: { has: obj => "parentDimensionId" in obj, get: obj => obj.parentDimensionId, set: (obj, value) => { obj.parentDimensionId = value; } }, metadata: _metadata }, _parentDimensionId_initializers, _parentDimensionId_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateChartOfAccountsDto = CreateChartOfAccountsDto;
let CreateCostCenterDto = (() => {
    var _a;
    let _costCenterCode_decorators;
    let _costCenterCode_initializers = [];
    let _costCenterCode_extraInitializers = [];
    let _costCenterName_decorators;
    let _costCenterName_initializers = [];
    let _costCenterName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _parentCostCenterId_decorators;
    let _parentCostCenterId_initializers = [];
    let _parentCostCenterId_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    return _a = class CreateCostCenterDto {
            constructor() {
                this.costCenterCode = __runInitializers(this, _costCenterCode_initializers, void 0);
                this.costCenterName = (__runInitializers(this, _costCenterCode_extraInitializers), __runInitializers(this, _costCenterName_initializers, void 0));
                this.description = (__runInitializers(this, _costCenterName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.departmentId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.locationId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
                this.managerId = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                this.parentCostCenterId = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _parentCostCenterId_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _parentCostCenterId_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.attributes = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
                __runInitializers(this, _attributes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _costCenterCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center code', example: 'CC-1000' })];
            _costCenterName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center name', example: 'Finance Department' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false })];
            _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID', required: false })];
            _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID', example: 'MGR-001' })];
            _parentCostCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent cost center ID', required: false })];
            _budgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount', required: false })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            _attributes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional attributes', required: false })];
            __esDecorate(null, null, _costCenterCode_decorators, { kind: "field", name: "costCenterCode", static: false, private: false, access: { has: obj => "costCenterCode" in obj, get: obj => obj.costCenterCode, set: (obj, value) => { obj.costCenterCode = value; } }, metadata: _metadata }, _costCenterCode_initializers, _costCenterCode_extraInitializers);
            __esDecorate(null, null, _costCenterName_decorators, { kind: "field", name: "costCenterName", static: false, private: false, access: { has: obj => "costCenterName" in obj, get: obj => obj.costCenterName, set: (obj, value) => { obj.costCenterName = value; } }, metadata: _metadata }, _costCenterName_initializers, _costCenterName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            __esDecorate(null, null, _parentCostCenterId_decorators, { kind: "field", name: "parentCostCenterId", static: false, private: false, access: { has: obj => "parentCostCenterId" in obj, get: obj => obj.parentCostCenterId, set: (obj, value) => { obj.parentCostCenterId = value; } }, metadata: _metadata }, _parentCostCenterId_initializers, _parentCostCenterId_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCostCenterDto = CreateCostCenterDto;
let CreateProjectDto = (() => {
    var _a;
    let _projectCode_decorators;
    let _projectCode_initializers = [];
    let _projectCode_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _projectType_decorators;
    let _projectType_initializers = [];
    let _projectType_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _plannedEndDate_decorators;
    let _plannedEndDate_initializers = [];
    let _plannedEndDate_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _billingMethod_decorators;
    let _billingMethod_initializers = [];
    let _billingMethod_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    return _a = class CreateProjectDto {
            constructor() {
                this.projectCode = __runInitializers(this, _projectCode_initializers, void 0);
                this.projectName = (__runInitializers(this, _projectCode_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
                this.projectType = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _projectType_initializers, void 0));
                this.startDate = (__runInitializers(this, _projectType_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.plannedEndDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _plannedEndDate_initializers, void 0));
                this.projectManagerId = (__runInitializers(this, _plannedEndDate_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.billingMethod = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _billingMethod_initializers, void 0));
                this.attributes = (__runInitializers(this, _billingMethod_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
                __runInitializers(this, _attributes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project code', example: 'PRJ-2024-001' })];
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name', example: 'ERP Implementation' })];
            _projectType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project type', example: 'Internal' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' })];
            _plannedEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned end date', required: false })];
            _projectManagerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project manager ID', example: 'PM-001' })];
            _budgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount', example: 500000 })];
            _billingMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing method', enum: ['time_and_materials', 'fixed_price', 'cost_plus', 'milestone'] })];
            _attributes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional attributes', required: false })];
            __esDecorate(null, null, _projectCode_decorators, { kind: "field", name: "projectCode", static: false, private: false, access: { has: obj => "projectCode" in obj, get: obj => obj.projectCode, set: (obj, value) => { obj.projectCode = value; } }, metadata: _metadata }, _projectCode_initializers, _projectCode_extraInitializers);
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _projectType_decorators, { kind: "field", name: "projectType", static: false, private: false, access: { has: obj => "projectType" in obj, get: obj => obj.projectType, set: (obj, value) => { obj.projectType = value; } }, metadata: _metadata }, _projectType_initializers, _projectType_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _plannedEndDate_decorators, { kind: "field", name: "plannedEndDate", static: false, private: false, access: { has: obj => "plannedEndDate" in obj, get: obj => obj.plannedEndDate, set: (obj, value) => { obj.plannedEndDate = value; } }, metadata: _metadata }, _plannedEndDate_initializers, _plannedEndDate_extraInitializers);
            __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _billingMethod_decorators, { kind: "field", name: "billingMethod", static: false, private: false, access: { has: obj => "billingMethod" in obj, get: obj => obj.billingMethod, set: (obj, value) => { obj.billingMethod = value; } }, metadata: _metadata }, _billingMethod_initializers, _billingMethod_extraInitializers);
            __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateProjectDto = CreateProjectDto;
let CreateDepartmentDto = (() => {
    var _a;
    let _departmentCode_decorators;
    let _departmentCode_initializers = [];
    let _departmentCode_extraInitializers = [];
    let _departmentName_decorators;
    let _departmentName_initializers = [];
    let _departmentName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _parentDepartmentId_decorators;
    let _parentDepartmentId_initializers = [];
    let _parentDepartmentId_extraInitializers = [];
    let _departmentHead_decorators;
    let _departmentHead_initializers = [];
    let _departmentHead_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    return _a = class CreateDepartmentDto {
            constructor() {
                this.departmentCode = __runInitializers(this, _departmentCode_initializers, void 0);
                this.departmentName = (__runInitializers(this, _departmentCode_extraInitializers), __runInitializers(this, _departmentName_initializers, void 0));
                this.description = (__runInitializers(this, _departmentName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.parentDepartmentId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _parentDepartmentId_initializers, void 0));
                this.departmentHead = (__runInitializers(this, _parentDepartmentId_extraInitializers), __runInitializers(this, _departmentHead_initializers, void 0));
                this.locationId = (__runInitializers(this, _departmentHead_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
                __runInitializers(this, _locationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _departmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code', example: 'DEPT-FIN' })];
            _departmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department name', example: 'Finance' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _parentDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent department ID', required: false })];
            _departmentHead_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department head', example: 'EMP-001' })];
            _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID', required: false })];
            __esDecorate(null, null, _departmentCode_decorators, { kind: "field", name: "departmentCode", static: false, private: false, access: { has: obj => "departmentCode" in obj, get: obj => obj.departmentCode, set: (obj, value) => { obj.departmentCode = value; } }, metadata: _metadata }, _departmentCode_initializers, _departmentCode_extraInitializers);
            __esDecorate(null, null, _departmentName_decorators, { kind: "field", name: "departmentName", static: false, private: false, access: { has: obj => "departmentName" in obj, get: obj => obj.departmentName, set: (obj, value) => { obj.departmentName = value; } }, metadata: _metadata }, _departmentName_initializers, _departmentName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _parentDepartmentId_decorators, { kind: "field", name: "parentDepartmentId", static: false, private: false, access: { has: obj => "parentDepartmentId" in obj, get: obj => obj.parentDepartmentId, set: (obj, value) => { obj.parentDepartmentId = value; } }, metadata: _metadata }, _parentDepartmentId_initializers, _parentDepartmentId_extraInitializers);
            __esDecorate(null, null, _departmentHead_decorators, { kind: "field", name: "departmentHead", static: false, private: false, access: { has: obj => "departmentHead" in obj, get: obj => obj.departmentHead, set: (obj, value) => { obj.departmentHead = value; } }, metadata: _metadata }, _departmentHead_initializers, _departmentHead_extraInitializers);
            __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDepartmentDto = CreateDepartmentDto;
let CreateLocationDto = (() => {
    var _a;
    let _locationCode_decorators;
    let _locationCode_initializers = [];
    let _locationCode_extraInitializers = [];
    let _locationName_decorators;
    let _locationName_initializers = [];
    let _locationName_extraInitializers = [];
    let _locationType_decorators;
    let _locationType_initializers = [];
    let _locationType_extraInitializers = [];
    let _addressLine1_decorators;
    let _addressLine1_initializers = [];
    let _addressLine1_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateLocationDto {
            constructor() {
                this.locationCode = __runInitializers(this, _locationCode_initializers, void 0);
                this.locationName = (__runInitializers(this, _locationCode_extraInitializers), __runInitializers(this, _locationName_initializers, void 0));
                this.locationType = (__runInitializers(this, _locationName_extraInitializers), __runInitializers(this, _locationType_initializers, void 0));
                this.addressLine1 = (__runInitializers(this, _locationType_extraInitializers), __runInitializers(this, _addressLine1_initializers, void 0));
                this.city = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.timezone = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
                this.currency = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _locationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location code', example: 'LOC-HQ' })];
            _locationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location name', example: 'Headquarters' })];
            _locationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location type', enum: ['headquarters', 'branch', 'warehouse', 'plant', 'office', 'remote'] })];
            _addressLine1_decorators = [(0, swagger_1.ApiProperty)({ description: 'Address line 1' })];
            _city_decorators = [(0, swagger_1.ApiProperty)({ description: 'City' })];
            _state_decorators = [(0, swagger_1.ApiProperty)({ description: 'State' })];
            _postalCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Postal code' })];
            _country_decorators = [(0, swagger_1.ApiProperty)({ description: 'Country' })];
            _timezone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timezone', example: 'America/New_York' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            __esDecorate(null, null, _locationCode_decorators, { kind: "field", name: "locationCode", static: false, private: false, access: { has: obj => "locationCode" in obj, get: obj => obj.locationCode, set: (obj, value) => { obj.locationCode = value; } }, metadata: _metadata }, _locationCode_initializers, _locationCode_extraInitializers);
            __esDecorate(null, null, _locationName_decorators, { kind: "field", name: "locationName", static: false, private: false, access: { has: obj => "locationName" in obj, get: obj => obj.locationName, set: (obj, value) => { obj.locationName = value; } }, metadata: _metadata }, _locationName_initializers, _locationName_extraInitializers);
            __esDecorate(null, null, _locationType_decorators, { kind: "field", name: "locationType", static: false, private: false, access: { has: obj => "locationType" in obj, get: obj => obj.locationType, set: (obj, value) => { obj.locationType = value; } }, metadata: _metadata }, _locationType_initializers, _locationType_extraInitializers);
            __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: obj => "addressLine1" in obj, get: obj => obj.addressLine1, set: (obj, value) => { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLocationDto = CreateLocationDto;
let DimensionHierarchyDto = (() => {
    var _a;
    let _hierarchyName_decorators;
    let _hierarchyName_initializers = [];
    let _hierarchyName_extraInitializers = [];
    let _dimensionType_decorators;
    let _dimensionType_initializers = [];
    let _dimensionType_extraInitializers = [];
    let _parentId_decorators;
    let _parentId_initializers = [];
    let _parentId_extraInitializers = [];
    let _childId_decorators;
    let _childId_initializers = [];
    let _childId_extraInitializers = [];
    let _relationshipType_decorators;
    let _relationshipType_initializers = [];
    let _relationshipType_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class DimensionHierarchyDto {
            constructor() {
                this.hierarchyName = __runInitializers(this, _hierarchyName_initializers, void 0);
                this.dimensionType = (__runInitializers(this, _hierarchyName_extraInitializers), __runInitializers(this, _dimensionType_initializers, void 0));
                this.parentId = (__runInitializers(this, _dimensionType_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
                this.childId = (__runInitializers(this, _parentId_extraInitializers), __runInitializers(this, _childId_initializers, void 0));
                this.relationshipType = (__runInitializers(this, _childId_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _hierarchyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hierarchy name', example: 'Cost Center Hierarchy' })];
            _dimensionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension type', example: 'cost_center' })];
            _parentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent ID', required: false })];
            _childId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Child ID' })];
            _relationshipType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relationship type', enum: ['direct', 'indirect', 'cross_reference'] })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            __esDecorate(null, null, _hierarchyName_decorators, { kind: "field", name: "hierarchyName", static: false, private: false, access: { has: obj => "hierarchyName" in obj, get: obj => obj.hierarchyName, set: (obj, value) => { obj.hierarchyName = value; } }, metadata: _metadata }, _hierarchyName_initializers, _hierarchyName_extraInitializers);
            __esDecorate(null, null, _dimensionType_decorators, { kind: "field", name: "dimensionType", static: false, private: false, access: { has: obj => "dimensionType" in obj, get: obj => obj.dimensionType, set: (obj, value) => { obj.dimensionType = value; } }, metadata: _metadata }, _dimensionType_initializers, _dimensionType_extraInitializers);
            __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: obj => "parentId" in obj, get: obj => obj.parentId, set: (obj, value) => { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
            __esDecorate(null, null, _childId_decorators, { kind: "field", name: "childId", static: false, private: false, access: { has: obj => "childId" in obj, get: obj => obj.childId, set: (obj, value) => { obj.childId = value; } }, metadata: _metadata }, _childId_initializers, _childId_extraInitializers);
            __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: obj => "relationshipType" in obj, get: obj => obj.relationshipType, set: (obj, value) => { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DimensionHierarchyDto = DimensionHierarchyDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Chart of Accounts Dimensions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChartOfAccountsDimension model
 *
 * @example
 * ```typescript
 * const CoaDimension = createChartOfAccountsDimensionModel(sequelize);
 * const dimension = await CoaDimension.create({
 *   dimensionCode: '1000',
 *   dimensionName: 'Cash',
 *   dimensionType: 'asset',
 *   segmentNumber: 1,
 *   segmentName: 'Account'
 * });
 * ```
 */
const createChartOfAccountsDimensionModel = (sequelize) => {
    class ChartOfAccountsDimension extends sequelize_1.Model {
    }
    ChartOfAccountsDimension.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        dimensionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'dimension_code',
        },
        dimensionName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'dimension_name',
        },
        dimensionType: {
            type: sequelize_1.DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
            allowNull: false,
            field: 'dimension_type',
        },
        segmentNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'segment_number',
        },
        segmentName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'segment_name',
        },
        parentDimensionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_dimension_id',
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
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
        tableName: 'chart_of_accounts_dimensions',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['dimension_code'] },
            { fields: ['dimension_type'] },
            { fields: ['parent_dimension_id'] },
            { fields: ['is_active'] },
            { fields: ['effective_date', 'expiration_date'] },
        ],
    });
    return ChartOfAccountsDimension;
};
exports.createChartOfAccountsDimensionModel = createChartOfAccountsDimensionModel;
/**
 * Sequelize model for Cost Centers.
 */
const createCostCenterModel = (sequelize) => {
    class CostCenter extends sequelize_1.Model {
    }
    CostCenter.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'cost_center_code',
        },
        costCenterName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'cost_center_name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'department_id',
        },
        locationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'location_id',
        },
        managerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'manager_id',
        },
        parentCostCenterId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_cost_center_id',
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        budgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: true,
            field: 'budget_amount',
        },
        actualAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'actual_amount',
        },
        varianceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'variance_amount',
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
        attributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'cost_centers',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['cost_center_code'] },
            { fields: ['department_id'] },
            { fields: ['location_id'] },
            { fields: ['manager_id'] },
            { fields: ['parent_cost_center_id'] },
            { fields: ['is_active'] },
        ],
    });
    return CostCenter;
};
exports.createCostCenterModel = createCostCenterModel;
/**
 * Sequelize model for Projects.
 */
const createProjectModel = (sequelize) => {
    class Project extends sequelize_1.Model {
    }
    Project.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'project_code',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'project_name',
        },
        projectType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            field: 'project_type',
        },
        projectStatus: {
            type: sequelize_1.DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'planning',
            field: 'project_status',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'end_date',
        },
        plannedEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'planned_end_date',
        },
        projectManagerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'project_manager_id',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'customer_id',
        },
        contractId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            field: 'contract_id',
        },
        budgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            field: 'budget_amount',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'actual_cost',
        },
        committedCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'committed_cost',
        },
        forecastCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'forecast_cost',
        },
        percentComplete: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'percent_complete',
        },
        billingMethod: {
            type: sequelize_1.DataTypes.ENUM('time_and_materials', 'fixed_price', 'cost_plus', 'milestone'),
            allowNull: false,
            field: 'billing_method',
        },
        attributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'projects',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['project_code'] },
            { fields: ['project_status'] },
            { fields: ['project_manager_id'] },
            { fields: ['customer_id'] },
            { fields: ['start_date', 'end_date'] },
        ],
    });
    return Project;
};
exports.createProjectModel = createProjectModel;
/**
 * Sequelize model for Departments.
 */
const createDepartmentModel = (sequelize) => {
    class Department extends sequelize_1.Model {
    }
    Department.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        departmentCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'department_code',
        },
        departmentName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'department_name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        parentDepartmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_department_id',
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        departmentHead: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'department_head',
        },
        locationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'location_id',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        employeeCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'employee_count',
        },
        attributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'departments',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['department_code'] },
            { fields: ['parent_department_id'] },
            { fields: ['location_id'] },
            { fields: ['is_active'] },
        ],
    });
    return Department;
};
exports.createDepartmentModel = createDepartmentModel;
/**
 * Sequelize model for Locations.
 */
const createLocationModel = (sequelize) => {
    class Location extends sequelize_1.Model {
    }
    Location.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        locationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'location_code',
        },
        locationName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'location_name',
        },
        locationType: {
            type: sequelize_1.DataTypes.ENUM('headquarters', 'branch', 'warehouse', 'plant', 'office', 'remote'),
            allowNull: false,
            field: 'location_type',
        },
        addressLine1: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'address_line1',
        },
        addressLine2: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'address_line2',
        },
        city: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        state: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        postalCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            field: 'postal_code',
        },
        country: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        parentLocationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_location_id',
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
        },
        attributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'locations',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['location_code'] },
            { fields: ['location_type'] },
            { fields: ['parent_location_id'] },
            { fields: ['country'] },
            { fields: ['is_active'] },
        ],
    });
    return Location;
};
exports.createLocationModel = createLocationModel;
// ============================================================================
// CHART OF ACCOUNTS FUNCTIONS
// ============================================================================
/**
 * Creates a new chart of accounts dimension with validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateChartOfAccountsDto} dimensionDto - Dimension creation data
 * @param {string} userId - User creating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ChartOfAccountsDimension>} Created dimension
 *
 * @example
 * ```typescript
 * const dimension = await createChartOfAccountsDimension(sequelize, configService, {
 *   dimensionCode: '1000',
 *   dimensionName: 'Cash and Cash Equivalents',
 *   dimensionType: 'asset',
 *   segmentNumber: 1,
 *   segmentName: 'Account',
 *   effectiveDate: new Date('2024-01-01')
 * }, 'admin@whitecross.com');
 * ```
 */
async function createChartOfAccountsDimension(sequelize, configService, dimensionDto, userId, transaction) {
    const DimensionModel = (0, exports.createChartOfAccountsDimensionModel)(sequelize);
    // Validate code format from configuration
    const codePattern = configService.get('dimension.coa.codePattern', '^[0-9]{4,6}$');
    const regex = new RegExp(codePattern);
    if (!regex.test(dimensionDto.dimensionCode)) {
        throw new sequelize_1.ValidationError(`Dimension code ${dimensionDto.dimensionCode} does not match required pattern ${codePattern}`);
    }
    // Calculate hierarchy level
    let level = 1;
    if (dimensionDto.parentDimensionId) {
        const parent = await DimensionModel.findByPk(dimensionDto.parentDimensionId, { transaction });
        if (!parent) {
            throw new sequelize_1.ValidationError(`Parent dimension ${dimensionDto.parentDimensionId} not found`);
        }
        level = parent.level + 1;
        const maxLevels = configService.get('dimension.coa.maxLevels', 10);
        if (level > maxLevels) {
            throw new sequelize_1.ValidationError(`Maximum hierarchy level ${maxLevels} exceeded`);
        }
    }
    const dimension = await DimensionModel.create({
        dimensionCode: dimensionDto.dimensionCode,
        dimensionName: dimensionDto.dimensionName,
        dimensionType: dimensionDto.dimensionType,
        segmentNumber: dimensionDto.segmentNumber,
        segmentName: dimensionDto.segmentName,
        parentDimensionId: dimensionDto.parentDimensionId,
        level,
        isActive: true,
        effectiveDate: dimensionDto.effectiveDate,
        expirationDate: dimensionDto.expirationDate,
        createdBy: userId,
        lastModifiedBy: userId,
    }, { transaction });
    return dimension.toJSON();
}
/**
 * Retrieves chart of accounts dimension hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Root dimension code
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<ChartOfAccountsDimension[]>} Dimension hierarchy
 */
async function getChartOfAccountsHierarchy(sequelize, dimensionCode, maxDepth = 10) {
    const DimensionModel = (0, exports.createChartOfAccountsDimensionModel)(sequelize);
    const root = await DimensionModel.findOne({
        where: { dimensionCode, isActive: true },
    });
    if (!root) {
        throw new Error(`Dimension ${dimensionCode} not found`);
    }
    const hierarchy = [root.toJSON()];
    if (maxDepth > 0) {
        const children = await getChildDimensions(sequelize, root.id, maxDepth - 1);
        hierarchy.push(...children);
    }
    return hierarchy;
}
/**
 * Updates chart of accounts dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Dimension code
 * @param {Partial<CreateChartOfAccountsDto>} updates - Fields to update
 * @param {string} userId - User updating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ChartOfAccountsDimension>} Updated dimension
 */
async function updateChartOfAccountsDimension(sequelize, dimensionCode, updates, userId, transaction) {
    const DimensionModel = (0, exports.createChartOfAccountsDimensionModel)(sequelize);
    const dimension = await DimensionModel.findOne({
        where: { dimensionCode },
        transaction,
    });
    if (!dimension) {
        throw new Error(`Dimension ${dimensionCode} not found`);
    }
    await dimension.update({
        ...updates,
        lastModifiedBy: userId,
    }, { transaction });
    return dimension.toJSON();
}
/**
 * Deactivates a chart of accounts dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Dimension code
 * @param {string} userId - User deactivating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
async function deactivateChartOfAccountsDimension(sequelize, dimensionCode, userId, transaction) {
    const DimensionModel = (0, exports.createChartOfAccountsDimensionModel)(sequelize);
    const result = await DimensionModel.update({
        isActive: false,
        expirationDate: new Date(),
        lastModifiedBy: userId,
    }, {
        where: { dimensionCode },
        transaction,
    });
    return result[0] > 0;
}
// ============================================================================
// COST CENTER FUNCTIONS
// ============================================================================
/**
 * Creates a new cost center with budget tracking.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateCostCenterDto} costCenterDto - Cost center creation data
 * @param {string} userId - User creating the cost center
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CostCenter>} Created cost center
 */
async function createCostCenter(sequelize, configService, costCenterDto, userId, transaction) {
    const CostCenterModel = (0, exports.createCostCenterModel)(sequelize);
    // Calculate hierarchy level
    let level = 1;
    if (costCenterDto.parentCostCenterId) {
        const parent = await CostCenterModel.findByPk(costCenterDto.parentCostCenterId, { transaction });
        if (!parent) {
            throw new sequelize_1.ValidationError(`Parent cost center ${costCenterDto.parentCostCenterId} not found`);
        }
        level = parent.level + 1;
    }
    const costCenter = await CostCenterModel.create({
        costCenterCode: costCenterDto.costCenterCode,
        costCenterName: costCenterDto.costCenterName,
        description: costCenterDto.description,
        departmentId: costCenterDto.departmentId,
        locationId: costCenterDto.locationId,
        managerId: costCenterDto.managerId,
        parentCostCenterId: costCenterDto.parentCostCenterId,
        level,
        isActive: true,
        budgetAmount: costCenterDto.budgetAmount,
        actualAmount: 0,
        varianceAmount: costCenterDto.budgetAmount || 0,
        effectiveDate: costCenterDto.effectiveDate,
        attributes: costCenterDto.attributes || {},
    }, { transaction });
    return costCenter.toJSON();
}
/**
 * Retrieves cost center with budget variance analysis.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @returns {Promise<CostCenter>} Cost center with budget analysis
 */
async function getCostCenterWithBudgetAnalysis(sequelize, costCenterCode) {
    const CostCenterModel = (0, exports.createCostCenterModel)(sequelize);
    const costCenter = await CostCenterModel.findOne({
        where: { costCenterCode, isActive: true },
    });
    if (!costCenter) {
        throw new Error(`Cost center ${costCenterCode} not found`);
    }
    // Calculate current variance
    const variance = (costCenter.budgetAmount || 0) - costCenter.actualAmount;
    await costCenter.update({ varianceAmount: variance });
    return costCenter.toJSON();
}
/**
 * Updates cost center actual spending.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {number} amount - Amount to add to actual
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CostCenter>} Updated cost center
 */
async function updateCostCenterActuals(sequelize, costCenterCode, amount, transaction) {
    const CostCenterModel = (0, exports.createCostCenterModel)(sequelize);
    const costCenter = await CostCenterModel.findOne({
        where: { costCenterCode },
        transaction,
    });
    if (!costCenter) {
        throw new Error(`Cost center ${costCenterCode} not found`);
    }
    const newActual = costCenter.actualAmount + amount;
    const newVariance = (costCenter.budgetAmount || 0) - newActual;
    await costCenter.update({
        actualAmount: newActual,
        varianceAmount: newVariance,
    }, { transaction });
    return costCenter.toJSON();
}
/**
 * Retrieves cost center hierarchy for rollup reporting.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Root cost center code
 * @returns {Promise<CostCenter[]>} Cost center hierarchy
 */
async function getCostCenterHierarchy(sequelize, costCenterCode) {
    const CostCenterModel = (0, exports.createCostCenterModel)(sequelize);
    const root = await CostCenterModel.findOne({
        where: { costCenterCode, isActive: true },
    });
    if (!root) {
        throw new Error(`Cost center ${costCenterCode} not found`);
    }
    const hierarchy = [root.toJSON()];
    // Recursive fetch of child cost centers
    const fetchChildren = async (parentId) => {
        const children = await CostCenterModel.findAll({
            where: { parentCostCenterId: parentId, isActive: true },
        });
        for (const child of children) {
            hierarchy.push(child.toJSON());
            await fetchChildren(child.id);
        }
    };
    await fetchChildren(root.id);
    return hierarchy;
}
/**
 * Rolls up cost center actuals to parent.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<number>} Total rolled up amount
 */
async function rollupCostCenterActuals(sequelize, costCenterCode, transaction) {
    const hierarchy = await getCostCenterHierarchy(sequelize, costCenterCode);
    let totalActuals = 0;
    for (const cc of hierarchy) {
        totalActuals += cc.actualAmount;
    }
    return totalActuals;
}
// ============================================================================
// PROJECT DIMENSION FUNCTIONS
// ============================================================================
/**
 * Creates a new project dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateProjectDto} projectDto - Project creation data
 * @param {string} userId - User creating the project
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Created project
 */
async function createProject(sequelize, configService, projectDto, userId, transaction) {
    const ProjectModel = (0, exports.createProjectModel)(sequelize);
    const project = await ProjectModel.create({
        projectCode: projectDto.projectCode,
        projectName: projectDto.projectName,
        projectType: projectDto.projectType,
        projectStatus: 'planning',
        startDate: projectDto.startDate,
        plannedEndDate: projectDto.plannedEndDate,
        projectManagerId: projectDto.projectManagerId,
        budgetAmount: projectDto.budgetAmount,
        actualCost: 0,
        committedCost: 0,
        forecastCost: projectDto.budgetAmount,
        percentComplete: 0,
        billingMethod: projectDto.billingMethod,
        attributes: projectDto.attributes || {},
    }, { transaction });
    return project.toJSON();
}
/**
 * Updates project status and completion percentage.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} projectCode - Project code
 * @param {string} status - New project status
 * @param {number} percentComplete - Completion percentage
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Updated project
 */
async function updateProjectStatus(sequelize, projectCode, status, percentComplete, transaction) {
    const ProjectModel = (0, exports.createProjectModel)(sequelize);
    const project = await ProjectModel.findOne({
        where: { projectCode },
        transaction,
    });
    if (!project) {
        throw new Error(`Project ${projectCode} not found`);
    }
    const updates = {
        projectStatus: status,
        percentComplete,
    };
    if (status === 'completed' && !project.endDate) {
        updates.endDate = new Date();
    }
    await project.update(updates, { transaction });
    return project.toJSON();
}
/**
 * Updates project costs (actual, committed, forecast).
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} projectCode - Project code
 * @param {Partial<Pick<Project, 'actualCost' | 'committedCost' | 'forecastCost'>>} costs - Cost updates
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Updated project
 */
async function updateProjectCosts(sequelize, projectCode, costs, transaction) {
    const ProjectModel = (0, exports.createProjectModel)(sequelize);
    const project = await ProjectModel.findOne({
        where: { projectCode },
        transaction,
    });
    if (!project) {
        throw new Error(`Project ${projectCode} not found`);
    }
    await project.update(costs, { transaction });
    return project.toJSON();
}
/**
 * Retrieves active projects with budget variance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Project[]>} Active projects
 */
async function getActiveProjects(sequelize, configService) {
    const ProjectModel = (0, exports.createProjectModel)(sequelize);
    const projects = await ProjectModel.findAll({
        where: {
            projectStatus: {
                [sequelize_1.Op.in]: ['planning', 'active', 'on_hold'],
            },
        },
        order: [['startDate', 'DESC']],
    });
    return projects.map(p => p.toJSON());
}
// ============================================================================
// DEPARTMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new department.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDepartmentDto} departmentDto - Department creation data
 * @param {string} userId - User creating the department
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Department>} Created department
 */
async function createDepartment(sequelize, departmentDto, userId, transaction) {
    const DepartmentModel = (0, exports.createDepartmentModel)(sequelize);
    let level = 1;
    if (departmentDto.parentDepartmentId) {
        const parent = await DepartmentModel.findByPk(departmentDto.parentDepartmentId, { transaction });
        if (!parent) {
            throw new sequelize_1.ValidationError(`Parent department ${departmentDto.parentDepartmentId} not found`);
        }
        level = parent.level + 1;
    }
    const department = await DepartmentModel.create({
        departmentCode: departmentDto.departmentCode,
        departmentName: departmentDto.departmentName,
        description: departmentDto.description,
        parentDepartmentId: departmentDto.parentDepartmentId,
        level,
        departmentHead: departmentDto.departmentHead,
        locationId: departmentDto.locationId,
        isActive: true,
        employeeCount: 0,
        attributes: {},
    }, { transaction });
    return department.toJSON();
}
/**
 * Retrieves department hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} departmentCode - Root department code
 * @returns {Promise<Department[]>} Department hierarchy
 */
async function getDepartmentHierarchy(sequelize, departmentCode) {
    const DepartmentModel = (0, exports.createDepartmentModel)(sequelize);
    const root = await DepartmentModel.findOne({
        where: { departmentCode, isActive: true },
    });
    if (!root) {
        throw new Error(`Department ${departmentCode} not found`);
    }
    const hierarchy = [root.toJSON()];
    const fetchChildren = async (parentId) => {
        const children = await DepartmentModel.findAll({
            where: { parentDepartmentId: parentId, isActive: true },
        });
        for (const child of children) {
            hierarchy.push(child.toJSON());
            await fetchChildren(child.id);
        }
    };
    await fetchChildren(root.id);
    return hierarchy;
}
// ============================================================================
// LOCATION FUNCTIONS
// ============================================================================
/**
 * Creates a new location.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateLocationDto} locationDto - Location creation data
 * @param {string} userId - User creating the location
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Location>} Created location
 */
async function createLocation(sequelize, locationDto, userId, transaction) {
    const LocationModel = (0, exports.createLocationModel)(sequelize);
    const location = await LocationModel.create({
        locationCode: locationDto.locationCode,
        locationName: locationDto.locationName,
        locationType: locationDto.locationType,
        addressLine1: locationDto.addressLine1,
        city: locationDto.city,
        state: locationDto.state,
        postalCode: locationDto.postalCode,
        country: locationDto.country,
        level: 1,
        isActive: true,
        timezone: locationDto.timezone,
        currency: locationDto.currency,
        attributes: {},
    }, { transaction });
    return location.toJSON();
}
/**
 * Retrieves locations by country.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} country - Country code
 * @returns {Promise<Location[]>} Locations in country
 */
async function getLocationsByCountry(sequelize, country) {
    const LocationModel = (0, exports.createLocationModel)(sequelize);
    const locations = await LocationModel.findAll({
        where: { country, isActive: true },
        order: [['locationName', 'ASC']],
    });
    return locations.map(l => l.toJSON());
}
// ============================================================================
// DIMENSION SECURITY FUNCTIONS
// ============================================================================
/**
 * Validates user access to dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @param {string} dimensionType - Dimension type
 * @param {string} dimensionCode - Dimension code
 * @param {string} requiredAccess - Required access level
 * @returns {Promise<boolean>} Access granted
 */
async function validateDimensionAccess(sequelize, userId, dimensionType, dimensionCode, requiredAccess) {
    // Placeholder for actual security validation logic
    // Would check dimension_security table
    return true;
}
/**
 * Validates dimension combination against business rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {Record<string, string>} dimensionCombination - Dimension values
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
async function validateDimensionCombination(sequelize, configService, dimensionCombination) {
    const errors = [];
    // Validate required dimensions
    const requiredDimensions = configService.get('dimension.required', ['account', 'costCenter']);
    for (const dim of requiredDimensions) {
        if (!dimensionCombination[dim]) {
            errors.push(`Required dimension ${dim} is missing`);
        }
    }
    // Additional business rule validations would go here
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
async function getChildDimensions(sequelize, parentId, maxDepth) {
    if (maxDepth <= 0)
        return [];
    const DimensionModel = (0, exports.createChartOfAccountsDimensionModel)(sequelize);
    const children = await DimensionModel.findAll({
        where: { parentDimensionId: parentId, isActive: true },
    });
    const result = [];
    for (const child of children) {
        result.push(child.toJSON());
        if (maxDepth > 1) {
            const grandchildren = await getChildDimensions(sequelize, child.id, maxDepth - 1);
            result.push(...grandchildren);
        }
    }
    return result;
}
//# sourceMappingURL=dimension-management-kit.js.map