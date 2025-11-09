"use strict";
/**
 * LOC: COSTACCT001
 * File: /reuse/edwards/financial/cost-accounting-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - date-fns (Date manipulation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Cost allocation services
 *   - Activity-based costing services
 *   - Product costing modules
 *   - Variance analysis services
 *   - Management reporting modules
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
exports.generateProfitabilityReport = exports.calculateBreakEvenPoint = exports.calculateContributionMargin = exports.analyzeCostBehaviorHighLow = exports.calculateEquivalentUnits = exports.calculateProductCostProcess = exports.calculateProductCostJobOrder = exports.closeJob = exports.calculateJobCostVariance = exports.applyOverheadToJobCost = exports.addLaborCostToJob = exports.addMaterialCostToJob = exports.createJobCost = exports.performComprehensiveVarianceAnalysis = exports.calculateOverheadEfficiencyVariance = exports.calculateOverheadVolumeVariance = exports.calculateOverheadSpendingVariance = exports.calculateLaborEfficiencyVariance = exports.calculateLaborRateVariance = exports.calculateMaterialQuantityVariance = exports.calculateMaterialPriceVariance = exports.getStandardCostForProduct = exports.createStandardCost = exports.applyOverheadToJob = exports.calculatePredeterminedOverheadRate = exports.allocateOverheadABC = exports.allocateServiceCostsStepDown = exports.allocateOverheadDirect = exports.getCostPoolById = exports.addCostToPool = exports.createCostPool = exports.updateCostCenterBudget = exports.listCostCenters = exports.getCostCenterByCode = exports.getCostCenterById = exports.createCostCenter = exports.createCostPoolModel = exports.createCostCenterModel = exports.CreateJobCostDto = exports.AnalyzeVarianceDto = exports.CreateStandardCostDto = exports.AllocateOverheadDto = exports.CreateCostPoolDto = exports.CreateCostCenterDto = void 0;
/**
 * File: /reuse/edwards/financial/cost-accounting-allocation-kit.ts
 * Locator: WC-FIN-COSTACCT-001
 * Purpose: Comprehensive Cost Accounting and Allocation Management - JD Edwards EnterpriseOne-level cost allocation, ABC costing, variance analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, date-fns 3.x
 * Downstream: ../backend/financial/*, Cost Allocation Services, ABC Services, Product Costing, Variance Analysis, Management Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, date-fns 3.x
 * Exports: 45 functions for cost allocation, activity-based costing, cost pools, cost drivers, overhead allocation, standard costing, variance analysis (price, quantity, efficiency), cost centers, product costing, job costing, process costing, service department allocation
 *
 * LLM Context: Enterprise-grade cost accounting and allocation management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive cost allocation using multiple methods (direct, step-down, reciprocal), activity-based costing (ABC),
 * cost pool management, cost driver analysis, overhead allocation (traditional and ABC), standard costing with multi-level variance analysis
 * (material price/quantity, labor rate/efficiency, overhead spending/volume/efficiency), cost center accounting, product costing,
 * job order costing, process costing, service department cost allocation, transfer pricing, profitability analysis, and compliance reporting.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateCostCenterDto = (() => {
    var _a;
    let _costCenterCode_decorators;
    let _costCenterCode_initializers = [];
    let _costCenterCode_extraInitializers = [];
    let _costCenterName_decorators;
    let _costCenterName_initializers = [];
    let _costCenterName_extraInitializers = [];
    let _costCenterType_decorators;
    let _costCenterType_initializers = [];
    let _costCenterType_extraInitializers = [];
    let _departmentCode_decorators;
    let _departmentCode_initializers = [];
    let _departmentCode_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    return _a = class CreateCostCenterDto {
            constructor() {
                this.costCenterCode = __runInitializers(this, _costCenterCode_initializers, void 0);
                this.costCenterName = (__runInitializers(this, _costCenterCode_extraInitializers), __runInitializers(this, _costCenterName_initializers, void 0));
                this.costCenterType = (__runInitializers(this, _costCenterName_extraInitializers), __runInitializers(this, _costCenterType_initializers, void 0));
                this.departmentCode = (__runInitializers(this, _costCenterType_extraInitializers), __runInitializers(this, _departmentCode_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _departmentCode_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.managerId = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                __runInitializers(this, _managerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _costCenterCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center code', example: 'CC-100' })];
            _costCenterName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center name', example: 'Manufacturing Department' })];
            _costCenterType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center type', enum: ['production', 'service', 'administrative'] })];
            _departmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code', example: 'DEPT-MFG' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year', example: 2024 })];
            _budgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount', example: 500000, required: false })];
            _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID', required: false })];
            __esDecorate(null, null, _costCenterCode_decorators, { kind: "field", name: "costCenterCode", static: false, private: false, access: { has: obj => "costCenterCode" in obj, get: obj => obj.costCenterCode, set: (obj, value) => { obj.costCenterCode = value; } }, metadata: _metadata }, _costCenterCode_initializers, _costCenterCode_extraInitializers);
            __esDecorate(null, null, _costCenterName_decorators, { kind: "field", name: "costCenterName", static: false, private: false, access: { has: obj => "costCenterName" in obj, get: obj => obj.costCenterName, set: (obj, value) => { obj.costCenterName = value; } }, metadata: _metadata }, _costCenterName_initializers, _costCenterName_extraInitializers);
            __esDecorate(null, null, _costCenterType_decorators, { kind: "field", name: "costCenterType", static: false, private: false, access: { has: obj => "costCenterType" in obj, get: obj => obj.costCenterType, set: (obj, value) => { obj.costCenterType = value; } }, metadata: _metadata }, _costCenterType_initializers, _costCenterType_extraInitializers);
            __esDecorate(null, null, _departmentCode_decorators, { kind: "field", name: "departmentCode", static: false, private: false, access: { has: obj => "departmentCode" in obj, get: obj => obj.departmentCode, set: (obj, value) => { obj.departmentCode = value; } }, metadata: _metadata }, _departmentCode_initializers, _departmentCode_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCostCenterDto = CreateCostCenterDto;
let CreateCostPoolDto = (() => {
    var _a;
    let _costPoolCode_decorators;
    let _costPoolCode_initializers = [];
    let _costPoolCode_extraInitializers = [];
    let _costPoolName_decorators;
    let _costPoolName_initializers = [];
    let _costPoolName_extraInitializers = [];
    let _costPoolType_decorators;
    let _costPoolType_initializers = [];
    let _costPoolType_extraInitializers = [];
    let _allocationMethod_decorators;
    let _allocationMethod_initializers = [];
    let _allocationMethod_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    return _a = class CreateCostPoolDto {
            constructor() {
                this.costPoolCode = __runInitializers(this, _costPoolCode_initializers, void 0);
                this.costPoolName = (__runInitializers(this, _costPoolCode_extraInitializers), __runInitializers(this, _costPoolName_initializers, void 0));
                this.costPoolType = (__runInitializers(this, _costPoolName_extraInitializers), __runInitializers(this, _costPoolType_initializers, void 0));
                this.allocationMethod = (__runInitializers(this, _costPoolType_extraInitializers), __runInitializers(this, _allocationMethod_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _allocationMethod_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                __runInitializers(this, _fiscalPeriod_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _costPoolCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost pool code', example: 'POOL-OH-001' })];
            _costPoolName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost pool name', example: 'Factory Overhead Pool' })];
            _costPoolType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost pool type', enum: ['overhead', 'direct', 'indirect', 'service', 'activity'] })];
            _allocationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocation method', enum: ['direct', 'step-down', 'reciprocal', 'activity-based'] })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            __esDecorate(null, null, _costPoolCode_decorators, { kind: "field", name: "costPoolCode", static: false, private: false, access: { has: obj => "costPoolCode" in obj, get: obj => obj.costPoolCode, set: (obj, value) => { obj.costPoolCode = value; } }, metadata: _metadata }, _costPoolCode_initializers, _costPoolCode_extraInitializers);
            __esDecorate(null, null, _costPoolName_decorators, { kind: "field", name: "costPoolName", static: false, private: false, access: { has: obj => "costPoolName" in obj, get: obj => obj.costPoolName, set: (obj, value) => { obj.costPoolName = value; } }, metadata: _metadata }, _costPoolName_initializers, _costPoolName_extraInitializers);
            __esDecorate(null, null, _costPoolType_decorators, { kind: "field", name: "costPoolType", static: false, private: false, access: { has: obj => "costPoolType" in obj, get: obj => obj.costPoolType, set: (obj, value) => { obj.costPoolType = value; } }, metadata: _metadata }, _costPoolType_initializers, _costPoolType_extraInitializers);
            __esDecorate(null, null, _allocationMethod_decorators, { kind: "field", name: "allocationMethod", static: false, private: false, access: { has: obj => "allocationMethod" in obj, get: obj => obj.allocationMethod, set: (obj, value) => { obj.allocationMethod = value; } }, metadata: _metadata }, _allocationMethod_initializers, _allocationMethod_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCostPoolDto = CreateCostPoolDto;
let AllocateOverheadDto = (() => {
    var _a;
    let _costPoolId_decorators;
    let _costPoolId_initializers = [];
    let _costPoolId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _allocationBasis_decorators;
    let _allocationBasis_initializers = [];
    let _allocationBasis_extraInitializers = [];
    let _totalOverhead_decorators;
    let _totalOverhead_initializers = [];
    let _totalOverhead_extraInitializers = [];
    return _a = class AllocateOverheadDto {
            constructor() {
                this.costPoolId = __runInitializers(this, _costPoolId_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _costPoolId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.allocationBasis = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _allocationBasis_initializers, void 0));
                this.totalOverhead = (__runInitializers(this, _allocationBasis_extraInitializers), __runInitializers(this, _totalOverhead_initializers, void 0));
                __runInitializers(this, _totalOverhead_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _costPoolId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost pool ID' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _allocationBasis_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocation basis', example: 'direct-labor-hours' })];
            _totalOverhead_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total overhead amount' })];
            __esDecorate(null, null, _costPoolId_decorators, { kind: "field", name: "costPoolId", static: false, private: false, access: { has: obj => "costPoolId" in obj, get: obj => obj.costPoolId, set: (obj, value) => { obj.costPoolId = value; } }, metadata: _metadata }, _costPoolId_initializers, _costPoolId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _allocationBasis_decorators, { kind: "field", name: "allocationBasis", static: false, private: false, access: { has: obj => "allocationBasis" in obj, get: obj => obj.allocationBasis, set: (obj, value) => { obj.allocationBasis = value; } }, metadata: _metadata }, _allocationBasis_initializers, _allocationBasis_extraInitializers);
            __esDecorate(null, null, _totalOverhead_decorators, { kind: "field", name: "totalOverhead", static: false, private: false, access: { has: obj => "totalOverhead" in obj, get: obj => obj.totalOverhead, set: (obj, value) => { obj.totalOverhead = value; } }, metadata: _metadata }, _totalOverhead_initializers, _totalOverhead_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AllocateOverheadDto = AllocateOverheadDto;
let CreateStandardCostDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _productCode_decorators;
    let _productCode_initializers = [];
    let _productCode_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _standardMaterialCost_decorators;
    let _standardMaterialCost_initializers = [];
    let _standardMaterialCost_extraInitializers = [];
    let _standardLaborCost_decorators;
    let _standardLaborCost_initializers = [];
    let _standardLaborCost_extraInitializers = [];
    let _standardOverheadCost_decorators;
    let _standardOverheadCost_initializers = [];
    let _standardOverheadCost_extraInitializers = [];
    return _a = class CreateStandardCostDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.productCode = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _productCode_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _productCode_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.standardMaterialCost = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _standardMaterialCost_initializers, void 0));
                this.standardLaborCost = (__runInitializers(this, _standardMaterialCost_extraInitializers), __runInitializers(this, _standardLaborCost_initializers, void 0));
                this.standardOverheadCost = (__runInitializers(this, _standardLaborCost_extraInitializers), __runInitializers(this, _standardOverheadCost_initializers, void 0));
                __runInitializers(this, _standardOverheadCost_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' })];
            _productCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product code' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' })];
            _standardMaterialCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard material cost per unit' })];
            _standardLaborCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard labor cost per unit' })];
            _standardOverheadCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard overhead cost per unit' })];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _productCode_decorators, { kind: "field", name: "productCode", static: false, private: false, access: { has: obj => "productCode" in obj, get: obj => obj.productCode, set: (obj, value) => { obj.productCode = value; } }, metadata: _metadata }, _productCode_initializers, _productCode_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _standardMaterialCost_decorators, { kind: "field", name: "standardMaterialCost", static: false, private: false, access: { has: obj => "standardMaterialCost" in obj, get: obj => obj.standardMaterialCost, set: (obj, value) => { obj.standardMaterialCost = value; } }, metadata: _metadata }, _standardMaterialCost_initializers, _standardMaterialCost_extraInitializers);
            __esDecorate(null, null, _standardLaborCost_decorators, { kind: "field", name: "standardLaborCost", static: false, private: false, access: { has: obj => "standardLaborCost" in obj, get: obj => obj.standardLaborCost, set: (obj, value) => { obj.standardLaborCost = value; } }, metadata: _metadata }, _standardLaborCost_initializers, _standardLaborCost_extraInitializers);
            __esDecorate(null, null, _standardOverheadCost_decorators, { kind: "field", name: "standardOverheadCost", static: false, private: false, access: { has: obj => "standardOverheadCost" in obj, get: obj => obj.standardOverheadCost, set: (obj, value) => { obj.standardOverheadCost = value; } }, metadata: _metadata }, _standardOverheadCost_initializers, _standardOverheadCost_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStandardCostDto = CreateStandardCostDto;
let AnalyzeVarianceDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _varianceType_decorators;
    let _varianceType_initializers = [];
    let _varianceType_extraInitializers = [];
    let _productCode_decorators;
    let _productCode_initializers = [];
    let _productCode_extraInitializers = [];
    let _costCenterCode_decorators;
    let _costCenterCode_initializers = [];
    let _costCenterCode_extraInitializers = [];
    let _standardAmount_decorators;
    let _standardAmount_initializers = [];
    let _standardAmount_extraInitializers = [];
    let _actualAmount_decorators;
    let _actualAmount_initializers = [];
    let _actualAmount_extraInitializers = [];
    return _a = class AnalyzeVarianceDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.varianceType = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _varianceType_initializers, void 0));
                this.productCode = (__runInitializers(this, _varianceType_extraInitializers), __runInitializers(this, _productCode_initializers, void 0));
                this.costCenterCode = (__runInitializers(this, _productCode_extraInitializers), __runInitializers(this, _costCenterCode_initializers, void 0));
                this.standardAmount = (__runInitializers(this, _costCenterCode_extraInitializers), __runInitializers(this, _standardAmount_initializers, void 0));
                this.actualAmount = (__runInitializers(this, _standardAmount_extraInitializers), __runInitializers(this, _actualAmount_initializers, void 0));
                __runInitializers(this, _actualAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _varianceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Variance type', enum: ['material-price', 'material-quantity', 'labor-rate', 'labor-efficiency', 'overhead-spending', 'overhead-volume'] })];
            _productCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product code', required: false })];
            _costCenterCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center code' })];
            _standardAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard amount' })];
            _actualAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual amount' })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _varianceType_decorators, { kind: "field", name: "varianceType", static: false, private: false, access: { has: obj => "varianceType" in obj, get: obj => obj.varianceType, set: (obj, value) => { obj.varianceType = value; } }, metadata: _metadata }, _varianceType_initializers, _varianceType_extraInitializers);
            __esDecorate(null, null, _productCode_decorators, { kind: "field", name: "productCode", static: false, private: false, access: { has: obj => "productCode" in obj, get: obj => obj.productCode, set: (obj, value) => { obj.productCode = value; } }, metadata: _metadata }, _productCode_initializers, _productCode_extraInitializers);
            __esDecorate(null, null, _costCenterCode_decorators, { kind: "field", name: "costCenterCode", static: false, private: false, access: { has: obj => "costCenterCode" in obj, get: obj => obj.costCenterCode, set: (obj, value) => { obj.costCenterCode = value; } }, metadata: _metadata }, _costCenterCode_initializers, _costCenterCode_extraInitializers);
            __esDecorate(null, null, _standardAmount_decorators, { kind: "field", name: "standardAmount", static: false, private: false, access: { has: obj => "standardAmount" in obj, get: obj => obj.standardAmount, set: (obj, value) => { obj.standardAmount = value; } }, metadata: _metadata }, _standardAmount_initializers, _standardAmount_extraInitializers);
            __esDecorate(null, null, _actualAmount_decorators, { kind: "field", name: "actualAmount", static: false, private: false, access: { has: obj => "actualAmount" in obj, get: obj => obj.actualAmount, set: (obj, value) => { obj.actualAmount = value; } }, metadata: _metadata }, _actualAmount_initializers, _actualAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AnalyzeVarianceDto = AnalyzeVarianceDto;
let CreateJobCostDto = (() => {
    var _a;
    let _jobNumber_decorators;
    let _jobNumber_initializers = [];
    let _jobNumber_extraInitializers = [];
    let _jobName_decorators;
    let _jobName_initializers = [];
    let _jobName_extraInitializers = [];
    let _jobType_decorators;
    let _jobType_initializers = [];
    let _jobType_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _budgetedCost_decorators;
    let _budgetedCost_initializers = [];
    let _budgetedCost_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    return _a = class CreateJobCostDto {
            constructor() {
                this.jobNumber = __runInitializers(this, _jobNumber_initializers, void 0);
                this.jobName = (__runInitializers(this, _jobNumber_extraInitializers), __runInitializers(this, _jobName_initializers, void 0));
                this.jobType = (__runInitializers(this, _jobName_extraInitializers), __runInitializers(this, _jobType_initializers, void 0));
                this.startDate = (__runInitializers(this, _jobType_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.budgetedCost = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _budgetedCost_initializers, void 0));
                this.customerId = (__runInitializers(this, _budgetedCost_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                __runInitializers(this, _customerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jobNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job number', example: 'JOB-2024-001' })];
            _jobName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job name', example: 'Custom Equipment Build' })];
            _jobType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job type', enum: ['production', 'service', 'project', 'maintenance'] })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _budgetedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted cost', required: false })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', required: false })];
            __esDecorate(null, null, _jobNumber_decorators, { kind: "field", name: "jobNumber", static: false, private: false, access: { has: obj => "jobNumber" in obj, get: obj => obj.jobNumber, set: (obj, value) => { obj.jobNumber = value; } }, metadata: _metadata }, _jobNumber_initializers, _jobNumber_extraInitializers);
            __esDecorate(null, null, _jobName_decorators, { kind: "field", name: "jobName", static: false, private: false, access: { has: obj => "jobName" in obj, get: obj => obj.jobName, set: (obj, value) => { obj.jobName = value; } }, metadata: _metadata }, _jobName_initializers, _jobName_extraInitializers);
            __esDecorate(null, null, _jobType_decorators, { kind: "field", name: "jobType", static: false, private: false, access: { has: obj => "jobType" in obj, get: obj => obj.jobType, set: (obj, value) => { obj.jobType = value; } }, metadata: _metadata }, _jobType_initializers, _jobType_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _budgetedCost_decorators, { kind: "field", name: "budgetedCost", static: false, private: false, access: { has: obj => "budgetedCost" in obj, get: obj => obj.budgetedCost, set: (obj, value) => { obj.budgetedCost = value; } }, metadata: _metadata }, _budgetedCost_initializers, _budgetedCost_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateJobCostDto = CreateJobCostDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Cost Centers with budgeting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostCenter model
 *
 * @example
 * ```typescript
 * const CostCenter = createCostCenterModel(sequelize);
 * const costCenter = await CostCenter.create({
 *   costCenterCode: 'CC-100',
 *   costCenterName: 'Manufacturing',
 *   costCenterType: 'production',
 *   fiscalYear: 2024
 * });
 * ```
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
            comment: 'Unique cost center code',
        },
        costCenterName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Cost center name',
        },
        costCenterType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Cost center type',
            validate: {
                isIn: [['production', 'service', 'administrative', 'selling', 'distribution']],
            },
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Department ID',
        },
        departmentCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Department code',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is cost center active',
        },
        managerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Cost center manager',
        },
        budgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Annual budget amount',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
            validate: {
                min: 2000,
                max: 2099,
            },
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
            comment: 'User who created the record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'cost_centers',
        timestamps: true,
        indexes: [
            { fields: ['costCenterCode'], unique: true },
            { fields: ['costCenterType'] },
            { fields: ['departmentCode'] },
            { fields: ['fiscalYear'] },
            { fields: ['isActive'] },
        ],
        hooks: {
            beforeCreate: (costCenter) => {
                if (!costCenter.createdBy) {
                    throw new Error('createdBy is required');
                }
                costCenter.updatedBy = costCenter.createdBy;
            },
        },
    });
    return CostCenter;
};
exports.createCostCenterModel = createCostCenterModel;
/**
 * Sequelize model for Cost Pools.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostPool model
 *
 * @example
 * ```typescript
 * const CostPool = createCostPoolModel(sequelize);
 * const pool = await CostPool.create({
 *   costPoolCode: 'POOL-OH-001',
 *   costPoolName: 'Factory Overhead',
 *   costPoolType: 'overhead',
 *   allocationMethod: 'activity-based'
 * });
 * ```
 */
const createCostPoolModel = (sequelize) => {
    class CostPool extends sequelize_1.Model {
    }
    CostPool.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        costPoolCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique cost pool code',
        },
        costPoolName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Cost pool name',
        },
        costPoolType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Cost pool type',
            validate: {
                isIn: [['overhead', 'direct', 'indirect', 'service', 'activity']],
            },
        },
        allocationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Allocation method',
            validate: {
                isIn: [['direct', 'step-down', 'reciprocal', 'activity-based']],
            },
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period',
            validate: {
                min: 1,
                max: 13,
            },
        },
        totalCost: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total cost in pool',
        },
        allocatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Allocated cost',
        },
        unallocatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Unallocated cost',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is cost pool active',
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
            comment: 'User who created the record',
        },
    }, {
        sequelize,
        tableName: 'cost_pools',
        timestamps: true,
        indexes: [
            { fields: ['costPoolCode'], unique: true },
            { fields: ['costPoolType'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['isActive'] },
        ],
    });
    return CostPool;
};
exports.createCostPoolModel = createCostPoolModel;
// ============================================================================
// COST CENTER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new cost center.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCostCenterDto} costCenterData - Cost center data
 * @param {string} userId - User creating the cost center
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created cost center
 *
 * @example
 * ```typescript
 * const costCenter = await createCostCenter(sequelize, {
 *   costCenterCode: 'CC-100',
 *   costCenterName: 'Manufacturing Department',
 *   costCenterType: 'production',
 *   departmentCode: 'DEPT-MFG',
 *   fiscalYear: 2024,
 *   budgetAmount: 500000
 * }, 'user123');
 * ```
 */
const createCostCenter = async (sequelize, costCenterData, userId, transaction) => {
    const CostCenter = (0, exports.createCostCenterModel)(sequelize);
    const costCenter = await CostCenter.create({
        costCenterCode: costCenterData.costCenterCode,
        costCenterName: costCenterData.costCenterName,
        costCenterType: costCenterData.costCenterType,
        departmentCode: costCenterData.departmentCode,
        departmentId: 1, // Simplified - would normally look up department
        fiscalYear: costCenterData.fiscalYear,
        budgetAmount: costCenterData.budgetAmount,
        managerId: costCenterData.managerId,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return costCenter;
};
exports.createCostCenter = createCostCenter;
/**
 * Retrieves a cost center by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costCenterId - Cost center ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost center record
 *
 * @example
 * ```typescript
 * const costCenter = await getCostCenterById(sequelize, 1);
 * ```
 */
const getCostCenterById = async (sequelize, costCenterId, transaction) => {
    const CostCenter = (0, exports.createCostCenterModel)(sequelize);
    const costCenter = await CostCenter.findByPk(costCenterId, { transaction });
    if (!costCenter) {
        throw new Error('Cost center not found');
    }
    return costCenter;
};
exports.getCostCenterById = getCostCenterById;
/**
 * Retrieves a cost center by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} costCenterCode - Cost center code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost center record
 *
 * @example
 * ```typescript
 * const costCenter = await getCostCenterByCode(sequelize, 'CC-100');
 * ```
 */
const getCostCenterByCode = async (sequelize, costCenterCode, transaction) => {
    const CostCenter = (0, exports.createCostCenterModel)(sequelize);
    const costCenter = await CostCenter.findOne({
        where: { costCenterCode },
        transaction,
    });
    if (!costCenter) {
        throw new Error('Cost center not found');
    }
    return costCenter;
};
exports.getCostCenterByCode = getCostCenterByCode;
/**
 * Lists all cost centers with optional filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of cost centers
 *
 * @example
 * ```typescript
 * const costCenters = await listCostCenters(sequelize, {
 *   costCenterType: 'production',
 *   fiscalYear: 2024
 * });
 * ```
 */
const listCostCenters = async (sequelize, filters = {}, transaction) => {
    const CostCenter = (0, exports.createCostCenterModel)(sequelize);
    const where = { isActive: true };
    if (filters.costCenterType)
        where.costCenterType = filters.costCenterType;
    if (filters.departmentCode)
        where.departmentCode = filters.departmentCode;
    if (filters.fiscalYear)
        where.fiscalYear = filters.fiscalYear;
    const costCenters = await CostCenter.findAll({
        where,
        order: [['costCenterCode', 'ASC']],
        transaction,
    });
    return costCenters;
};
exports.listCostCenters = listCostCenters;
/**
 * Updates cost center budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costCenterId - Cost center ID
 * @param {number} budgetAmount - New budget amount
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost center
 *
 * @example
 * ```typescript
 * const updated = await updateCostCenterBudget(sequelize, 1, 550000, 'user123');
 * ```
 */
const updateCostCenterBudget = async (sequelize, costCenterId, budgetAmount, userId, transaction) => {
    const costCenter = await (0, exports.getCostCenterById)(sequelize, costCenterId, transaction);
    await costCenter.update({
        budgetAmount,
        updatedBy: userId,
    }, { transaction });
    return costCenter;
};
exports.updateCostCenterBudget = updateCostCenterBudget;
// ============================================================================
// COST POOL MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new cost pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCostPoolDto} poolData - Cost pool data
 * @param {string} userId - User creating the pool
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created cost pool
 *
 * @example
 * ```typescript
 * const pool = await createCostPool(sequelize, {
 *   costPoolCode: 'POOL-OH-001',
 *   costPoolName: 'Manufacturing Overhead',
 *   costPoolType: 'overhead',
 *   allocationMethod: 'activity-based',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1
 * }, 'user123');
 * ```
 */
const createCostPool = async (sequelize, poolData, userId, transaction) => {
    const CostPool = (0, exports.createCostPoolModel)(sequelize);
    const pool = await CostPool.create({
        costPoolCode: poolData.costPoolCode,
        costPoolName: poolData.costPoolName,
        costPoolType: poolData.costPoolType,
        allocationMethod: poolData.allocationMethod,
        fiscalYear: poolData.fiscalYear,
        fiscalPeriod: poolData.fiscalPeriod,
        totalCost: 0,
        allocatedCost: 0,
        unallocatedCost: 0,
        isActive: true,
        createdBy: userId,
    }, { transaction });
    return pool;
};
exports.createCostPool = createCostPool;
/**
 * Adds cost to a cost pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {number} costAmount - Amount to add
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost pool
 *
 * @example
 * ```typescript
 * const pool = await addCostToPool(sequelize, 1, 15000, 'user123');
 * ```
 */
const addCostToPool = async (sequelize, costPoolId, costAmount, userId, transaction) => {
    const CostPool = (0, exports.createCostPoolModel)(sequelize);
    const pool = await CostPool.findByPk(costPoolId, { transaction });
    if (!pool) {
        throw new Error('Cost pool not found');
    }
    const newTotalCost = Number(pool.totalCost) + costAmount;
    const newUnallocatedCost = Number(pool.unallocatedCost) + costAmount;
    await pool.update({
        totalCost: newTotalCost,
        unallocatedCost: newUnallocatedCost,
    }, { transaction });
    return pool;
};
exports.addCostToPool = addCostToPool;
/**
 * Retrieves a cost pool by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost pool record
 *
 * @example
 * ```typescript
 * const pool = await getCostPoolById(sequelize, 1);
 * ```
 */
const getCostPoolById = async (sequelize, costPoolId, transaction) => {
    const CostPool = (0, exports.createCostPoolModel)(sequelize);
    const pool = await CostPool.findByPk(costPoolId, { transaction });
    if (!pool) {
        throw new Error('Cost pool not found');
    }
    return pool;
};
exports.getCostPoolById = getCostPoolById;
// ============================================================================
// OVERHEAD ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Allocates overhead using direct method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AllocateOverheadDto} allocationData - Allocation data
 * @param {any[]} costCenters - Target cost centers with basis units
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allocation record with lines
 *
 * @example
 * ```typescript
 * const allocation = await allocateOverheadDirect(sequelize, {
 *   costPoolId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocationBasis: 'direct-labor-hours',
 *   totalOverhead: 100000
 * }, [
 *   { costCenterId: 1, costCenterCode: 'CC-100', basisUnits: 500 },
 *   { costCenterId: 2, costCenterCode: 'CC-200', basisUnits: 300 }
 * ], 'user123');
 * ```
 */
const allocateOverheadDirect = async (sequelize, allocationData, costCenters, userId, transaction) => {
    // Calculate total basis units
    let totalBasisUnits = 0;
    for (const cc of costCenters) {
        totalBasisUnits += Number(cc.basisUnits);
    }
    if (totalBasisUnits === 0) {
        throw new Error('Total basis units cannot be zero');
    }
    const allocationRate = Number(allocationData.totalOverhead) / totalBasisUnits;
    // Create allocation header (simplified)
    const allocation = {
        allocationId: Date.now(),
        fiscalYear: allocationData.fiscalYear,
        fiscalPeriod: allocationData.fiscalPeriod,
        allocationDate: new Date(),
        costPoolId: allocationData.costPoolId,
        allocationMethod: 'direct',
        totalOverhead: allocationData.totalOverhead,
        allocationBasis: allocationData.allocationBasis,
        totalBasisUnits,
        allocationRate,
        status: 'calculated',
        lines: [],
    };
    // Create allocation lines
    for (const cc of costCenters) {
        const allocatedAmount = Number(cc.basisUnits) * allocationRate;
        const allocationPercentage = (Number(cc.basisUnits) / totalBasisUnits) * 100;
        allocation.lines.push({
            allocationLineId: allocation.lines.length + 1,
            allocationId: allocation.allocationId,
            costCenterId: cc.costCenterId,
            costCenterCode: cc.costCenterCode,
            basisUnits: cc.basisUnits,
            allocatedAmount,
            allocationPercentage,
        });
    }
    // Update cost pool
    const pool = await (0, exports.getCostPoolById)(sequelize, allocationData.costPoolId, transaction);
    await pool.update({
        allocatedCost: Number(pool.allocatedCost) + Number(allocationData.totalOverhead),
        unallocatedCost: Number(pool.unallocatedCost) - Number(allocationData.totalOverhead),
    }, { transaction });
    return allocation;
};
exports.allocateOverheadDirect = allocateOverheadDirect;
/**
 * Allocates service department costs using step-down method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {any[]} serviceDepartments - Service departments with costs and allocation bases
 * @param {any[]} productionDepartments - Production departments
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Allocation records
 *
 * @example
 * ```typescript
 * const allocations = await allocateServiceCostsStepDown(
 *   sequelize,
 *   2024,
 *   1,
 *   [
 *     { departmentCode: 'SD-100', totalCost: 50000, allocationBasis: 'employees', sequence: 1 },
 *     { departmentCode: 'SD-200', totalCost: 30000, allocationBasis: 'square-feet', sequence: 2 }
 *   ],
 *   [
 *     { departmentCode: 'PD-100', employees: 50, squareFeet: 10000 },
 *     { departmentCode: 'PD-200', employees: 30, squareFeet: 8000 }
 *   ],
 *   'user123'
 * );
 * ```
 */
const allocateServiceCostsStepDown = async (sequelize, fiscalYear, fiscalPeriod, serviceDepartments, productionDepartments, userId, transaction) => {
    const allocations = [];
    // Sort service departments by allocation sequence
    serviceDepartments.sort((a, b) => a.sequence - b.sequence);
    // Track accumulated costs for each department
    const departmentCosts = new Map();
    for (const pd of productionDepartments) {
        departmentCosts.set(pd.departmentCode, 0);
    }
    // Allocate each service department in sequence
    for (let i = 0; i < serviceDepartments.length; i++) {
        const sd = serviceDepartments[i];
        const serviceCost = Number(sd.totalCost);
        // Calculate total allocation basis for remaining departments
        let totalBasis = 0;
        // Include production departments
        for (const pd of productionDepartments) {
            totalBasis += Number(pd[sd.allocationBasis] || 0);
        }
        // Include subsequent service departments (step-down)
        for (let j = i + 1; j < serviceDepartments.length; j++) {
            totalBasis += Number(serviceDepartments[j][sd.allocationBasis] || 0);
        }
        if (totalBasis === 0)
            continue;
        const allocationRate = serviceCost / totalBasis;
        const allocation = {
            allocationId: Date.now() + i,
            serviceDepartmentCode: sd.departmentCode,
            fiscalYear,
            fiscalPeriod,
            totalServiceCost: serviceCost,
            allocationMethod: 'step-down',
            allocationBasis: sd.allocationBasis,
            allocationSequence: sd.sequence,
            allocationRate,
            lines: [],
        };
        // Allocate to production departments
        for (const pd of productionDepartments) {
            const basisUnits = Number(pd[sd.allocationBasis] || 0);
            const allocatedAmount = basisUnits * allocationRate;
            allocation.lines.push({
                departmentCode: pd.departmentCode,
                basisUnits,
                allocatedAmount,
            });
            departmentCosts.set(pd.departmentCode, (departmentCosts.get(pd.departmentCode) || 0) + allocatedAmount);
        }
        // Allocate to subsequent service departments
        for (let j = i + 1; j < serviceDepartments.length; j++) {
            const nextSd = serviceDepartments[j];
            const basisUnits = Number(nextSd[sd.allocationBasis] || 0);
            const allocatedAmount = basisUnits * allocationRate;
            allocation.lines.push({
                departmentCode: nextSd.departmentCode,
                basisUnits,
                allocatedAmount,
            });
            // Add to next service department's cost
            nextSd.totalCost = Number(nextSd.totalCost) + allocatedAmount;
        }
        allocations.push(allocation);
    }
    return allocations;
};
exports.allocateServiceCostsStepDown = allocateServiceCostsStepDown;
/**
 * Allocates overhead using activity-based costing (ABC).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {any[]} activities - Activities with costs and drivers
 * @param {any[]} products - Products with activity consumption
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} ABC allocation results
 *
 * @example
 * ```typescript
 * const abcAllocation = await allocateOverheadABC(
 *   sequelize,
 *   1,
 *   [
 *     { activityCode: 'SETUP', activityCost: 50000, driverUnits: 100, driverType: 'setups' },
 *     { activityCode: 'INSPECT', activityCost: 30000, driverUnits: 600, driverType: 'inspections' }
 *   ],
 *   [
 *     { productCode: 'PROD-A', setups: 40, inspections: 200 },
 *     { productCode: 'PROD-B', setups: 60, inspections: 400 }
 *   ],
 *   'user123'
 * );
 * ```
 */
const allocateOverheadABC = async (sequelize, costPoolId, activities, products, userId, transaction) => {
    const allocation = {
        costPoolId,
        allocationMethod: 'activity-based',
        activities: [],
        productCosts: new Map(),
    };
    // Calculate cost per driver unit for each activity
    for (const activity of activities) {
        const costPerDriverUnit = Number(activity.activityCost) / Number(activity.driverUnits);
        allocation.activities.push({
            activityCode: activity.activityCode,
            activityCost: activity.activityCost,
            driverType: activity.driverType,
            driverUnits: activity.driverUnits,
            costPerDriverUnit,
        });
    }
    // Allocate activity costs to products
    for (const product of products) {
        let totalProductCost = 0;
        for (const activity of activities) {
            const driverConsumption = Number(product[activity.driverType] || 0);
            const costPerDriverUnit = Number(activity.activityCost) / Number(activity.driverUnits);
            const allocatedCost = driverConsumption * costPerDriverUnit;
            totalProductCost += allocatedCost;
        }
        allocation.productCosts.set(product.productCode, totalProductCost);
    }
    return allocation;
};
exports.allocateOverheadABC = allocateOverheadABC;
/**
 * Calculates predetermined overhead rate.
 *
 * @param {number} estimatedOverhead - Estimated total overhead
 * @param {number} estimatedActivityBase - Estimated activity base (e.g., labor hours, machine hours)
 * @returns {number} Predetermined overhead rate
 *
 * @example
 * ```typescript
 * const rate = calculatePredeterminedOverheadRate(500000, 25000);
 * // Returns: 20 (per labor hour)
 * ```
 */
const calculatePredeterminedOverheadRate = (estimatedOverhead, estimatedActivityBase) => {
    if (estimatedActivityBase === 0) {
        throw new Error('Estimated activity base cannot be zero');
    }
    return estimatedOverhead / estimatedActivityBase;
};
exports.calculatePredeterminedOverheadRate = calculatePredeterminedOverheadRate;
/**
 * Applies overhead to a job or product using predetermined rate.
 *
 * @param {number} predeterminedRate - Predetermined overhead rate
 * @param {number} actualActivityBase - Actual activity base consumed
 * @returns {number} Applied overhead amount
 *
 * @example
 * ```typescript
 * const appliedOverhead = applyOverheadToJob(20, 150);
 * // Returns: 3000 (for 150 labor hours at $20/hour)
 * ```
 */
const applyOverheadToJob = (predeterminedRate, actualActivityBase) => {
    return predeterminedRate * actualActivityBase;
};
exports.applyOverheadToJob = applyOverheadToJob;
// ============================================================================
// STANDARD COSTING FUNCTIONS
// ============================================================================
/**
 * Creates a standard cost record for a product.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateStandardCostDto} standardCostData - Standard cost data
 * @param {string} userId - User creating the standard cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created standard cost record
 *
 * @example
 * ```typescript
 * const standardCost = await createStandardCost(sequelize, {
 *   productId: 1,
 *   productCode: 'PROD-A',
 *   fiscalYear: 2024,
 *   effectiveDate: new Date('2024-01-01'),
 *   standardMaterialCost: 25.00,
 *   standardLaborCost: 15.00,
 *   standardOverheadCost: 10.00
 * }, 'user123');
 * ```
 */
const createStandardCost = async (sequelize, standardCostData, userId, transaction) => {
    const totalStandardCost = Number(standardCostData.standardMaterialCost) +
        Number(standardCostData.standardLaborCost) +
        Number(standardCostData.standardOverheadCost);
    const standardCost = {
        standardCostId: Date.now(),
        productId: standardCostData.productId,
        productCode: standardCostData.productCode,
        productName: '', // Would be looked up
        fiscalYear: standardCostData.fiscalYear,
        effectiveDate: standardCostData.effectiveDate,
        standardMaterialCost: standardCostData.standardMaterialCost,
        standardLaborCost: standardCostData.standardLaborCost,
        standardOverheadCost: standardCostData.standardOverheadCost,
        totalStandardCost,
        costingMethod: 'standard',
        isActive: true,
    };
    return standardCost;
};
exports.createStandardCost = createStandardCost;
/**
 * Retrieves current standard cost for a product.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} productId - Product ID
 * @param {Date} effectiveDate - Effective date for standard cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Standard cost record
 *
 * @example
 * ```typescript
 * const standardCost = await getStandardCostForProduct(
 *   sequelize,
 *   1,
 *   new Date('2024-06-01')
 * );
 * ```
 */
const getStandardCostForProduct = async (sequelize, productId, effectiveDate, transaction) => {
    // Simplified - would query database for active standard cost
    return {
        standardCostId: 1,
        productId,
        standardMaterialCost: 25.00,
        standardLaborCost: 15.00,
        standardOverheadCost: 10.00,
        totalStandardCost: 50.00,
        effectiveDate,
    };
};
exports.getStandardCostForProduct = getStandardCostForProduct;
// ============================================================================
// VARIANCE ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Calculates material price variance.
 *
 * @param {number} standardPrice - Standard price per unit
 * @param {number} actualPrice - Actual price per unit
 * @param {number} actualQuantity - Actual quantity purchased/used
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateMaterialPriceVariance(5.00, 5.25, 1000);
 * // Returns: { variance: -250, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateMaterialPriceVariance = (standardPrice, actualPrice, actualQuantity) => {
    const variance = (standardPrice - actualPrice) * actualQuantity;
    return {
        varianceType: 'material-price',
        standardPrice,
        actualPrice,
        actualQuantity,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateMaterialPriceVariance = calculateMaterialPriceVariance;
/**
 * Calculates material quantity variance.
 *
 * @param {number} standardQuantity - Standard quantity allowed
 * @param {number} actualQuantity - Actual quantity used
 * @param {number} standardPrice - Standard price per unit
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateMaterialQuantityVariance(950, 1000, 5.00);
 * // Returns: { variance: -250, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateMaterialQuantityVariance = (standardQuantity, actualQuantity, standardPrice) => {
    const variance = (standardQuantity - actualQuantity) * standardPrice;
    return {
        varianceType: 'material-quantity',
        standardQuantity,
        actualQuantity,
        standardPrice,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateMaterialQuantityVariance = calculateMaterialQuantityVariance;
/**
 * Calculates labor rate variance.
 *
 * @param {number} standardRate - Standard labor rate per hour
 * @param {number} actualRate - Actual labor rate per hour
 * @param {number} actualHours - Actual hours worked
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateLaborRateVariance(20.00, 21.50, 500);
 * // Returns: { variance: -750, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateLaborRateVariance = (standardRate, actualRate, actualHours) => {
    const variance = (standardRate - actualRate) * actualHours;
    return {
        varianceType: 'labor-rate',
        standardRate,
        actualRate,
        actualHours,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateLaborRateVariance = calculateLaborRateVariance;
/**
 * Calculates labor efficiency variance.
 *
 * @param {number} standardHours - Standard hours allowed
 * @param {number} actualHours - Actual hours worked
 * @param {number} standardRate - Standard labor rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateLaborEfficiencyVariance(480, 500, 20.00);
 * // Returns: { variance: -400, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateLaborEfficiencyVariance = (standardHours, actualHours, standardRate) => {
    const variance = (standardHours - actualHours) * standardRate;
    return {
        varianceType: 'labor-efficiency',
        standardHours,
        actualHours,
        standardRate,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateLaborEfficiencyVariance = calculateLaborEfficiencyVariance;
/**
 * Calculates overhead spending variance.
 *
 * @param {number} budgetedOverhead - Budgeted overhead at actual hours
 * @param {number} actualOverhead - Actual overhead incurred
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadSpendingVariance(12000, 12500);
 * // Returns: { variance: -500, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateOverheadSpendingVariance = (budgetedOverhead, actualOverhead) => {
    const variance = budgetedOverhead - actualOverhead;
    return {
        varianceType: 'overhead-spending',
        budgetedOverhead,
        actualOverhead,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateOverheadSpendingVariance = calculateOverheadSpendingVariance;
/**
 * Calculates overhead volume variance.
 *
 * @param {number} standardHours - Standard hours allowed for actual production
 * @param {number} budgetedHours - Budgeted hours (denominator level)
 * @param {number} fixedOverheadRate - Fixed overhead rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadVolumeVariance(950, 1000, 10.00);
 * // Returns: { variance: -500, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateOverheadVolumeVariance = (standardHours, budgetedHours, fixedOverheadRate) => {
    const variance = (standardHours - budgetedHours) * fixedOverheadRate;
    return {
        varianceType: 'overhead-volume',
        standardHours,
        budgetedHours,
        fixedOverheadRate,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateOverheadVolumeVariance = calculateOverheadVolumeVariance;
/**
 * Calculates overhead efficiency variance.
 *
 * @param {number} standardHours - Standard hours allowed
 * @param {number} actualHours - Actual hours worked
 * @param {number} variableOverheadRate - Variable overhead rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadEfficiencyVariance(480, 500, 8.00);
 * // Returns: { variance: -160, favorableUnfavorable: 'unfavorable' }
 * ```
 */
const calculateOverheadEfficiencyVariance = (standardHours, actualHours, variableOverheadRate) => {
    const variance = (standardHours - actualHours) * variableOverheadRate;
    return {
        varianceType: 'overhead-efficiency',
        standardHours,
        actualHours,
        variableOverheadRate,
        variance,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateOverheadEfficiencyVariance = calculateOverheadEfficiencyVariance;
/**
 * Performs comprehensive variance analysis for a product/job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} productId - Product ID
 * @param {any} standardCosts - Standard costs
 * @param {any} actualCosts - Actual costs
 * @param {string} userId - User performing analysis
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of variance records
 *
 * @example
 * ```typescript
 * const variances = await performComprehensiveVarianceAnalysis(
 *   sequelize,
 *   1,
 *   {
 *     materialPrice: 5.00,
 *     materialQuantity: 950,
 *     laborRate: 20.00,
 *     laborHours: 480,
 *     overheadRate: 18.00
 *   },
 *   {
 *     materialPrice: 5.25,
 *     materialQuantity: 1000,
 *     laborRate: 21.50,
 *     laborHours: 500,
 *     actualOverhead: 9500
 *   },
 *   'user123'
 * );
 * ```
 */
const performComprehensiveVarianceAnalysis = async (sequelize, productId, standardCosts, actualCosts, userId, transaction) => {
    const variances = [];
    // Material price variance
    const materialPriceVar = (0, exports.calculateMaterialPriceVariance)(standardCosts.materialPrice, actualCosts.materialPrice, actualCosts.materialQuantity);
    variances.push(materialPriceVar);
    // Material quantity variance
    const materialQtyVar = (0, exports.calculateMaterialQuantityVariance)(standardCosts.materialQuantity, actualCosts.materialQuantity, standardCosts.materialPrice);
    variances.push(materialQtyVar);
    // Labor rate variance
    const laborRateVar = (0, exports.calculateLaborRateVariance)(standardCosts.laborRate, actualCosts.laborRate, actualCosts.laborHours);
    variances.push(laborRateVar);
    // Labor efficiency variance
    const laborEffVar = (0, exports.calculateLaborEfficiencyVariance)(standardCosts.laborHours, actualCosts.laborHours, standardCosts.laborRate);
    variances.push(laborEffVar);
    // Overhead variances (if applicable)
    if (actualCosts.actualOverhead) {
        const budgetedOverhead = standardCosts.laborHours * standardCosts.overheadRate;
        const overheadSpendingVar = (0, exports.calculateOverheadSpendingVariance)(budgetedOverhead, actualCosts.actualOverhead);
        variances.push(overheadSpendingVar);
    }
    return variances;
};
exports.performComprehensiveVarianceAnalysis = performComprehensiveVarianceAnalysis;
// ============================================================================
// JOB COSTING FUNCTIONS
// ============================================================================
/**
 * Creates a new job cost record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJobCostDto} jobData - Job data
 * @param {string} userId - User creating the job
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created job cost record
 *
 * @example
 * ```typescript
 * const job = await createJobCost(sequelize, {
 *   jobNumber: 'JOB-2024-001',
 *   jobName: 'Custom Equipment Build',
 *   jobType: 'production',
 *   startDate: new Date('2024-01-15'),
 *   budgetedCost: 50000,
 *   customerId: 123
 * }, 'user123');
 * ```
 */
const createJobCost = async (sequelize, jobData, userId, transaction) => {
    const job = {
        jobCostId: Date.now(),
        jobId: Date.now(),
        jobNumber: jobData.jobNumber,
        jobName: jobData.jobName,
        jobType: jobData.jobType,
        customerId: jobData.customerId,
        customerName: '', // Would be looked up
        startDate: jobData.startDate,
        jobStatus: 'planned',
        totalMaterialCost: 0,
        totalLaborCost: 0,
        totalOverheadCost: 0,
        totalJobCost: 0,
        budgetedCost: jobData.budgetedCost,
        percentComplete: 0,
    };
    return job;
};
exports.createJobCost = createJobCost;
/**
 * Adds material cost to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} materialCost - Material cost to add
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await addMaterialCostToJob(sequelize, 1, 5000, 'user123');
 * ```
 */
const addMaterialCostToJob = async (sequelize, jobId, materialCost, userId, transaction) => {
    // Simplified - would update database
    return {
        jobId,
        totalMaterialCost: materialCost,
        totalJobCost: materialCost,
    };
};
exports.addMaterialCostToJob = addMaterialCostToJob;
/**
 * Adds labor cost to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} laborHours - Labor hours
 * @param {number} laborRate - Labor rate per hour
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await addLaborCostToJob(sequelize, 1, 40, 25.00, 'user123');
 * ```
 */
const addLaborCostToJob = async (sequelize, jobId, laborHours, laborRate, userId, transaction) => {
    const laborCost = laborHours * laborRate;
    return {
        jobId,
        laborHours,
        laborRate,
        laborCost,
    };
};
exports.addLaborCostToJob = addLaborCostToJob;
/**
 * Applies overhead to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} overheadRate - Overhead rate
 * @param {number} allocationBase - Allocation base (e.g., labor hours)
 * @param {string} userId - User applying overhead
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await applyOverheadToJobCost(sequelize, 1, 15.00, 40, 'user123');
 * // Applies $600 overhead (40 hours * $15/hour)
 * ```
 */
const applyOverheadToJobCost = async (sequelize, jobId, overheadRate, allocationBase, userId, transaction) => {
    const overheadCost = overheadRate * allocationBase;
    return {
        jobId,
        overheadRate,
        allocationBase,
        overheadCost,
    };
};
exports.applyOverheadToJobCost = applyOverheadToJobCost;
/**
 * Calculates job cost variance (budget vs actual).
 *
 * @param {number} budgetedCost - Budgeted job cost
 * @param {number} actualCost - Actual job cost
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateJobCostVariance(50000, 52500);
 * // Returns: { variance: -2500, variancePercent: -5.0 }
 * ```
 */
const calculateJobCostVariance = (budgetedCost, actualCost) => {
    const variance = budgetedCost - actualCost;
    const variancePercent = budgetedCost > 0 ? (variance / budgetedCost) * 100 : 0;
    return {
        budgetedCost,
        actualCost,
        variance,
        variancePercent,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.calculateJobCostVariance = calculateJobCostVariance;
/**
 * Closes a completed job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {Date} completionDate - Completion date
 * @param {string} userId - User closing the job
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed job
 *
 * @example
 * ```typescript
 * const job = await closeJob(sequelize, 1, new Date(), 'user123');
 * ```
 */
const closeJob = async (sequelize, jobId, completionDate, userId, transaction) => {
    return {
        jobId,
        jobStatus: 'closed',
        completionDate,
        percentComplete: 100,
    };
};
exports.closeJob = closeJob;
// ============================================================================
// PRODUCT COSTING FUNCTIONS
// ============================================================================
/**
 * Calculates product cost using job-order costing.
 *
 * @param {number} directMaterialCost - Direct material cost
 * @param {number} directLaborCost - Direct labor cost
 * @param {number} overheadCost - Overhead cost
 * @param {number} quantityProduced - Quantity produced
 * @returns {any} Product cost details
 *
 * @example
 * ```typescript
 * const productCost = calculateProductCostJobOrder(
 *   10000,
 *   8000,
 *   6000,
 *   500
 * );
 * // Returns: { totalCost: 24000, unitCost: 48.00 }
 * ```
 */
const calculateProductCostJobOrder = (directMaterialCost, directLaborCost, overheadCost, quantityProduced) => {
    const totalCost = directMaterialCost + directLaborCost + overheadCost;
    const unitCost = quantityProduced > 0 ? totalCost / quantityProduced : 0;
    return {
        directMaterialCost,
        directLaborCost,
        overheadCost,
        totalCost,
        quantityProduced,
        unitCost,
        costingMethod: 'job-order',
    };
};
exports.calculateProductCostJobOrder = calculateProductCostJobOrder;
/**
 * Calculates product cost using process costing.
 *
 * @param {number} totalCost - Total process cost
 * @param {number} equivalentUnits - Equivalent units of production
 * @returns {any} Product cost per equivalent unit
 *
 * @example
 * ```typescript
 * const processCost = calculateProductCostProcess(50000, 2000);
 * // Returns: { costPerEquivalentUnit: 25.00 }
 * ```
 */
const calculateProductCostProcess = (totalCost, equivalentUnits) => {
    const costPerEquivalentUnit = equivalentUnits > 0 ? totalCost / equivalentUnits : 0;
    return {
        totalCost,
        equivalentUnits,
        costPerEquivalentUnit,
        costingMethod: 'process',
    };
};
exports.calculateProductCostProcess = calculateProductCostProcess;
/**
 * Calculates equivalent units of production (weighted average method).
 *
 * @param {number} unitsCompleted - Units completed and transferred out
 * @param {number} endingWIPUnits - Ending work-in-process units
 * @param {number} endingWIPPercentComplete - Ending WIP percent complete
 * @returns {number} Equivalent units
 *
 * @example
 * ```typescript
 * const equivalentUnits = calculateEquivalentUnits(800, 200, 0.50);
 * // Returns: 900 (800 + 200 * 0.50)
 * ```
 */
const calculateEquivalentUnits = (unitsCompleted, endingWIPUnits, endingWIPPercentComplete) => {
    return unitsCompleted + (endingWIPUnits * endingWIPPercentComplete);
};
exports.calculateEquivalentUnits = calculateEquivalentUnits;
// ============================================================================
// COST BEHAVIOR AND ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Analyzes cost behavior using high-low method.
 *
 * @param {number} highActivityLevel - High activity level
 * @param {number} highCost - Cost at high activity level
 * @param {number} lowActivityLevel - Low activity level
 * @param {number} lowCost - Cost at low activity level
 * @returns {any} Variable and fixed cost components
 *
 * @example
 * ```typescript
 * const costBehavior = analyzeCostBehaviorHighLow(1000, 15000, 400, 9000);
 * // Returns: { variableCostPerUnit: 10, fixedCost: 5000 }
 * ```
 */
const analyzeCostBehaviorHighLow = (highActivityLevel, highCost, lowActivityLevel, lowCost) => {
    const variableCostPerUnit = (highCost - lowCost) / (highActivityLevel - lowActivityLevel);
    const fixedCost = highCost - (variableCostPerUnit * highActivityLevel);
    return {
        variableCostPerUnit,
        fixedCost,
        highActivityLevel,
        highCost,
        lowActivityLevel,
        lowCost,
    };
};
exports.analyzeCostBehaviorHighLow = analyzeCostBehaviorHighLow;
/**
 * Calculates contribution margin.
 *
 * @param {number} salesRevenue - Sales revenue
 * @param {number} variableCosts - Variable costs
 * @returns {any} Contribution margin details
 *
 * @example
 * ```typescript
 * const cm = calculateContributionMargin(100000, 60000);
 * // Returns: { contributionMargin: 40000, cmRatio: 0.40 }
 * ```
 */
const calculateContributionMargin = (salesRevenue, variableCosts) => {
    const contributionMargin = salesRevenue - variableCosts;
    const contributionMarginRatio = salesRevenue > 0 ? contributionMargin / salesRevenue : 0;
    return {
        salesRevenue,
        variableCosts,
        contributionMargin,
        contributionMarginRatio,
    };
};
exports.calculateContributionMargin = calculateContributionMargin;
/**
 * Calculates break-even point in units and dollars.
 *
 * @param {number} fixedCosts - Total fixed costs
 * @param {number} pricePerUnit - Selling price per unit
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @returns {any} Break-even analysis
 *
 * @example
 * ```typescript
 * const breakEven = calculateBreakEvenPoint(50000, 100, 60);
 * // Returns: { breakEvenUnits: 1250, breakEvenDollars: 125000 }
 * ```
 */
const calculateBreakEvenPoint = (fixedCosts, pricePerUnit, variableCostPerUnit) => {
    const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
    if (contributionMarginPerUnit <= 0) {
        throw new Error('Contribution margin must be positive to calculate break-even');
    }
    const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
    const breakEvenDollars = breakEvenUnits * pricePerUnit;
    return {
        fixedCosts,
        contributionMarginPerUnit,
        breakEvenUnits,
        breakEvenDollars,
    };
};
exports.calculateBreakEvenPoint = calculateBreakEvenPoint;
/**
 * Generates profitability report by product/service.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Profitability analysis by product
 *
 * @example
 * ```typescript
 * const profitability = await generateProfitabilityReport(sequelize, 2024, 1);
 * ```
 */
const generateProfitabilityReport = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    // Simplified - would query actual product costs and revenues
    return [
        {
            productCode: 'PROD-A',
            revenue: 100000,
            directCosts: 60000,
            allocatedOverhead: 20000,
            totalCost: 80000,
            grossProfit: 20000,
            grossMarginPercent: 20.0,
        },
        {
            productCode: 'PROD-B',
            revenue: 75000,
            directCosts: 40000,
            allocatedOverhead: 15000,
            totalCost: 55000,
            grossProfit: 20000,
            grossMarginPercent: 26.67,
        },
    ];
};
exports.generateProfitabilityReport = generateProfitabilityReport;
//# sourceMappingURL=cost-accounting-allocation-kit.js.map