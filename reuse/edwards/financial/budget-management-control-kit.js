"use strict";
/**
 * LOC: EDWBUDG001
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Budget planning services
 *   - Budget control and monitoring
 *   - Encumbrance tracking
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
exports.createEncumbranceModel = exports.createBudgetTransferModel = exports.createBudgetAmendmentModel = exports.createBudgetAllocationModel = exports.createBudgetDefinitionModel = exports.CheckFundsAvailabilityDto = exports.CreateEncumbranceDto = exports.CreateBudgetTransferDto = exports.CreateBudgetAmendmentDto = exports.CreateBudgetAllocationDto = exports.CreateBudgetDto = void 0;
exports.createBudget = createBudget;
exports.updateBudget = updateBudget;
exports.getBudgetById = getBudgetById;
exports.getBudgetByCode = getBudgetByCode;
exports.listBudgetsByYear = listBudgetsByYear;
exports.approveBudget = approveBudget;
exports.activateBudget = activateBudget;
exports.closeBudget = closeBudget;
exports.deleteBudget = deleteBudget;
exports.copyBudget = copyBudget;
exports.createBudgetAllocation = createBudgetAllocation;
exports.updateBudgetAllocation = updateBudgetAllocation;
exports.getBudgetAllocations = getBudgetAllocations;
exports.getAllocationByAccount = getAllocationByAccount;
exports.lockBudgetAllocations = lockBudgetAllocations;
exports.unlockBudgetAllocations = unlockBudgetAllocations;
exports.distributeBudgetEvenly = distributeBudgetEvenly;
exports.calculateTotalAllocated = calculateTotalAllocated;
exports.deleteBudgetAllocation = deleteBudgetAllocation;
exports.getAllocationsByDepartment = getAllocationsByDepartment;
exports.createBudgetAmendment = createBudgetAmendment;
exports.approveBudgetAmendment = approveBudgetAmendment;
exports.postBudgetAmendment = postBudgetAmendment;
exports.rejectBudgetAmendment = rejectBudgetAmendment;
exports.createBudgetTransfer = createBudgetTransfer;
exports.approveBudgetTransfer = approveBudgetTransfer;
exports.postBudgetTransfer = postBudgetTransfer;
exports.getBudgetAmendments = getBudgetAmendments;
exports.getBudgetTransfers = getBudgetTransfers;
exports.createEncumbrance = createEncumbrance;
exports.liquidateEncumbrance = liquidateEncumbrance;
exports.cancelEncumbrance = cancelEncumbrance;
exports.getEncumbrances = getEncumbrances;
exports.calculateTotalEncumbered = calculateTotalEncumbered;
exports.checkFundsAvailability = checkFundsAvailability;
exports.getEncumbranceByReference = getEncumbranceByReference;
exports.updateEncumbranceAmount = updateEncumbranceAmount;
exports.generateEncumbranceReport = generateEncumbranceReport;
exports.generateBudgetVsActualReport = generateBudgetVsActualReport;
exports.performVarianceAnalysis = performVarianceAnalysis;
exports.calculateBudgetUtilization = calculateBudgetUtilization;
exports.getAccountsOverBudget = getAccountsOverBudget;
exports.generateBudgetMonitoringDashboard = generateBudgetMonitoringDashboard;
/**
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 * Locator: WC-EDW-BUDG-001
 * Purpose: Comprehensive Budget Management and Control - JD Edwards EnterpriseOne-level budget operations, encumbrance, budget vs actual
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Budget Planning Services, Budget Control, Encumbrance Tracking, Variance Analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for budget creation, allocation, amendments, transfers, encumbrance, commitments, budget vs actual, variance analysis, budget monitoring, supplemental budgets
 *
 * LLM Context: Enterprise-grade budget management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive budget planning, budget allocation, budget control, encumbrance accounting, commitment tracking,
 * budget vs actual analysis, budget amendments, supplemental budgets, budget transfers, position budgeting, project budgeting,
 * variance analysis, budget monitoring, budget approval workflows, and multi-year budgeting.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateBudgetDto = (() => {
    var _a;
    let _budgetCode_decorators;
    let _budgetCode_initializers = [];
    let _budgetCode_extraInitializers = [];
    let _budgetName_decorators;
    let _budgetName_initializers = [];
    let _budgetName_extraInitializers = [];
    let _budgetType_decorators;
    let _budgetType_initializers = [];
    let _budgetType_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _totalBudgetAmount_decorators;
    let _totalBudgetAmount_initializers = [];
    let _totalBudgetAmount_extraInitializers = [];
    return _a = class CreateBudgetDto {
            constructor() {
                this.budgetCode = __runInitializers(this, _budgetCode_initializers, void 0);
                this.budgetName = (__runInitializers(this, _budgetCode_extraInitializers), __runInitializers(this, _budgetName_initializers, void 0));
                this.budgetType = (__runInitializers(this, _budgetName_extraInitializers), __runInitializers(this, _budgetType_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _budgetType_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.startDate = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.totalBudgetAmount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _totalBudgetAmount_initializers, void 0));
                __runInitializers(this, _totalBudgetAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _budgetCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget code', example: 'FY2024-OPS' })];
            _budgetName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget name', example: 'FY2024 Operating Budget' })];
            _budgetType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget type', enum: ['operating', 'capital', 'project', 'position'] })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year', example: 2024 })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget start date', example: '2024-01-01' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget end date', example: '2024-12-31' })];
            _totalBudgetAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget amount' })];
            __esDecorate(null, null, _budgetCode_decorators, { kind: "field", name: "budgetCode", static: false, private: false, access: { has: obj => "budgetCode" in obj, get: obj => obj.budgetCode, set: (obj, value) => { obj.budgetCode = value; } }, metadata: _metadata }, _budgetCode_initializers, _budgetCode_extraInitializers);
            __esDecorate(null, null, _budgetName_decorators, { kind: "field", name: "budgetName", static: false, private: false, access: { has: obj => "budgetName" in obj, get: obj => obj.budgetName, set: (obj, value) => { obj.budgetName = value; } }, metadata: _metadata }, _budgetName_initializers, _budgetName_extraInitializers);
            __esDecorate(null, null, _budgetType_decorators, { kind: "field", name: "budgetType", static: false, private: false, access: { has: obj => "budgetType" in obj, get: obj => obj.budgetType, set: (obj, value) => { obj.budgetType = value; } }, metadata: _metadata }, _budgetType_initializers, _budgetType_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _totalBudgetAmount_decorators, { kind: "field", name: "totalBudgetAmount", static: false, private: false, access: { has: obj => "totalBudgetAmount" in obj, get: obj => obj.totalBudgetAmount, set: (obj, value) => { obj.totalBudgetAmount = value; } }, metadata: _metadata }, _totalBudgetAmount_initializers, _totalBudgetAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetDto = CreateBudgetDto;
let CreateBudgetAllocationDto = (() => {
    var _a;
    let _budgetId_decorators;
    let _budgetId_initializers = [];
    let _budgetId_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _allocatedAmount_decorators;
    let _allocatedAmount_initializers = [];
    let _allocatedAmount_extraInitializers = [];
    let _organizationCode_decorators;
    let _organizationCode_initializers = [];
    let _organizationCode_extraInitializers = [];
    let _departmentCode_decorators;
    let _departmentCode_initializers = [];
    let _departmentCode_extraInitializers = [];
    return _a = class CreateBudgetAllocationDto {
            constructor() {
                this.budgetId = __runInitializers(this, _budgetId_initializers, void 0);
                this.accountId = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.allocatedAmount = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _allocatedAmount_initializers, void 0));
                this.organizationCode = (__runInitializers(this, _allocatedAmount_extraInitializers), __runInitializers(this, _organizationCode_initializers, void 0));
                this.departmentCode = (__runInitializers(this, _organizationCode_extraInitializers), __runInitializers(this, _departmentCode_initializers, void 0));
                __runInitializers(this, _departmentCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _budgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget ID' })];
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account ID' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _allocatedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocated amount' })];
            _organizationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization code', required: false })];
            _departmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code', required: false })];
            __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: obj => "budgetId" in obj, get: obj => obj.budgetId, set: (obj, value) => { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _allocatedAmount_decorators, { kind: "field", name: "allocatedAmount", static: false, private: false, access: { has: obj => "allocatedAmount" in obj, get: obj => obj.allocatedAmount, set: (obj, value) => { obj.allocatedAmount = value; } }, metadata: _metadata }, _allocatedAmount_initializers, _allocatedAmount_extraInitializers);
            __esDecorate(null, null, _organizationCode_decorators, { kind: "field", name: "organizationCode", static: false, private: false, access: { has: obj => "organizationCode" in obj, get: obj => obj.organizationCode, set: (obj, value) => { obj.organizationCode = value; } }, metadata: _metadata }, _organizationCode_initializers, _organizationCode_extraInitializers);
            __esDecorate(null, null, _departmentCode_decorators, { kind: "field", name: "departmentCode", static: false, private: false, access: { has: obj => "departmentCode" in obj, get: obj => obj.departmentCode, set: (obj, value) => { obj.departmentCode = value; } }, metadata: _metadata }, _departmentCode_initializers, _departmentCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetAllocationDto = CreateBudgetAllocationDto;
let CreateBudgetAmendmentDto = (() => {
    var _a;
    let _budgetId_decorators;
    let _budgetId_initializers = [];
    let _budgetId_extraInitializers = [];
    let _amendmentType_decorators;
    let _amendmentType_initializers = [];
    let _amendmentType_extraInitializers = [];
    let _amendmentAmount_decorators;
    let _amendmentAmount_initializers = [];
    let _amendmentAmount_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    return _a = class CreateBudgetAmendmentDto {
            constructor() {
                this.budgetId = __runInitializers(this, _budgetId_initializers, void 0);
                this.amendmentType = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _amendmentType_initializers, void 0));
                this.amendmentAmount = (__runInitializers(this, _amendmentType_extraInitializers), __runInitializers(this, _amendmentAmount_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _amendmentAmount_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.justification = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                __runInitializers(this, _justification_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _budgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget ID' })];
            _amendmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment type', enum: ['increase', 'decrease', 'reallocation', 'supplemental'] })];
            _amendmentAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment amount' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' })];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' })];
            __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: obj => "budgetId" in obj, get: obj => obj.budgetId, set: (obj, value) => { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
            __esDecorate(null, null, _amendmentType_decorators, { kind: "field", name: "amendmentType", static: false, private: false, access: { has: obj => "amendmentType" in obj, get: obj => obj.amendmentType, set: (obj, value) => { obj.amendmentType = value; } }, metadata: _metadata }, _amendmentType_initializers, _amendmentType_extraInitializers);
            __esDecorate(null, null, _amendmentAmount_decorators, { kind: "field", name: "amendmentAmount", static: false, private: false, access: { has: obj => "amendmentAmount" in obj, get: obj => obj.amendmentAmount, set: (obj, value) => { obj.amendmentAmount = value; } }, metadata: _metadata }, _amendmentAmount_initializers, _amendmentAmount_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetAmendmentDto = CreateBudgetAmendmentDto;
let CreateBudgetTransferDto = (() => {
    var _a;
    let _fromBudgetId_decorators;
    let _fromBudgetId_initializers = [];
    let _fromBudgetId_extraInitializers = [];
    let _fromAccountCode_decorators;
    let _fromAccountCode_initializers = [];
    let _fromAccountCode_extraInitializers = [];
    let _toBudgetId_decorators;
    let _toBudgetId_initializers = [];
    let _toBudgetId_extraInitializers = [];
    let _toAccountCode_decorators;
    let _toAccountCode_initializers = [];
    let _toAccountCode_extraInitializers = [];
    let _transferAmount_decorators;
    let _transferAmount_initializers = [];
    let _transferAmount_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class CreateBudgetTransferDto {
            constructor() {
                this.fromBudgetId = __runInitializers(this, _fromBudgetId_initializers, void 0);
                this.fromAccountCode = (__runInitializers(this, _fromBudgetId_extraInitializers), __runInitializers(this, _fromAccountCode_initializers, void 0));
                this.toBudgetId = (__runInitializers(this, _fromAccountCode_extraInitializers), __runInitializers(this, _toBudgetId_initializers, void 0));
                this.toAccountCode = (__runInitializers(this, _toBudgetId_extraInitializers), __runInitializers(this, _toAccountCode_initializers, void 0));
                this.transferAmount = (__runInitializers(this, _toAccountCode_extraInitializers), __runInitializers(this, _transferAmount_initializers, void 0));
                this.reason = (__runInitializers(this, _transferAmount_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fromBudgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From budget ID' })];
            _fromAccountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'From account code' })];
            _toBudgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To budget ID' })];
            _toAccountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'To account code' })];
            _transferAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer amount' })];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer reason' })];
            __esDecorate(null, null, _fromBudgetId_decorators, { kind: "field", name: "fromBudgetId", static: false, private: false, access: { has: obj => "fromBudgetId" in obj, get: obj => obj.fromBudgetId, set: (obj, value) => { obj.fromBudgetId = value; } }, metadata: _metadata }, _fromBudgetId_initializers, _fromBudgetId_extraInitializers);
            __esDecorate(null, null, _fromAccountCode_decorators, { kind: "field", name: "fromAccountCode", static: false, private: false, access: { has: obj => "fromAccountCode" in obj, get: obj => obj.fromAccountCode, set: (obj, value) => { obj.fromAccountCode = value; } }, metadata: _metadata }, _fromAccountCode_initializers, _fromAccountCode_extraInitializers);
            __esDecorate(null, null, _toBudgetId_decorators, { kind: "field", name: "toBudgetId", static: false, private: false, access: { has: obj => "toBudgetId" in obj, get: obj => obj.toBudgetId, set: (obj, value) => { obj.toBudgetId = value; } }, metadata: _metadata }, _toBudgetId_initializers, _toBudgetId_extraInitializers);
            __esDecorate(null, null, _toAccountCode_decorators, { kind: "field", name: "toAccountCode", static: false, private: false, access: { has: obj => "toAccountCode" in obj, get: obj => obj.toAccountCode, set: (obj, value) => { obj.toAccountCode = value; } }, metadata: _metadata }, _toAccountCode_initializers, _toAccountCode_extraInitializers);
            __esDecorate(null, null, _transferAmount_decorators, { kind: "field", name: "transferAmount", static: false, private: false, access: { has: obj => "transferAmount" in obj, get: obj => obj.transferAmount, set: (obj, value) => { obj.transferAmount = value; } }, metadata: _metadata }, _transferAmount_initializers, _transferAmount_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetTransferDto = CreateBudgetTransferDto;
let CreateEncumbranceDto = (() => {
    var _a;
    let _budgetId_decorators;
    let _budgetId_initializers = [];
    let _budgetId_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _encumbranceType_decorators;
    let _encumbranceType_initializers = [];
    let _encumbranceType_extraInitializers = [];
    let _encumbranceAmount_decorators;
    let _encumbranceAmount_initializers = [];
    let _encumbranceAmount_extraInitializers = [];
    let _referenceDocument_decorators;
    let _referenceDocument_initializers = [];
    let _referenceDocument_extraInitializers = [];
    return _a = class CreateEncumbranceDto {
            constructor() {
                this.budgetId = __runInitializers(this, _budgetId_initializers, void 0);
                this.accountId = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
                this.encumbranceType = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _encumbranceType_initializers, void 0));
                this.encumbranceAmount = (__runInitializers(this, _encumbranceType_extraInitializers), __runInitializers(this, _encumbranceAmount_initializers, void 0));
                this.referenceDocument = (__runInitializers(this, _encumbranceAmount_extraInitializers), __runInitializers(this, _referenceDocument_initializers, void 0));
                __runInitializers(this, _referenceDocument_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _budgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget ID' })];
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account ID' })];
            _encumbranceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Encumbrance type', enum: ['purchase_order', 'contract', 'requisition'] })];
            _encumbranceAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Encumbrance amount' })];
            _referenceDocument_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference document number' })];
            __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: obj => "budgetId" in obj, get: obj => obj.budgetId, set: (obj, value) => { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _encumbranceType_decorators, { kind: "field", name: "encumbranceType", static: false, private: false, access: { has: obj => "encumbranceType" in obj, get: obj => obj.encumbranceType, set: (obj, value) => { obj.encumbranceType = value; } }, metadata: _metadata }, _encumbranceType_initializers, _encumbranceType_extraInitializers);
            __esDecorate(null, null, _encumbranceAmount_decorators, { kind: "field", name: "encumbranceAmount", static: false, private: false, access: { has: obj => "encumbranceAmount" in obj, get: obj => obj.encumbranceAmount, set: (obj, value) => { obj.encumbranceAmount = value; } }, metadata: _metadata }, _encumbranceAmount_initializers, _encumbranceAmount_extraInitializers);
            __esDecorate(null, null, _referenceDocument_decorators, { kind: "field", name: "referenceDocument", static: false, private: false, access: { has: obj => "referenceDocument" in obj, get: obj => obj.referenceDocument, set: (obj, value) => { obj.referenceDocument = value; } }, metadata: _metadata }, _referenceDocument_initializers, _referenceDocument_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEncumbranceDto = CreateEncumbranceDto;
let CheckFundsAvailabilityDto = (() => {
    var _a;
    let _budgetId_decorators;
    let _budgetId_initializers = [];
    let _budgetId_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _checkDate_decorators;
    let _checkDate_initializers = [];
    let _checkDate_extraInitializers = [];
    return _a = class CheckFundsAvailabilityDto {
            constructor() {
                this.budgetId = __runInitializers(this, _budgetId_initializers, void 0);
                this.accountId = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
                this.amount = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.checkDate = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _checkDate_initializers, void 0));
                __runInitializers(this, _checkDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _budgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget ID' })];
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account ID' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount to check' })];
            _checkDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check date' })];
            __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: obj => "budgetId" in obj, get: obj => obj.budgetId, set: (obj, value) => { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _checkDate_decorators, { kind: "field", name: "checkDate", static: false, private: false, access: { has: obj => "checkDate" in obj, get: obj => obj.checkDate, set: (obj, value) => { obj.checkDate = value; } }, metadata: _metadata }, _checkDate_initializers, _checkDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CheckFundsAvailabilityDto = CheckFundsAvailabilityDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Budget Definitions with multi-year support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetDefinition model
 *
 * @example
 * ```typescript
 * const Budget = createBudgetDefinitionModel(sequelize);
 * const budget = await Budget.create({
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   totalBudgetAmount: 10000000
 * });
 * ```
 */
const createBudgetDefinitionModel = (sequelize) => {
    class BudgetDefinition extends sequelize_1.Model {
    }
    BudgetDefinition.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        budgetCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique budget code',
        },
        budgetName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Budget name/description',
        },
        budgetType: {
            type: sequelize_1.DataTypes.ENUM('operating', 'capital', 'project', 'position', 'flexible', 'grant'),
            allowNull: false,
            comment: 'Type of budget',
        },
        budgetCategory: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'general',
            comment: 'Budget category classification',
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
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Budget period start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Budget period end date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'approved', 'active', 'closed', 'locked'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Budget status',
        },
        totalBudgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total budget amount',
        },
        allocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total allocated amount',
        },
        committedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total committed amount',
        },
        encumberedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total encumbered amount',
        },
        actualAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total actual expenditures',
        },
        availableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available budget balance',
        },
        isMultiYear: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether budget spans multiple years',
        },
        parentBudgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent budget for sub-budgets',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
        },
        approvalWorkflowId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Approval workflow identifier',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved budget',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional budget metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the budget',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the budget',
        },
    }, {
        sequelize,
        tableName: 'budget_definitions',
        timestamps: true,
        indexes: [
            { fields: ['budgetCode'], unique: true },
            { fields: ['fiscalYear'] },
            { fields: ['budgetType'] },
            { fields: ['status'] },
            { fields: ['startDate', 'endDate'] },
        ],
        hooks: {
            beforeCreate: (budget) => {
                if (!budget.createdBy) {
                    throw new Error('createdBy is required');
                }
                budget.updatedBy = budget.createdBy;
            },
            beforeUpdate: (budget) => {
                if (!budget.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (budget) => {
                // Calculate available amount
                const total = Number(budget.totalBudgetAmount || 0);
                const committed = Number(budget.committedAmount || 0);
                const encumbered = Number(budget.encumberedAmount || 0);
                const actual = Number(budget.actualAmount || 0);
                budget.availableAmount = total - committed - encumbered - actual;
            },
        },
        validate: {
            startBeforeEnd() {
                if (this.startDate >= this.endDate) {
                    throw new Error('Start date must be before end date');
                }
            },
        },
        scopes: {
            active: {
                where: { status: 'active' },
            },
            forYear: (fiscalYear) => ({
                where: { fiscalYear },
            }),
        },
    });
    return BudgetDefinition;
};
exports.createBudgetDefinitionModel = createBudgetDefinitionModel;
/**
 * Sequelize model for Budget Allocations by account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAllocation model
 *
 * @example
 * ```typescript
 * const Allocation = createBudgetAllocationModel(sequelize);
 * const allocation = await Allocation.create({
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * });
 * ```
 */
const createBudgetAllocationModel = (sequelize) => {
    class BudgetAllocation extends sequelize_1.Model {
    }
    BudgetAllocation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        budgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to budget definition',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to chart of accounts',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code (denormalized)',
        },
        organizationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Organization code',
        },
        departmentCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Department code',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Project code',
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Cost center code',
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
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        allocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Original allocated amount',
        },
        revisedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Revised amount after amendments',
        },
        committedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Committed amount',
        },
        encumberedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Encumbered amount',
        },
        actualAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual expenditures',
        },
        availableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available budget balance',
        },
        isLocked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether allocation is locked',
        },
        lockedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Lock timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional allocation metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the allocation',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the allocation',
        },
    }, {
        sequelize,
        tableName: 'budget_allocations',
        timestamps: true,
        indexes: [
            { fields: ['budgetId', 'accountId', 'fiscalYear', 'fiscalPeriod'], unique: true },
            { fields: ['budgetId'] },
            { fields: ['accountId'] },
            { fields: ['accountCode'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['organizationCode'] },
            { fields: ['departmentCode'] },
        ],
        hooks: {
            beforeCreate: (allocation) => {
                if (!allocation.createdBy) {
                    throw new Error('createdBy is required');
                }
                allocation.updatedBy = allocation.createdBy;
                allocation.revisedAmount = allocation.allocatedAmount;
            },
            beforeUpdate: (allocation) => {
                if (!allocation.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (allocation) => {
                // Calculate available amount
                const revised = Number(allocation.revisedAmount || allocation.allocatedAmount || 0);
                const committed = Number(allocation.committedAmount || 0);
                const encumbered = Number(allocation.encumberedAmount || 0);
                const actual = Number(allocation.actualAmount || 0);
                allocation.availableAmount = revised - committed - encumbered - actual;
            },
        },
        scopes: {
            unlocked: {
                where: { isLocked: false },
            },
        },
    });
    return BudgetAllocation;
};
exports.createBudgetAllocationModel = createBudgetAllocationModel;
/**
 * Sequelize model for Budget Amendments with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAmendment model
 *
 * @example
 * ```typescript
 * const Amendment = createBudgetAmendmentModel(sequelize);
 * const amendment = await Amendment.create({
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   justification: 'Additional funding for Q4'
 * });
 * ```
 */
const createBudgetAmendmentModel = (sequelize) => {
    class BudgetAmendment extends sequelize_1.Model {
    }
    BudgetAmendment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        budgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to budget definition',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
        },
        amendmentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique amendment number',
        },
        amendmentType: {
            type: sequelize_1.DataTypes.ENUM('increase', 'decrease', 'reallocation', 'supplemental', 'technical'),
            allowNull: false,
            comment: 'Type of amendment',
        },
        amendmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Amendment creation date',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date amendment becomes effective',
        },
        amendmentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Amendment amount (positive or negative)',
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Specific account for amendment',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Account code (denormalized)',
        },
        justification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Business justification for amendment',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'posted'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Amendment status',
        },
        submittedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who submitted amendment',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Submission timestamp',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved amendment',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        rejectedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who rejected amendment',
        },
        rejectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rejection timestamp',
        },
        rejectionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for rejection',
        },
        postedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Posting timestamp',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated journal entry',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional amendment metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the amendment',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the amendment',
        },
    }, {
        sequelize,
        tableName: 'budget_amendments',
        timestamps: true,
        indexes: [
            { fields: ['amendmentNumber'], unique: true },
            { fields: ['budgetId'] },
            { fields: ['amendmentType'] },
            { fields: ['status'] },
            { fields: ['effectiveDate'] },
        ],
        hooks: {
            beforeCreate: (amendment) => {
                if (!amendment.createdBy) {
                    throw new Error('createdBy is required');
                }
                amendment.updatedBy = amendment.createdBy;
                amendment.amendmentDate = amendment.amendmentDate || new Date();
            },
            beforeUpdate: (amendment) => {
                if (!amendment.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
            approved: {
                where: { status: 'approved' },
            },
        },
    });
    return BudgetAmendment;
};
exports.createBudgetAmendmentModel = createBudgetAmendmentModel;
/**
 * Sequelize model for Budget Transfers between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetTransfer model
 *
 * @example
 * ```typescript
 * const Transfer = createBudgetTransferModel(sequelize);
 * const transfer = await Transfer.create({
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000
 * });
 * ```
 */
const createBudgetTransferModel = (sequelize) => {
    class BudgetTransfer extends sequelize_1.Model {
    }
    BudgetTransfer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transferNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique transfer number',
        },
        transferDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transfer date',
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
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        fromBudgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Source budget',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
        },
        fromAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Source account',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        fromAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source account code (denormalized)',
        },
        toBudgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Destination budget',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
        },
        toAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Destination account',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        toAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Destination account code (denormalized)',
        },
        transferAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Transfer amount',
            validate: {
                min: 0.01,
            },
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for transfer',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'posted', 'rejected'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Transfer status',
        },
        submittedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who submitted transfer',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved transfer',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        postedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Posting timestamp',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated journal entry',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional transfer metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the transfer',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the transfer',
        },
    }, {
        sequelize,
        tableName: 'budget_transfers',
        timestamps: true,
        indexes: [
            { fields: ['transferNumber'], unique: true },
            { fields: ['fromBudgetId'] },
            { fields: ['toBudgetId'] },
            { fields: ['status'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
        ],
        hooks: {
            beforeCreate: (transfer) => {
                if (!transfer.createdBy) {
                    throw new Error('createdBy is required');
                }
                transfer.updatedBy = transfer.createdBy;
            },
            beforeUpdate: (transfer) => {
                if (!transfer.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
        validate: {
            differentAccounts() {
                if (this.fromAccountCode === this.toAccountCode && this.fromBudgetId === this.toBudgetId) {
                    throw new Error('Source and destination must be different');
                }
            },
        },
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
        },
    });
    return BudgetTransfer;
};
exports.createBudgetTransferModel = createBudgetTransferModel;
/**
 * Sequelize model for Encumbrances (purchase orders, contracts).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Encumbrance model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceType: 'purchase_order',
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * });
 * ```
 */
const createEncumbranceModel = (sequelize) => {
    class Encumbrance extends sequelize_1.Model {
    }
    Encumbrance.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        encumbranceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique encumbrance number',
        },
        encumbranceType: {
            type: sequelize_1.DataTypes.ENUM('purchase_order', 'contract', 'requisition', 'reservation', 'blanket_po'),
            allowNull: false,
            comment: 'Type of encumbrance',
        },
        budgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to budget',
            references: {
                model: 'budget_definitions',
                key: 'id',
            },
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to account',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code (denormalized)',
        },
        encumbranceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Encumbrance date',
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
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        encumbranceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Original encumbrance amount',
            validate: {
                min: 0,
            },
        },
        liquidatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Liquidated/spent amount',
        },
        remainingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining encumbrance',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'partial', 'liquidated', 'cancelled', 'expired'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Encumbrance status',
        },
        referenceDocument: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Reference document number (PO, Contract, etc.)',
        },
        vendorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Vendor ID if applicable',
        },
        vendorName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Vendor name (denormalized)',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Encumbrance description',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Encumbrance expiration date',
        },
        cancelledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Cancellation timestamp',
        },
        cancelledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who cancelled encumbrance',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional encumbrance metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the encumbrance',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the encumbrance',
        },
    }, {
        sequelize,
        tableName: 'encumbrances',
        timestamps: true,
        indexes: [
            { fields: ['encumbranceNumber'], unique: true },
            { fields: ['budgetId'] },
            { fields: ['accountId'] },
            { fields: ['status'] },
            { fields: ['referenceDocument'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
        ],
        hooks: {
            beforeCreate: (encumbrance) => {
                if (!encumbrance.createdBy) {
                    throw new Error('createdBy is required');
                }
                encumbrance.updatedBy = encumbrance.createdBy;
                encumbrance.remainingAmount = encumbrance.encumbranceAmount;
            },
            beforeUpdate: (encumbrance) => {
                if (!encumbrance.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (encumbrance) => {
                // Calculate remaining amount
                const total = Number(encumbrance.encumbranceAmount || 0);
                const liquidated = Number(encumbrance.liquidatedAmount || 0);
                encumbrance.remainingAmount = total - liquidated;
                // Update status based on amounts
                if (liquidated >= total) {
                    encumbrance.status = 'liquidated';
                }
                else if (liquidated > 0) {
                    encumbrance.status = 'partial';
                }
            },
        },
        scopes: {
            active: {
                where: { status: 'active' },
            },
            forBudget: (budgetId) => ({
                where: { budgetId },
            }),
        },
    });
    return Encumbrance;
};
exports.createEncumbranceModel = createEncumbranceModel;
// ============================================================================
// BUDGET CREATION AND MANAGEMENT (1-10)
// ============================================================================
/**
 * Creates a new budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, {
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalBudgetAmount: 10000000
 * }, 'user123');
 * ```
 */
async function createBudget(sequelize, budgetData, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.create({
        ...budgetData,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return budget;
}
/**
 * Updates an existing budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to update
 * @param {object} updateData - Updated budget data
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await updateBudget(sequelize, 1, {
 *   totalBudgetAmount: 11000000
 * }, 'user123');
 * ```
 */
async function updateBudget(sequelize, budgetId, updateData, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status === 'locked' || budget.status === 'closed') {
        throw new Error('Cannot update locked or closed budget');
    }
    await budget.update({
        ...updateData,
        updatedBy: userId,
    }, { transaction });
    return budget;
}
/**
 * Retrieves budget by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetById(sequelize, 1);
 * ```
 */
async function getBudgetById(sequelize, budgetId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    return budget;
}
/**
 * Retrieves budget by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetCode - Budget code to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetByCode(sequelize, 'FY2024-OPS');
 * ```
 */
async function getBudgetByCode(sequelize, budgetCode, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findOne({
        where: { budgetCode },
        transaction,
    });
    if (!budget) {
        throw new Error(`Budget ${budgetCode} not found`);
    }
    return budget;
}
/**
 * Lists all budgets for a fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of budgets
 *
 * @example
 * ```typescript
 * const budgets = await listBudgetsByYear(sequelize, 2024);
 * ```
 */
async function listBudgetsByYear(sequelize, fiscalYear, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budgets = await Budget.findAll({
        where: { fiscalYear },
        order: [['budgetCode', 'ASC']],
        transaction,
    });
    return budgets;
}
/**
 * Approves a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to approve
 * @param {string} userId - User approving the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved budget
 *
 * @example
 * ```typescript
 * const approved = await approveBudget(sequelize, 1, 'manager123');
 * ```
 */
async function approveBudget(sequelize, budgetId, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status !== 'submitted' && budget.status !== 'draft') {
        throw new Error(`Budget must be in draft or submitted status to approve`);
    }
    await budget.update({
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return budget;
}
/**
 * Activates an approved budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to activate
 * @param {string} userId - User activating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated budget
 *
 * @example
 * ```typescript
 * const active = await activateBudget(sequelize, 1, 'user123');
 * ```
 */
async function activateBudget(sequelize, budgetId, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status !== 'approved') {
        throw new Error('Budget must be approved before activation');
    }
    await budget.update({
        status: 'active',
        updatedBy: userId,
    }, { transaction });
    return budget;
}
/**
 * Closes a budget period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to close
 * @param {string} userId - User closing the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed budget
 *
 * @example
 * ```typescript
 * const closed = await closeBudget(sequelize, 1, 'user123');
 * ```
 */
async function closeBudget(sequelize, budgetId, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    await budget.update({
        status: 'closed',
        updatedBy: userId,
    }, { transaction });
    return budget;
}
/**
 * Deletes a budget (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudget(sequelize, 1);
 * ```
 */
async function deleteBudget(sequelize, budgetId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status !== 'draft') {
        throw new Error('Can only delete budgets in draft status');
    }
    await budget.destroy({ transaction });
}
/**
 * Copies a budget to create a new budget for the next year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceBudgetId - Source budget ID to copy
 * @param {number} targetFiscalYear - Target fiscal year
 * @param {string} userId - User creating the copy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} New budget copy
 *
 * @example
 * ```typescript
 * const newBudget = await copyBudget(sequelize, 1, 2025, 'user123');
 * ```
 */
async function copyBudget(sequelize, sourceBudgetId, targetFiscalYear, userId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const source = await Budget.findByPk(sourceBudgetId, { transaction });
    if (!source) {
        throw new Error(`Source budget ${sourceBudgetId} not found`);
    }
    const newBudget = await Budget.create({
        budgetCode: `${source.budgetCode}-${targetFiscalYear}`,
        budgetName: source.budgetName.replace(String(source.fiscalYear), String(targetFiscalYear)),
        budgetType: source.budgetType,
        budgetCategory: source.budgetCategory,
        fiscalYear: targetFiscalYear,
        startDate: new Date(targetFiscalYear, 0, 1),
        endDate: new Date(targetFiscalYear, 11, 31),
        totalBudgetAmount: source.totalBudgetAmount,
        status: 'draft',
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return newBudget;
}
// ============================================================================
// BUDGET ALLOCATION (11-20)
// ============================================================================
/**
 * Creates a budget allocation for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAllocationDto} allocationData - Allocation data
 * @param {string} userId - User creating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createBudgetAllocation(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * }, 'user123');
 * ```
 */
async function createBudgetAllocation(sequelize, allocationData, userId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    // Get account code (mocked for this example)
    const accountCode = '5000-SALARIES';
    const allocation = await Allocation.create({
        ...allocationData,
        accountCode,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return allocation;
}
/**
 * Updates a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to update
 * @param {object} updateData - Updated allocation data
 * @param {string} userId - User updating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateBudgetAllocation(sequelize, 1, {
 *   allocatedAmount: 110000
 * }, 'user123');
 * ```
 */
async function updateBudgetAllocation(sequelize, allocationId, updateData, userId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocation = await Allocation.findByPk(allocationId, { transaction });
    if (!allocation) {
        throw new Error(`Allocation ${allocationId} not found`);
    }
    if (allocation.isLocked) {
        throw new Error('Cannot update locked allocation');
    }
    await allocation.update({
        ...updateData,
        updatedBy: userId,
    }, { transaction });
    return allocation;
}
/**
 * Retrieves allocations for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [fiscalPeriod] - Optional fiscal period filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of allocations
 *
 * @example
 * ```typescript
 * const allocations = await getBudgetAllocations(sequelize, 1, 1);
 * ```
 */
async function getBudgetAllocations(sequelize, budgetId, fiscalPeriod, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const where = { budgetId };
    if (fiscalPeriod !== undefined) {
        where.fiscalPeriod = fiscalPeriod;
    }
    const allocations = await Allocation.findAll({
        where,
        order: [['accountCode', 'ASC'], ['fiscalPeriod', 'ASC']],
        transaction,
    });
    return allocations;
}
/**
 * Retrieves allocation for specific account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allocation
 *
 * @example
 * ```typescript
 * const allocation = await getAllocationByAccount(
 *   sequelize, 1, 100, 2024, 1
 * );
 * ```
 */
async function getAllocationByAccount(sequelize, budgetId, accountId, fiscalYear, fiscalPeriod, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocation = await Allocation.findOne({
        where: {
            budgetId,
            accountId,
            fiscalYear,
            fiscalPeriod,
        },
        transaction,
    });
    return allocation;
}
/**
 * Locks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to lock
 * @param {string} userId - User locking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations locked
 *
 * @example
 * ```typescript
 * const count = await lockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
async function lockBudgetAllocations(sequelize, budgetId, fiscalPeriod, userId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const [count] = await Allocation.update({
        isLocked: true,
        lockedAt: new Date(),
        updatedBy: userId,
    }, {
        where: {
            budgetId,
            fiscalPeriod,
            isLocked: false,
        },
        transaction,
    });
    return count;
}
/**
 * Unlocks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to unlock
 * @param {string} userId - User unlocking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations unlocked
 *
 * @example
 * ```typescript
 * const count = await unlockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
async function unlockBudgetAllocations(sequelize, budgetId, fiscalPeriod, userId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const [count] = await Allocation.update({
        isLocked: false,
        lockedAt: null,
        updatedBy: userId,
    }, {
        where: {
            budgetId,
            fiscalPeriod,
            isLocked: true,
        },
        transaction,
    });
    return count;
}
/**
 * Distributes budget evenly across all periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} totalAmount - Total amount to distribute
 * @param {number} numberOfPeriods - Number of periods
 * @param {string} userId - User performing distribution
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await distributeBudgetEvenly(
 *   sequelize, 1, 100, 120000, 12, 'user123'
 * );
 * ```
 */
async function distributeBudgetEvenly(sequelize, budgetId, accountId, totalAmount, numberOfPeriods, userId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    const amountPerPeriod = totalAmount / numberOfPeriods;
    const allocations = [];
    for (let period = 1; period <= numberOfPeriods; period++) {
        const allocation = await Allocation.create({
            budgetId,
            accountId,
            accountCode: '5000-SALARIES',
            fiscalYear: budget.fiscalYear,
            fiscalPeriod: period,
            allocatedAmount: amountPerPeriod,
            createdBy: userId,
            updatedBy: userId,
        }, { transaction });
        allocations.push(allocation);
    }
    return allocations;
}
/**
 * Calculates total allocated amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total allocated amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAllocated(sequelize, 1);
 * ```
 */
async function calculateTotalAllocated(sequelize, budgetId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const result = await Allocation.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalAllocated'],
        ],
        where: { budgetId },
        raw: true,
        transaction,
    });
    return Number(result?.totalAllocated || 0);
}
/**
 * Deletes a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudgetAllocation(sequelize, 1);
 * ```
 */
async function deleteBudgetAllocation(sequelize, allocationId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocation = await Allocation.findByPk(allocationId, { transaction });
    if (!allocation) {
        throw new Error(`Allocation ${allocationId} not found`);
    }
    if (allocation.isLocked) {
        throw new Error('Cannot delete locked allocation');
    }
    await allocation.destroy({ transaction });
}
/**
 * Retrieves allocation summary by department.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} departmentCode - Department code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Department allocation summary
 *
 * @example
 * ```typescript
 * const summary = await getAllocationsByDepartment(
 *   sequelize, 1, 'DEPT-001'
 * );
 * ```
 */
async function getAllocationsByDepartment(sequelize, budgetId, departmentCode, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocations = await Allocation.findAll({
        where: {
            budgetId,
            departmentCode,
        },
        order: [['accountCode', 'ASC']],
        transaction,
    });
    return allocations;
}
// ============================================================================
// BUDGET AMENDMENTS AND TRANSFERS (21-30)
// ============================================================================
/**
 * Creates a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAmendmentDto} amendmentData - Amendment data
 * @param {string} userId - User creating the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment(sequelize, {
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   effectiveDate: new Date(),
 *   justification: 'Additional funding needed for Q4'
 * }, 'user123');
 * ```
 */
async function createBudgetAmendment(sequelize, amendmentData, userId, transaction) {
    const Amendment = (0, exports.createBudgetAmendmentModel)(sequelize);
    const amendment = await Amendment.create({
        ...amendmentData,
        amendmentNumber: `AMD-${Date.now()}`,
        amendmentDate: new Date(),
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return amendment;
}
/**
 * Approves a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to approve
 * @param {string} userId - User approving the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetAmendment(sequelize, 1, 'manager123');
 * ```
 */
async function approveBudgetAmendment(sequelize, amendmentId, userId, transaction) {
    const Amendment = (0, exports.createBudgetAmendmentModel)(sequelize);
    const amendment = await Amendment.findByPk(amendmentId, { transaction });
    if (!amendment) {
        throw new Error(`Amendment ${amendmentId} not found`);
    }
    if (amendment.status !== 'pending' && amendment.status !== 'submitted') {
        throw new Error('Amendment must be in pending or submitted status');
    }
    await amendment.update({
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return amendment;
}
/**
 * Posts a budget amendment to update budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to post
 * @param {string} userId - User posting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted amendment
 *
 * @example
 * ```typescript
 * const posted = await postBudgetAmendment(sequelize, 1, 'user123');
 * ```
 */
async function postBudgetAmendment(sequelize, amendmentId, userId, transaction) {
    const Amendment = (0, exports.createBudgetAmendmentModel)(sequelize);
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const amendment = await Amendment.findByPk(amendmentId, { transaction });
    if (!amendment) {
        throw new Error(`Amendment ${amendmentId} not found`);
    }
    if (amendment.status !== 'approved') {
        throw new Error('Amendment must be approved before posting');
    }
    // Update budget totals
    const budget = await Budget.findByPk(amendment.budgetId, { transaction });
    if (budget) {
        await budget.update({
            totalBudgetAmount: Number(budget.totalBudgetAmount) + Number(amendment.amendmentAmount),
            updatedBy: userId,
        }, { transaction });
    }
    await amendment.update({
        status: 'posted',
        postedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return amendment;
}
/**
 * Rejects a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to reject
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectBudgetAmendment(
 *   sequelize, 1, 'Insufficient justification', 'manager123'
 * );
 * ```
 */
async function rejectBudgetAmendment(sequelize, amendmentId, rejectionReason, userId, transaction) {
    const Amendment = (0, exports.createBudgetAmendmentModel)(sequelize);
    const amendment = await Amendment.findByPk(amendmentId, { transaction });
    if (!amendment) {
        throw new Error(`Amendment ${amendmentId} not found`);
    }
    await amendment.update({
        status: 'rejected',
        rejectedBy: userId,
        rejectedAt: new Date(),
        rejectionReason,
        updatedBy: userId,
    }, { transaction });
    return amendment;
}
/**
 * Creates a budget transfer between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetTransferDto} transferData - Transfer data
 * @param {string} userId - User creating the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createBudgetTransfer(sequelize, {
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000,
 *   reason: 'Reallocate for increased benefits costs'
 * }, 'user123');
 * ```
 */
async function createBudgetTransfer(sequelize, transferData, userId, transaction) {
    const Transfer = (0, exports.createBudgetTransferModel)(sequelize);
    const transfer = await Transfer.create({
        ...transferData,
        transferNumber: `XFER-${Date.now()}`,
        transferDate: new Date(),
        fiscalYear: new Date().getFullYear(),
        fiscalPeriod: new Date().getMonth() + 1,
        fromAccountId: 1,
        toAccountId: 2,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return transfer;
}
/**
 * Approves a budget transfer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to approve
 * @param {string} userId - User approving the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetTransfer(sequelize, 1, 'manager123');
 * ```
 */
async function approveBudgetTransfer(sequelize, transferId, userId, transaction) {
    const Transfer = (0, exports.createBudgetTransferModel)(sequelize);
    const transfer = await Transfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== 'pending' && transfer.status !== 'submitted') {
        throw new Error('Transfer must be in pending or submitted status');
    }
    await transfer.update({
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return transfer;
}
/**
 * Posts a budget transfer to update allocations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to post
 * @param {string} userId - User posting the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted transfer
 *
 * @example
 * ```typescript
 * const posted = await postBudgetTransfer(sequelize, 1, 'user123');
 * ```
 */
async function postBudgetTransfer(sequelize, transferId, userId, transaction) {
    const Transfer = (0, exports.createBudgetTransferModel)(sequelize);
    const transfer = await Transfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== 'approved') {
        throw new Error('Transfer must be approved before posting');
    }
    // Update allocations (implementation would update from and to accounts)
    await transfer.update({
        status: 'posted',
        postedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return transfer;
}
/**
 * Retrieves budget amendments for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of amendments
 *
 * @example
 * ```typescript
 * const amendments = await getBudgetAmendments(sequelize, 1, 'approved');
 * ```
 */
async function getBudgetAmendments(sequelize, budgetId, status, transaction) {
    const Amendment = (0, exports.createBudgetAmendmentModel)(sequelize);
    const where = { budgetId };
    if (status) {
        where.status = status;
    }
    const amendments = await Amendment.findAll({
        where,
        order: [['amendmentDate', 'DESC']],
        transaction,
    });
    return amendments;
}
/**
 * Retrieves budget transfers for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of transfers
 *
 * @example
 * ```typescript
 * const transfers = await getBudgetTransfers(sequelize, 1, 'posted');
 * ```
 */
async function getBudgetTransfers(sequelize, budgetId, status, transaction) {
    const Transfer = (0, exports.createBudgetTransferModel)(sequelize);
    const where = {
        [sequelize_1.Op.or]: [
            { fromBudgetId: budgetId },
            { toBudgetId: budgetId },
        ],
    };
    if (status) {
        where.status = status;
    }
    const transfers = await Transfer.findAll({
        where,
        order: [['transferDate', 'DESC']],
        transaction,
    });
    return transfers;
}
// ============================================================================
// ENCUMBRANCE MANAGEMENT (31-40)
// ============================================================================
/**
 * Creates an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto} encumbranceData - Encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceType: 'purchase_order',
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * }, 'user123');
 * ```
 */
async function createEncumbrance(sequelize, encumbranceData, userId, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrance = await Encumbrance.create({
        ...encumbranceData,
        encumbranceNumber: `ENC-${Date.now()}`,
        encumbranceDate: new Date(),
        fiscalYear: new Date().getFullYear(),
        fiscalPeriod: new Date().getMonth() + 1,
        accountCode: '5000-SALARIES',
        description: `Encumbrance for ${encumbranceData.referenceDocument}`,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return encumbrance;
}
/**
 * Liquidates an encumbrance (fully or partially).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to liquidate
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} userId - User liquidating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const liquidated = await liquidateEncumbrance(
 *   sequelize, 1, 25000, 'user123'
 * );
 * ```
 */
async function liquidateEncumbrance(sequelize, encumbranceId, liquidationAmount, userId, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });
    if (!encumbrance) {
        throw new Error(`Encumbrance ${encumbranceId} not found`);
    }
    const newLiquidated = Number(encumbrance.liquidatedAmount) + liquidationAmount;
    if (newLiquidated > Number(encumbrance.encumbranceAmount)) {
        throw new Error('Liquidation amount exceeds encumbrance amount');
    }
    await encumbrance.update({
        liquidatedAmount: newLiquidated,
        updatedBy: userId,
    }, { transaction });
    return encumbrance;
}
/**
 * Cancels an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to cancel
 * @param {string} userId - User cancelling the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled encumbrance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelEncumbrance(sequelize, 1, 'user123');
 * ```
 */
async function cancelEncumbrance(sequelize, encumbranceId, userId, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });
    if (!encumbrance) {
        throw new Error(`Encumbrance ${encumbranceId} not found`);
    }
    if (encumbrance.status === 'liquidated') {
        throw new Error('Cannot cancel fully liquidated encumbrance');
    }
    await encumbrance.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: userId,
        updatedBy: userId,
    }, { transaction });
    return encumbrance;
}
/**
 * Retrieves encumbrances for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrances(sequelize, 1, 'active');
 * ```
 */
async function getEncumbrances(sequelize, budgetId, status, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const where = { budgetId };
    if (status) {
        where.status = status;
    }
    const encumbrances = await Encumbrance.findAll({
        where,
        order: [['encumbranceDate', 'DESC']],
        transaction,
    });
    return encumbrances;
}
/**
 * Calculates total encumbered amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total encumbered amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalEncumbered(sequelize, 1);
 * ```
 */
async function calculateTotalEncumbered(sequelize, budgetId, accountId, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const where = {
        budgetId,
        status: { [sequelize_1.Op.in]: ['active', 'partial'] },
    };
    if (accountId !== undefined) {
        where.accountId = accountId;
    }
    const result = await Encumbrance.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('remainingAmount')), 'totalEncumbered'],
        ],
        where,
        raw: true,
        transaction,
    });
    return Number(result?.totalEncumbered || 0);
}
/**
 * Checks funds availability before creating encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CheckFundsAvailabilityDto} checkData - Funds check parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FundsAvailability>} Funds availability result
 *
 * @example
 * ```typescript
 * const availability = await checkFundsAvailability(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   amount: 50000,
 *   checkDate: new Date()
 * });
 * ```
 */
async function checkFundsAvailability(sequelize, checkData, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    // Get current allocation
    const allocation = await Allocation.findOne({
        where: {
            budgetId: checkData.budgetId,
            accountId: checkData.accountId,
            fiscalYear: checkData.checkDate.getFullYear(),
            fiscalPeriod: checkData.checkDate.getMonth() + 1,
        },
        transaction,
    });
    if (!allocation) {
        return {
            accountId: checkData.accountId,
            accountCode: 'N/A',
            budgetAmount: 0,
            committedAmount: 0,
            encumberedAmount: 0,
            actualAmount: 0,
            reservedAmount: 0,
            availableAmount: 0,
            hasSufficientFunds: false,
        };
    }
    const available = Number(allocation.availableAmount);
    return {
        accountId: checkData.accountId,
        accountCode: allocation.accountCode,
        budgetAmount: Number(allocation.revisedAmount),
        committedAmount: Number(allocation.committedAmount),
        encumberedAmount: Number(allocation.encumberedAmount),
        actualAmount: Number(allocation.actualAmount),
        reservedAmount: 0,
        availableAmount: available,
        hasSufficientFunds: available >= checkData.amount,
    };
}
/**
 * Retrieves encumbrance by reference document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} referenceDocument - Reference document number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceByReference(
 *   sequelize, 'PO-2024-001'
 * );
 * ```
 */
async function getEncumbranceByReference(sequelize, referenceDocument, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrance = await Encumbrance.findOne({
        where: { referenceDocument },
        transaction,
    });
    return encumbrance;
}
/**
 * Updates encumbrance amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to update
 * @param {number} newAmount - New encumbrance amount
 * @param {string} userId - User updating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const updated = await updateEncumbranceAmount(
 *   sequelize, 1, 55000, 'user123'
 * );
 * ```
 */
async function updateEncumbranceAmount(sequelize, encumbranceId, newAmount, userId, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });
    if (!encumbrance) {
        throw new Error(`Encumbrance ${encumbranceId} not found`);
    }
    if (newAmount < Number(encumbrance.liquidatedAmount)) {
        throw new Error('New amount cannot be less than liquidated amount');
    }
    await encumbrance.update({
        encumbranceAmount: newAmount,
        updatedBy: userId,
    }, { transaction });
    return encumbrance;
}
/**
 * Generates encumbrance report for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Encumbrance report data
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceReport(sequelize, 2024, 1);
 * ```
 */
async function generateEncumbranceReport(sequelize, fiscalYear, fiscalPeriod, transaction) {
    const Encumbrance = (0, exports.createEncumbranceModel)(sequelize);
    const encumbrances = await Encumbrance.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            status: { [sequelize_1.Op.in]: ['active', 'partial'] },
        },
        order: [['accountCode', 'ASC']],
        transaction,
    });
    return encumbrances;
}
// ============================================================================
// BUDGET VS ACTUAL AND VARIANCE ANALYSIS (41-45)
// ============================================================================
/**
 * Generates budget vs actual report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetVsActual[]>} Budget vs actual comparison
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport(
 *   sequelize, 1, 2024, 1
 * );
 * ```
 */
async function generateBudgetVsActualReport(sequelize, budgetId, fiscalYear, fiscalPeriod, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocations = await Allocation.findAll({
        where: {
            budgetId,
            fiscalYear,
            fiscalPeriod,
        },
        order: [['accountCode', 'ASC']],
        transaction,
    });
    return allocations.map(allocation => ({
        accountCode: allocation.accountCode,
        accountName: 'Account Name',
        fiscalYear,
        fiscalPeriod,
        budgetAmount: Number(allocation.allocatedAmount),
        amendmentAmount: Number(allocation.revisedAmount) - Number(allocation.allocatedAmount),
        revisedBudget: Number(allocation.revisedAmount),
        committedAmount: Number(allocation.committedAmount),
        encumberedAmount: Number(allocation.encumberedAmount),
        actualAmount: Number(allocation.actualAmount),
        availableAmount: Number(allocation.availableAmount),
        variance: Number(allocation.revisedAmount) - Number(allocation.actualAmount),
        variancePercent: ((Number(allocation.revisedAmount) - Number(allocation.actualAmount)) / Number(allocation.revisedAmount)) * 100,
    }));
}
/**
 * Performs variance analysis on budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdPercent=10] - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(
 *   sequelize, 1, 2024, 1, 15
 * );
 * ```
 */
async function performVarianceAnalysis(sequelize, budgetId, fiscalYear, fiscalPeriod, thresholdPercent = 10, transaction) {
    const budgetVsActual = await generateBudgetVsActualReport(sequelize, budgetId, fiscalYear, fiscalPeriod, transaction);
    return budgetVsActual.map(item => {
        const variance = item.revisedBudget - item.actualAmount;
        const variancePercent = (variance / item.revisedBudget) * 100;
        const absPercent = Math.abs(variancePercent);
        let varianceType = 'neutral';
        if (variance > 0) {
            varianceType = 'favorable';
        }
        else if (variance < 0) {
            varianceType = 'unfavorable';
        }
        let thresholdStatus = 'within';
        if (absPercent > thresholdPercent * 1.5) {
            thresholdStatus = 'exceeded';
        }
        else if (absPercent > thresholdPercent) {
            thresholdStatus = 'warning';
        }
        return {
            accountCode: item.accountCode,
            accountName: item.accountName,
            budgetAmount: item.revisedBudget,
            actualAmount: item.actualAmount,
            variance,
            variancePercent,
            varianceType,
            thresholdStatus,
        };
    });
}
/**
 * Calculates budget utilization percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Budget utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateBudgetUtilization(sequelize, 1);
 * ```
 */
async function calculateBudgetUtilization(sequelize, budgetId, accountId, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const where = { budgetId };
    if (accountId !== undefined) {
        where.accountId = accountId;
    }
    const result = await Allocation.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('revisedAmount')), 'totalBudget'],
            [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
        ],
        where,
        raw: true,
        transaction,
    });
    const totalBudget = Number(result?.totalBudget || 0);
    const totalActual = Number(result?.totalActual || 0);
    if (totalBudget === 0)
        return 0;
    return (totalActual / totalBudget) * 100;
}
/**
 * Retrieves accounts exceeding budget threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} thresholdPercent - Threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Accounts over threshold
 *
 * @example
 * ```typescript
 * const overBudget = await getAccountsOverBudget(sequelize, 1, 90);
 * ```
 */
async function getAccountsOverBudget(sequelize, budgetId, thresholdPercent, transaction) {
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const allocations = await Allocation.findAll({
        where: { budgetId },
        transaction,
    });
    return allocations.filter(allocation => {
        const budget = Number(allocation.revisedAmount);
        const actual = Number(allocation.actualAmount);
        if (budget === 0)
            return false;
        const utilization = (actual / budget) * 100;
        return utilization >= thresholdPercent;
    });
}
/**
 * Generates comprehensive budget monitoring dashboard data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetMonitoringDashboard(
 *   sequelize, 1
 * );
 * ```
 */
async function generateBudgetMonitoringDashboard(sequelize, budgetId, transaction) {
    const Budget = (0, exports.createBudgetDefinitionModel)(sequelize);
    const Allocation = (0, exports.createBudgetAllocationModel)(sequelize);
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    const allocations = await Allocation.findAll({
        where: { budgetId },
        transaction,
    });
    const totalBudget = Number(budget.totalBudgetAmount);
    const totalActual = allocations.reduce((sum, a) => sum + Number(a.actualAmount), 0);
    const totalEncumbered = allocations.reduce((sum, a) => sum + Number(a.encumberedAmount), 0);
    const totalCommitted = allocations.reduce((sum, a) => sum + Number(a.committedAmount), 0);
    const totalAvailable = allocations.reduce((sum, a) => sum + Number(a.availableAmount), 0);
    return {
        budgetId,
        budgetCode: budget.budgetCode,
        budgetName: budget.budgetName,
        fiscalYear: budget.fiscalYear,
        status: budget.status,
        totalBudget,
        totalAllocated: Number(budget.allocatedAmount),
        totalCommitted,
        totalEncumbered,
        totalActual,
        totalAvailable,
        utilizationPercent: (totalActual / totalBudget) * 100,
        commitmentPercent: (totalCommitted / totalBudget) * 100,
        encumbrancePercent: (totalEncumbered / totalBudget) * 100,
        availablePercent: (totalAvailable / totalBudget) * 100,
    };
}
//# sourceMappingURL=budget-management-control-kit.js.map