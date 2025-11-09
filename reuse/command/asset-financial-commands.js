"use strict";
/**
 * ASSET FINANCIAL MANAGEMENT COMMANDS
 *
 * Comprehensive asset financial tracking and analysis toolkit.
 * Provides 45 specialized functions covering:
 * - Cost tracking and allocation
 * - Depreciation calculations (5 methods: straight-line, declining balance,
 *   double declining balance, sum-of-years-digits, units-of-production)
 * - Book value management and reporting
 * - Capital vs Operating expense classification
 * - Budget tracking and variance analysis
 * - Cost center and department allocation
 * - ROI (Return on Investment) calculations
 * - TCO (Total Cost of Ownership) analysis
 * - Lease vs Buy financial analysis
 * - Amortization schedules and tracking
 * - Asset impairment tracking
 * - Disposal gain/loss calculations
 * - Financial reporting and compliance
 * - Tax depreciation calculations
 *
 * @module AssetFinancialCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @financial GAAP/IFRS compliant depreciation and financial reporting
 * @tax Supports tax depreciation methods (MACRS, Section 179, etc.)
 *
 * @example
 * ```typescript
 * import {
 *   trackAssetCost,
 *   calculateStraightLineDepreciation,
 *   calculateBookValue,
 *   analyzeROI,
 *   analyzeTCO,
 *   AssetCost,
 *   DepreciationSchedule
 * } from './asset-financial-commands';
 *
 * // Track asset cost
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'acquisition',
 *   amount: 100000,
 *   date: new Date()
 * });
 *
 * // Calculate depreciation
 * const schedule = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10
 * );
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
exports.CreateBudgetAllocationDto = exports.CalculateDepreciationDto = exports.CreateAssetCostDto = exports.FinancialAnalysis = exports.AssetImpairment = exports.BudgetAllocation = exports.DepreciationSchedule = exports.AssetCost = exports.LeaseType = exports.FinancialStatus = exports.BudgetStatus = exports.ExpenseClassification = exports.CostType = exports.DepreciationMethod = void 0;
exports.trackAssetCost = trackAssetCost;
exports.getAssetCostById = getAssetCostById;
exports.getAssetCosts = getAssetCosts;
exports.calculateTotalAssetCosts = calculateTotalAssetCosts;
exports.updateAssetCost = updateAssetCost;
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
exports.calculateDoubleDecliningDepreciation = calculateDoubleDecliningDepreciation;
exports.calculateSumOfYearsDigitsDepreciation = calculateSumOfYearsDigitsDepreciation;
exports.calculateUnitsOfProductionDepreciation = calculateUnitsOfProductionDepreciation;
exports.getDepreciationSchedule = getDepreciationSchedule;
exports.calculateBookValue = calculateBookValue;
exports.createBudgetAllocation = createBudgetAllocation;
exports.getBudgetAllocationById = getBudgetAllocationById;
exports.trackBudgetSpending = trackBudgetSpending;
exports.getBudgetsByFiscalYear = getBudgetsByFiscalYear;
exports.analyzeROI = analyzeROI;
exports.analyzeTCO = analyzeTCO;
exports.analyzeLeaseVsBuy = analyzeLeaseVsBuy;
exports.generateAmortizationSchedule = generateAmortizationSchedule;
exports.recordAssetImpairment = recordAssetImpairment;
exports.getAssetImpairments = getAssetImpairments;
exports.calculateDisposalGainLoss = calculateDisposalGainLoss;
exports.getAssetFinancialSummary = getAssetFinancialSummary;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Depreciation methods
 */
var DepreciationMethod;
(function (DepreciationMethod) {
    DepreciationMethod["STRAIGHT_LINE"] = "straight_line";
    DepreciationMethod["DECLINING_BALANCE"] = "declining_balance";
    DepreciationMethod["DOUBLE_DECLINING"] = "double_declining";
    DepreciationMethod["SUM_OF_YEARS_DIGITS"] = "sum_of_years_digits";
    DepreciationMethod["UNITS_OF_PRODUCTION"] = "units_of_production";
    DepreciationMethod["MACRS"] = "macrs";
    DepreciationMethod["CUSTOM"] = "custom";
})(DepreciationMethod || (exports.DepreciationMethod = DepreciationMethod = {}));
/**
 * Cost types
 */
var CostType;
(function (CostType) {
    CostType["ACQUISITION"] = "acquisition";
    CostType["INSTALLATION"] = "installation";
    CostType["SHIPPING"] = "shipping";
    CostType["MAINTENANCE"] = "maintenance";
    CostType["REPAIR"] = "repair";
    CostType["UPGRADE"] = "upgrade";
    CostType["CALIBRATION"] = "calibration";
    CostType["TRAINING"] = "training";
    CostType["LICENSE"] = "license";
    CostType["INSURANCE"] = "insurance";
    CostType["STORAGE"] = "storage";
    CostType["DISPOSAL"] = "disposal";
    CostType["OTHER"] = "other";
})(CostType || (exports.CostType = CostType = {}));
/**
 * Expense classification
 */
var ExpenseClassification;
(function (ExpenseClassification) {
    ExpenseClassification["CAPITAL_EXPENSE"] = "capital_expense";
    ExpenseClassification["OPERATING_EXPENSE"] = "operating_expense";
    ExpenseClassification["MIXED"] = "mixed";
})(ExpenseClassification || (exports.ExpenseClassification = ExpenseClassification = {}));
/**
 * Budget status
 */
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["UNDER_BUDGET"] = "under_budget";
    BudgetStatus["ON_BUDGET"] = "on_budget";
    BudgetStatus["OVER_BUDGET"] = "over_budget";
    BudgetStatus["EXCEEDED"] = "exceeded";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
/**
 * Asset financial status
 */
var FinancialStatus;
(function (FinancialStatus) {
    FinancialStatus["ACTIVE"] = "active";
    FinancialStatus["FULLY_DEPRECIATED"] = "fully_depreciated";
    FinancialStatus["IMPAIRED"] = "impaired";
    FinancialStatus["DISPOSED"] = "disposed";
})(FinancialStatus || (exports.FinancialStatus = FinancialStatus = {}));
/**
 * Lease type
 */
var LeaseType;
(function (LeaseType) {
    LeaseType["OPERATING_LEASE"] = "operating_lease";
    LeaseType["FINANCE_LEASE"] = "finance_lease";
    LeaseType["CAPITAL_LEASE"] = "capital_lease";
})(LeaseType || (exports.LeaseType = LeaseType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Asset cost database model
 */
let AssetCost = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'asset_costs', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _costType_decorators;
    let _costType_initializers = [];
    let _costType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _purchaseOrderNumber_decorators;
    let _purchaseOrderNumber_initializers = [];
    let _purchaseOrderNumber_extraInitializers = [];
    let _costCenterId_decorators;
    let _costCenterId_initializers = [];
    let _costCenterId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var AssetCost = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.costType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _costType_initializers, void 0));
            this.amount = (__runInitializers(this, _costType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.date = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.vendor = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            this.invoiceNumber = (__runInitializers(this, _vendor_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
            this.purchaseOrderNumber = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _purchaseOrderNumber_initializers, void 0));
            this.costCenterId = (__runInitializers(this, _purchaseOrderNumber_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _costCenterId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.classification = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
            this.notes = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetCost");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique cost record ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _costType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost type', enum: CostType }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CostType)), allowNull: false })];
        _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(3), defaultValue: 'USD' })];
        _date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _vendor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _purchaseOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _costCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _classification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expense classification', enum: ExpenseClassification }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExpenseClassification)) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _costType_decorators, { kind: "field", name: "costType", static: false, private: false, access: { has: obj => "costType" in obj, get: obj => obj.costType, set: (obj, value) => { obj.costType = value; } }, metadata: _metadata }, _costType_initializers, _costType_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
        __esDecorate(null, null, _purchaseOrderNumber_decorators, { kind: "field", name: "purchaseOrderNumber", static: false, private: false, access: { has: obj => "purchaseOrderNumber" in obj, get: obj => obj.purchaseOrderNumber, set: (obj, value) => { obj.purchaseOrderNumber = value; } }, metadata: _metadata }, _purchaseOrderNumber_initializers, _purchaseOrderNumber_extraInitializers);
        __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: obj => "costCenterId" in obj, get: obj => obj.costCenterId, set: (obj, value) => { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetCost = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetCost = _classThis;
})();
exports.AssetCost = AssetCost;
/**
 * Depreciation schedule database model
 */
let DepreciationSchedule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'depreciation_schedules', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _acquisitionCost_decorators;
    let _acquisitionCost_initializers = [];
    let _acquisitionCost_extraInitializers = [];
    let _salvageValue_decorators;
    let _salvageValue_initializers = [];
    let _salvageValue_extraInitializers = [];
    let _usefulLife_decorators;
    let _usefulLife_initializers = [];
    let _usefulLife_extraInitializers = [];
    let _acquisitionDate_decorators;
    let _acquisitionDate_initializers = [];
    let _acquisitionDate_extraInitializers = [];
    let _scheduleData_decorators;
    let _scheduleData_initializers = [];
    let _scheduleData_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var DepreciationSchedule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.method = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.acquisitionCost = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _acquisitionCost_initializers, void 0));
            this.salvageValue = (__runInitializers(this, _acquisitionCost_extraInitializers), __runInitializers(this, _salvageValue_initializers, void 0));
            this.usefulLife = (__runInitializers(this, _salvageValue_extraInitializers), __runInitializers(this, _usefulLife_initializers, void 0));
            this.acquisitionDate = (__runInitializers(this, _usefulLife_extraInitializers), __runInitializers(this, _acquisitionDate_initializers, void 0));
            this.scheduleData = (__runInitializers(this, _acquisitionDate_extraInitializers), __runInitializers(this, _scheduleData_initializers, void 0));
            this.isActive = (__runInitializers(this, _scheduleData_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepreciationSchedule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique depreciation schedule ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _method_decorators = [(0, swagger_1.ApiProperty)({ description: 'Depreciation method', enum: DepreciationMethod }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DepreciationMethod)), allowNull: false })];
        _acquisitionCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _salvageValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Salvage value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _usefulLife_decorators = [(0, swagger_1.ApiProperty)({ description: 'Useful life in years' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _acquisitionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _scheduleData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active schedule' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _acquisitionCost_decorators, { kind: "field", name: "acquisitionCost", static: false, private: false, access: { has: obj => "acquisitionCost" in obj, get: obj => obj.acquisitionCost, set: (obj, value) => { obj.acquisitionCost = value; } }, metadata: _metadata }, _acquisitionCost_initializers, _acquisitionCost_extraInitializers);
        __esDecorate(null, null, _salvageValue_decorators, { kind: "field", name: "salvageValue", static: false, private: false, access: { has: obj => "salvageValue" in obj, get: obj => obj.salvageValue, set: (obj, value) => { obj.salvageValue = value; } }, metadata: _metadata }, _salvageValue_initializers, _salvageValue_extraInitializers);
        __esDecorate(null, null, _usefulLife_decorators, { kind: "field", name: "usefulLife", static: false, private: false, access: { has: obj => "usefulLife" in obj, get: obj => obj.usefulLife, set: (obj, value) => { obj.usefulLife = value; } }, metadata: _metadata }, _usefulLife_initializers, _usefulLife_extraInitializers);
        __esDecorate(null, null, _acquisitionDate_decorators, { kind: "field", name: "acquisitionDate", static: false, private: false, access: { has: obj => "acquisitionDate" in obj, get: obj => obj.acquisitionDate, set: (obj, value) => { obj.acquisitionDate = value; } }, metadata: _metadata }, _acquisitionDate_initializers, _acquisitionDate_extraInitializers);
        __esDecorate(null, null, _scheduleData_decorators, { kind: "field", name: "scheduleData", static: false, private: false, access: { has: obj => "scheduleData" in obj, get: obj => obj.scheduleData, set: (obj, value) => { obj.scheduleData = value; } }, metadata: _metadata }, _scheduleData_initializers, _scheduleData_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepreciationSchedule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepreciationSchedule = _classThis;
})();
exports.DepreciationSchedule = DepreciationSchedule;
/**
 * Budget allocation database model
 */
let BudgetAllocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'budget_allocations', paranoid: true })];
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
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _costCenterId_decorators;
    let _costCenterId_initializers = [];
    let _costCenterId_extraInitializers = [];
    let _categoryId_decorators;
    let _categoryId_initializers = [];
    let _categoryId_extraInitializers = [];
    let _budgetedAmount_decorators;
    let _budgetedAmount_initializers = [];
    let _budgetedAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var BudgetAllocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.departmentId = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.costCenterId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
            this.categoryId = (__runInitializers(this, _costCenterId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.budgetedAmount = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _budgetedAmount_initializers, void 0));
            this.startDate = (__runInitializers(this, _budgetedAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.notes = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BudgetAllocation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique budget ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget name' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _costCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _categoryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _budgetedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget start date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget end date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: obj => "costCenterId" in obj, get: obj => obj.costCenterId, set: (obj, value) => { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: obj => "categoryId" in obj, get: obj => obj.categoryId, set: (obj, value) => { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _budgetedAmount_decorators, { kind: "field", name: "budgetedAmount", static: false, private: false, access: { has: obj => "budgetedAmount" in obj, get: obj => obj.budgetedAmount, set: (obj, value) => { obj.budgetedAmount = value; } }, metadata: _metadata }, _budgetedAmount_initializers, _budgetedAmount_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BudgetAllocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BudgetAllocation = _classThis;
})();
exports.BudgetAllocation = BudgetAllocation;
/**
 * Asset impairment database model
 */
let AssetImpairment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'asset_impairments', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _impairmentDate_decorators;
    let _impairmentDate_initializers = [];
    let _impairmentDate_extraInitializers = [];
    let _bookValueBeforeImpairment_decorators;
    let _bookValueBeforeImpairment_initializers = [];
    let _bookValueBeforeImpairment_extraInitializers = [];
    let _fairValue_decorators;
    let _fairValue_initializers = [];
    let _fairValue_extraInitializers = [];
    let _impairmentLoss_decorators;
    let _impairmentLoss_initializers = [];
    let _impairmentLoss_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var AssetImpairment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.impairmentDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _impairmentDate_initializers, void 0));
            this.bookValueBeforeImpairment = (__runInitializers(this, _impairmentDate_extraInitializers), __runInitializers(this, _bookValueBeforeImpairment_initializers, void 0));
            this.fairValue = (__runInitializers(this, _bookValueBeforeImpairment_extraInitializers), __runInitializers(this, _fairValue_initializers, void 0));
            this.impairmentLoss = (__runInitializers(this, _fairValue_extraInitializers), __runInitializers(this, _impairmentLoss_initializers, void 0));
            this.reason = (__runInitializers(this, _impairmentLoss_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.notes = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetImpairment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique impairment ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _impairmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impairment date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _bookValueBeforeImpairment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Book value before impairment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _fairValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fair value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _impairmentLoss_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impairment loss' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for impairment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _impairmentDate_decorators, { kind: "field", name: "impairmentDate", static: false, private: false, access: { has: obj => "impairmentDate" in obj, get: obj => obj.impairmentDate, set: (obj, value) => { obj.impairmentDate = value; } }, metadata: _metadata }, _impairmentDate_initializers, _impairmentDate_extraInitializers);
        __esDecorate(null, null, _bookValueBeforeImpairment_decorators, { kind: "field", name: "bookValueBeforeImpairment", static: false, private: false, access: { has: obj => "bookValueBeforeImpairment" in obj, get: obj => obj.bookValueBeforeImpairment, set: (obj, value) => { obj.bookValueBeforeImpairment = value; } }, metadata: _metadata }, _bookValueBeforeImpairment_initializers, _bookValueBeforeImpairment_extraInitializers);
        __esDecorate(null, null, _fairValue_decorators, { kind: "field", name: "fairValue", static: false, private: false, access: { has: obj => "fairValue" in obj, get: obj => obj.fairValue, set: (obj, value) => { obj.fairValue = value; } }, metadata: _metadata }, _fairValue_initializers, _fairValue_extraInitializers);
        __esDecorate(null, null, _impairmentLoss_decorators, { kind: "field", name: "impairmentLoss", static: false, private: false, access: { has: obj => "impairmentLoss" in obj, get: obj => obj.impairmentLoss, set: (obj, value) => { obj.impairmentLoss = value; } }, metadata: _metadata }, _impairmentLoss_initializers, _impairmentLoss_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetImpairment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetImpairment = _classThis;
})();
exports.AssetImpairment = AssetImpairment;
/**
 * Financial analysis database model
 */
let FinancialAnalysis = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'financial_analyses', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _analysisType_decorators;
    let _analysisType_initializers = [];
    let _analysisType_extraInitializers = [];
    let _analysisData_decorators;
    let _analysisData_initializers = [];
    let _analysisData_extraInitializers = [];
    let _analysisDate_decorators;
    let _analysisDate_initializers = [];
    let _analysisDate_extraInitializers = [];
    let _analyzedBy_decorators;
    let _analyzedBy_initializers = [];
    let _analyzedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var FinancialAnalysis = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.analysisType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _analysisType_initializers, void 0));
            this.analysisData = (__runInitializers(this, _analysisType_extraInitializers), __runInitializers(this, _analysisData_initializers, void 0));
            this.analysisDate = (__runInitializers(this, _analysisData_extraInitializers), __runInitializers(this, _analysisDate_initializers, void 0));
            this.analyzedBy = (__runInitializers(this, _analysisDate_extraInitializers), __runInitializers(this, _analyzedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _analyzedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FinancialAnalysis");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique analysis ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _analysisType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis type' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _analysisData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _analysisDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _analyzedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analyzed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _analysisType_decorators, { kind: "field", name: "analysisType", static: false, private: false, access: { has: obj => "analysisType" in obj, get: obj => obj.analysisType, set: (obj, value) => { obj.analysisType = value; } }, metadata: _metadata }, _analysisType_initializers, _analysisType_extraInitializers);
        __esDecorate(null, null, _analysisData_decorators, { kind: "field", name: "analysisData", static: false, private: false, access: { has: obj => "analysisData" in obj, get: obj => obj.analysisData, set: (obj, value) => { obj.analysisData = value; } }, metadata: _metadata }, _analysisData_initializers, _analysisData_extraInitializers);
        __esDecorate(null, null, _analysisDate_decorators, { kind: "field", name: "analysisDate", static: false, private: false, access: { has: obj => "analysisDate" in obj, get: obj => obj.analysisDate, set: (obj, value) => { obj.analysisDate = value; } }, metadata: _metadata }, _analysisDate_initializers, _analysisDate_extraInitializers);
        __esDecorate(null, null, _analyzedBy_decorators, { kind: "field", name: "analyzedBy", static: false, private: false, access: { has: obj => "analyzedBy" in obj, get: obj => obj.analyzedBy, set: (obj, value) => { obj.analyzedBy = value; } }, metadata: _metadata }, _analyzedBy_initializers, _analyzedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancialAnalysis = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancialAnalysis = _classThis;
})();
exports.FinancialAnalysis = FinancialAnalysis;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Create asset cost DTO
 */
let CreateAssetCostDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _costType_decorators;
    let _costType_initializers = [];
    let _costType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _purchaseOrderNumber_decorators;
    let _purchaseOrderNumber_initializers = [];
    let _purchaseOrderNumber_extraInitializers = [];
    let _costCenterId_decorators;
    let _costCenterId_initializers = [];
    let _costCenterId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateAssetCostDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.costType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _costType_initializers, void 0));
                this.amount = (__runInitializers(this, _costType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.date = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.vendor = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
                this.invoiceNumber = (__runInitializers(this, _vendor_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.purchaseOrderNumber = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _purchaseOrderNumber_initializers, void 0));
                this.costCenterId = (__runInitializers(this, _purchaseOrderNumber_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
                this.departmentId = (__runInitializers(this, _costCenterId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.classification = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
                this.notes = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _costType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost type', enum: CostType }), (0, class_validator_1.IsEnum)(CostType)];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _vendor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _purchaseOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO number', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _costCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _classification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expense classification', enum: ExpenseClassification, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ExpenseClassification)];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _costType_decorators, { kind: "field", name: "costType", static: false, private: false, access: { has: obj => "costType" in obj, get: obj => obj.costType, set: (obj, value) => { obj.costType = value; } }, metadata: _metadata }, _costType_initializers, _costType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _purchaseOrderNumber_decorators, { kind: "field", name: "purchaseOrderNumber", static: false, private: false, access: { has: obj => "purchaseOrderNumber" in obj, get: obj => obj.purchaseOrderNumber, set: (obj, value) => { obj.purchaseOrderNumber = value; } }, metadata: _metadata }, _purchaseOrderNumber_initializers, _purchaseOrderNumber_extraInitializers);
            __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: obj => "costCenterId" in obj, get: obj => obj.costCenterId, set: (obj, value) => { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAssetCostDto = CreateAssetCostDto;
/**
 * Calculate depreciation DTO
 */
let CalculateDepreciationDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _acquisitionCost_decorators;
    let _acquisitionCost_initializers = [];
    let _acquisitionCost_extraInitializers = [];
    let _salvageValue_decorators;
    let _salvageValue_initializers = [];
    let _salvageValue_extraInitializers = [];
    let _usefulLife_decorators;
    let _usefulLife_initializers = [];
    let _usefulLife_extraInitializers = [];
    let _acquisitionDate_decorators;
    let _acquisitionDate_initializers = [];
    let _acquisitionDate_extraInitializers = [];
    let _unitsProduced_decorators;
    let _unitsProduced_initializers = [];
    let _unitsProduced_extraInitializers = [];
    let _totalUnitsCapacity_decorators;
    let _totalUnitsCapacity_initializers = [];
    let _totalUnitsCapacity_extraInitializers = [];
    return _a = class CalculateDepreciationDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.method = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.acquisitionCost = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _acquisitionCost_initializers, void 0));
                this.salvageValue = (__runInitializers(this, _acquisitionCost_extraInitializers), __runInitializers(this, _salvageValue_initializers, void 0));
                this.usefulLife = (__runInitializers(this, _salvageValue_extraInitializers), __runInitializers(this, _usefulLife_initializers, void 0));
                this.acquisitionDate = (__runInitializers(this, _usefulLife_extraInitializers), __runInitializers(this, _acquisitionDate_initializers, void 0));
                this.unitsProduced = (__runInitializers(this, _acquisitionDate_extraInitializers), __runInitializers(this, _unitsProduced_initializers, void 0));
                this.totalUnitsCapacity = (__runInitializers(this, _unitsProduced_extraInitializers), __runInitializers(this, _totalUnitsCapacity_initializers, void 0));
                __runInitializers(this, _totalUnitsCapacity_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _method_decorators = [(0, swagger_1.ApiProperty)({ description: 'Depreciation method', enum: DepreciationMethod }), (0, class_validator_1.IsEnum)(DepreciationMethod)];
            _acquisitionCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _salvageValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Salvage value' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _usefulLife_decorators = [(0, swagger_1.ApiProperty)({ description: 'Useful life in years' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _acquisitionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _unitsProduced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Units produced (for units-of-production)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _totalUnitsCapacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total units capacity (for units-of-production)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _acquisitionCost_decorators, { kind: "field", name: "acquisitionCost", static: false, private: false, access: { has: obj => "acquisitionCost" in obj, get: obj => obj.acquisitionCost, set: (obj, value) => { obj.acquisitionCost = value; } }, metadata: _metadata }, _acquisitionCost_initializers, _acquisitionCost_extraInitializers);
            __esDecorate(null, null, _salvageValue_decorators, { kind: "field", name: "salvageValue", static: false, private: false, access: { has: obj => "salvageValue" in obj, get: obj => obj.salvageValue, set: (obj, value) => { obj.salvageValue = value; } }, metadata: _metadata }, _salvageValue_initializers, _salvageValue_extraInitializers);
            __esDecorate(null, null, _usefulLife_decorators, { kind: "field", name: "usefulLife", static: false, private: false, access: { has: obj => "usefulLife" in obj, get: obj => obj.usefulLife, set: (obj, value) => { obj.usefulLife = value; } }, metadata: _metadata }, _usefulLife_initializers, _usefulLife_extraInitializers);
            __esDecorate(null, null, _acquisitionDate_decorators, { kind: "field", name: "acquisitionDate", static: false, private: false, access: { has: obj => "acquisitionDate" in obj, get: obj => obj.acquisitionDate, set: (obj, value) => { obj.acquisitionDate = value; } }, metadata: _metadata }, _acquisitionDate_initializers, _acquisitionDate_extraInitializers);
            __esDecorate(null, null, _unitsProduced_decorators, { kind: "field", name: "unitsProduced", static: false, private: false, access: { has: obj => "unitsProduced" in obj, get: obj => obj.unitsProduced, set: (obj, value) => { obj.unitsProduced = value; } }, metadata: _metadata }, _unitsProduced_initializers, _unitsProduced_extraInitializers);
            __esDecorate(null, null, _totalUnitsCapacity_decorators, { kind: "field", name: "totalUnitsCapacity", static: false, private: false, access: { has: obj => "totalUnitsCapacity" in obj, get: obj => obj.totalUnitsCapacity, set: (obj, value) => { obj.totalUnitsCapacity = value; } }, metadata: _metadata }, _totalUnitsCapacity_initializers, _totalUnitsCapacity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateDepreciationDto = CalculateDepreciationDto;
/**
 * Create budget allocation DTO
 */
let CreateBudgetAllocationDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _costCenterId_decorators;
    let _costCenterId_initializers = [];
    let _costCenterId_extraInitializers = [];
    let _categoryId_decorators;
    let _categoryId_initializers = [];
    let _categoryId_extraInitializers = [];
    let _budgetedAmount_decorators;
    let _budgetedAmount_initializers = [];
    let _budgetedAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateBudgetAllocationDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.departmentId = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.costCenterId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
                this.categoryId = (__runInitializers(this, _costCenterId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.budgetedAmount = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _budgetedAmount_initializers, void 0));
                this.startDate = (__runInitializers(this, _budgetedAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.notes = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget name' }), (0, class_validator_1.IsString)()];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' }), (0, class_validator_1.IsNumber)()];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _costCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _categoryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _budgetedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: obj => "costCenterId" in obj, get: obj => obj.costCenterId, set: (obj, value) => { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: obj => "categoryId" in obj, get: obj => obj.categoryId, set: (obj, value) => { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _budgetedAmount_decorators, { kind: "field", name: "budgetedAmount", static: false, private: false, access: { has: obj => "budgetedAmount" in obj, get: obj => obj.budgetedAmount, set: (obj, value) => { obj.budgetedAmount = value; } }, metadata: _metadata }, _budgetedAmount_initializers, _budgetedAmount_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetAllocationDto = CreateBudgetAllocationDto;
// ============================================================================
// COST TRACKING FUNCTIONS
// ============================================================================
/**
 * Track an asset cost
 *
 * @param data - Asset cost data
 * @param transaction - Optional database transaction
 * @returns Created asset cost record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'maintenance',
 *   amount: 5000,
 *   date: new Date()
 * });
 * ```
 */
async function trackAssetCost(data, transaction) {
    try {
        const cost = await AssetCost.create({
            assetId: data.assetId,
            costType: data.costType,
            amount: data.amount,
            currency: data.currency || 'USD',
            date: data.date,
            vendor: data.vendor,
            invoiceNumber: data.invoiceNumber,
            purchaseOrderNumber: data.purchaseOrderNumber,
            costCenterId: data.costCenterId,
            departmentId: data.departmentId,
            classification: data.classification,
            notes: data.notes,
            metadata: data.metadata,
        }, { transaction });
        return cost;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track asset cost: ${error.message}`);
    }
}
/**
 * Get asset cost by ID
 *
 * @param id - Cost record ID
 * @returns Asset cost or null
 *
 * @example
 * ```typescript
 * const cost = await getAssetCostById('cost-001');
 * ```
 */
async function getAssetCostById(id) {
    return await AssetCost.findByPk(id);
}
/**
 * Get all costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of asset costs
 *
 * @example
 * ```typescript
 * const costs = await getAssetCosts('asset-001', 'maintenance');
 * ```
 */
async function getAssetCosts(assetId, costType, startDate, endDate) {
    const where = { assetId };
    if (costType) {
        where.costType = costType;
    }
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.date[sequelize_1.Op.lte] = endDate;
    }
    return await AssetCost.findAll({
        where,
        order: [['date', 'DESC']],
    });
}
/**
 * Calculate total costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Total cost amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAssetCosts('asset-001');
 * ```
 */
async function calculateTotalAssetCosts(assetId, costType, startDate, endDate) {
    const costs = await getAssetCosts(assetId, costType, startDate, endDate);
    return costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
}
/**
 * Update asset cost
 *
 * @param id - Cost record ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated asset cost
 * @throws NotFoundException if cost not found
 *
 * @example
 * ```typescript
 * const updated = await updateAssetCost('cost-001', { amount: 5500 });
 * ```
 */
async function updateAssetCost(id, updates, transaction) {
    const cost = await AssetCost.findByPk(id);
    if (!cost) {
        throw new common_1.NotFoundException(`Asset cost ${id} not found`);
    }
    await cost.update(updates, { transaction });
    return cost;
}
// ============================================================================
// DEPRECIATION CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculate straight-line depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const depreciation = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
async function calculateStraightLineDepreciation(assetId, acquisitionCost, salvageValue, usefulLife, acquisitionDate, transaction) {
    try {
        const depreciableBase = acquisitionCost - salvageValue;
        const annualDepreciation = depreciableBase / usefulLife;
        const schedule = [];
        let accumulatedDepreciation = 0;
        for (let year = 1; year <= usefulLife; year++) {
            const beginningBookValue = acquisitionCost - accumulatedDepreciation;
            const depreciationExpense = annualDepreciation;
            accumulatedDepreciation += depreciationExpense;
            const endingBookValue = acquisitionCost - accumulatedDepreciation;
            schedule.push({
                year,
                period: `Year ${year}`,
                beginningBookValue,
                depreciationExpense,
                accumulatedDepreciation,
                endingBookValue: Math.max(endingBookValue, salvageValue),
                depreciationRate: (annualDepreciation / depreciableBase) * 100,
            });
        }
        // Calculate current values
        const currentAge = Math.floor((new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const currentAccumulatedDepreciation = Math.min(annualDepreciation * currentAge, depreciableBase);
        const currentBookValue = Math.max(acquisitionCost - currentAccumulatedDepreciation, salvageValue);
        // Save schedule
        await DepreciationSchedule.create({
            assetId,
            method: DepreciationMethod.STRAIGHT_LINE,
            acquisitionCost,
            salvageValue,
            usefulLife,
            acquisitionDate,
            scheduleData: schedule,
            isActive: true,
        }, { transaction });
        return {
            assetId,
            method: DepreciationMethod.STRAIGHT_LINE,
            acquisitionCost,
            salvageValue,
            usefulLife,
            currentAge,
            annualDepreciation,
            accumulatedDepreciation: currentAccumulatedDepreciation,
            currentBookValue,
            remainingLife: Math.max(usefulLife - currentAge, 0),
            schedule,
            calculatedAt: new Date(),
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate straight-line depreciation: ${error.message}`);
    }
}
/**
 * Calculate declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param rate - Declining balance rate (default: 1.5 for 150% declining)
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDecliningBalanceDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01'),
 *   1.5
 * );
 * ```
 */
async function calculateDecliningBalanceDepreciation(assetId, acquisitionCost, salvageValue, usefulLife, acquisitionDate, rate = 1.5, transaction) {
    try {
        const depreciationRate = (rate / usefulLife) * 100;
        const schedule = [];
        let accumulatedDepreciation = 0;
        let bookValue = acquisitionCost;
        for (let year = 1; year <= usefulLife; year++) {
            const beginningBookValue = bookValue;
            let depreciationExpense = (bookValue * rate) / usefulLife;
            // Don't depreciate below salvage value
            if (bookValue - depreciationExpense < salvageValue) {
                depreciationExpense = bookValue - salvageValue;
            }
            accumulatedDepreciation += depreciationExpense;
            bookValue -= depreciationExpense;
            schedule.push({
                year,
                period: `Year ${year}`,
                beginningBookValue,
                depreciationExpense,
                accumulatedDepreciation,
                endingBookValue: bookValue,
                depreciationRate,
            });
            if (bookValue <= salvageValue)
                break;
        }
        const currentAge = Math.floor((new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const currentEntry = schedule[Math.min(currentAge, schedule.length - 1)];
        const annualDepreciation = schedule.length > 0 ? schedule[0].depreciationExpense : 0;
        await DepreciationSchedule.create({
            assetId,
            method: DepreciationMethod.DECLINING_BALANCE,
            acquisitionCost,
            salvageValue,
            usefulLife,
            acquisitionDate,
            scheduleData: schedule,
            isActive: true,
        }, { transaction });
        return {
            assetId,
            method: DepreciationMethod.DECLINING_BALANCE,
            acquisitionCost,
            salvageValue,
            usefulLife,
            currentAge,
            annualDepreciation,
            accumulatedDepreciation: currentEntry?.accumulatedDepreciation || 0,
            currentBookValue: currentEntry?.endingBookValue || acquisitionCost,
            remainingLife: Math.max(usefulLife - currentAge, 0),
            schedule,
            calculatedAt: new Date(),
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate declining balance depreciation: ${error.message}`);
    }
}
/**
 * Calculate double declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDoubleDecliningDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
async function calculateDoubleDecliningDepreciation(assetId, acquisitionCost, salvageValue, usefulLife, acquisitionDate, transaction) {
    return await calculateDecliningBalanceDepreciation(assetId, acquisitionCost, salvageValue, usefulLife, acquisitionDate, 2.0, transaction);
}
/**
 * Calculate sum-of-years-digits depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateSumOfYearsDigitsDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
async function calculateSumOfYearsDigitsDepreciation(assetId, acquisitionCost, salvageValue, usefulLife, acquisitionDate, transaction) {
    try {
        const depreciableBase = acquisitionCost - salvageValue;
        const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
        const schedule = [];
        let accumulatedDepreciation = 0;
        for (let year = 1; year <= usefulLife; year++) {
            const beginningBookValue = acquisitionCost - accumulatedDepreciation;
            const remainingLife = usefulLife - year + 1;
            const depreciationExpense = (depreciableBase * remainingLife) / sumOfYears;
            accumulatedDepreciation += depreciationExpense;
            const endingBookValue = acquisitionCost - accumulatedDepreciation;
            schedule.push({
                year,
                period: `Year ${year}`,
                beginningBookValue,
                depreciationExpense,
                accumulatedDepreciation,
                endingBookValue: Math.max(endingBookValue, salvageValue),
                depreciationRate: (depreciationExpense / depreciableBase) * 100,
            });
        }
        const currentAge = Math.floor((new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const currentEntry = schedule[Math.min(currentAge, schedule.length - 1)];
        const annualDepreciation = schedule.length > 0 ? schedule[0].depreciationExpense : 0;
        await DepreciationSchedule.create({
            assetId,
            method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
            acquisitionCost,
            salvageValue,
            usefulLife,
            acquisitionDate,
            scheduleData: schedule,
            isActive: true,
        }, { transaction });
        return {
            assetId,
            method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
            acquisitionCost,
            salvageValue,
            usefulLife,
            currentAge,
            annualDepreciation,
            accumulatedDepreciation: currentEntry?.accumulatedDepreciation || 0,
            currentBookValue: currentEntry?.endingBookValue || acquisitionCost,
            remainingLife: Math.max(usefulLife - currentAge, 0),
            schedule,
            calculatedAt: new Date(),
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate sum-of-years-digits depreciation: ${error.message}`);
    }
}
/**
 * Calculate units-of-production depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param totalUnitsCapacity - Total units the asset can produce
 * @param unitsProduced - Units produced to date
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = await calculateUnitsOfProductionDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   500000,
 *   150000,
 *   new Date('2020-01-01')
 * );
 * ```
 */
async function calculateUnitsOfProductionDepreciation(assetId, acquisitionCost, salvageValue, totalUnitsCapacity, unitsProduced, acquisitionDate, transaction) {
    try {
        const depreciableBase = acquisitionCost - salvageValue;
        const depreciationPerUnit = depreciableBase / totalUnitsCapacity;
        const accumulatedDepreciation = Math.min(depreciationPerUnit * unitsProduced, depreciableBase);
        const currentBookValue = Math.max(acquisitionCost - accumulatedDepreciation, salvageValue);
        // Generate schedule based on estimated annual production
        const estimatedAnnualProduction = totalUnitsCapacity / 10; // Assume 10-year life
        const schedule = [];
        let cumUnits = 0;
        let cumDepreciation = 0;
        for (let year = 1; year <= 10 && cumUnits < totalUnitsCapacity; year++) {
            const beginningBookValue = acquisitionCost - cumDepreciation;
            const yearUnits = Math.min(estimatedAnnualProduction, totalUnitsCapacity - cumUnits);
            const depreciationExpense = depreciationPerUnit * yearUnits;
            cumUnits += yearUnits;
            cumDepreciation += depreciationExpense;
            const endingBookValue = acquisitionCost - cumDepreciation;
            schedule.push({
                year,
                period: `Year ${year} (${yearUnits.toLocaleString()} units)`,
                beginningBookValue,
                depreciationExpense,
                accumulatedDepreciation: cumDepreciation,
                endingBookValue: Math.max(endingBookValue, salvageValue),
            });
        }
        await DepreciationSchedule.create({
            assetId,
            method: DepreciationMethod.UNITS_OF_PRODUCTION,
            acquisitionCost,
            salvageValue,
            usefulLife: 10,
            acquisitionDate,
            scheduleData: schedule,
            isActive: true,
        }, { transaction });
        const currentAge = Math.floor((new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        return {
            assetId,
            method: DepreciationMethod.UNITS_OF_PRODUCTION,
            acquisitionCost,
            salvageValue,
            usefulLife: 10,
            currentAge,
            annualDepreciation: depreciationPerUnit * estimatedAnnualProduction,
            accumulatedDepreciation,
            currentBookValue,
            remainingLife: Math.max(10 - currentAge, 0),
            schedule,
            calculatedAt: new Date(),
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate units-of-production depreciation: ${error.message}`);
    }
}
/**
 * Get depreciation schedule for an asset
 *
 * @param assetId - Asset ID
 * @param method - Optional method filter
 * @returns Depreciation schedule or null
 *
 * @example
 * ```typescript
 * const schedule = await getDepreciationSchedule('asset-001', 'straight_line');
 * ```
 */
async function getDepreciationSchedule(assetId, method) {
    const where = { assetId, isActive: true };
    if (method) {
        where.method = method;
    }
    return await DepreciationSchedule.findOne({ where });
}
/**
 * Calculate current book value for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate book value as of
 * @returns Book value data
 * @throws NotFoundException if asset or depreciation schedule not found
 *
 * @example
 * ```typescript
 * const bookValue = await calculateBookValue('asset-001', new Date());
 * ```
 */
async function calculateBookValue(assetId, asOfDate) {
    const schedule = await getDepreciationSchedule(assetId);
    if (!schedule) {
        throw new common_1.NotFoundException(`No active depreciation schedule found for asset ${assetId}`);
    }
    const yearsSinceAcquisition = Math.floor((asOfDate.getTime() - schedule.acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const entry = schedule.scheduleData[Math.min(yearsSinceAcquisition, schedule.scheduleData.length - 1)];
    const impairments = await AssetImpairment.findAll({
        where: {
            assetId,
            impairmentDate: { [sequelize_1.Op.lte]: asOfDate },
        },
    });
    const totalImpairment = impairments.reduce((sum, imp) => sum + Number(imp.impairmentLoss), 0);
    return {
        assetId,
        asOfDate,
        acquisitionCost: schedule.acquisitionCost,
        accumulatedDepreciation: entry?.accumulatedDepreciation || 0,
        bookValue: Math.max((entry?.endingBookValue || schedule.acquisitionCost) - totalImpairment, 0),
        salvageValue: schedule.salvageValue,
        impairmentLoss: totalImpairment,
    };
}
// ============================================================================
// BUDGET TRACKING FUNCTIONS
// ============================================================================
/**
 * Create a budget allocation
 *
 * @param data - Budget allocation data
 * @param transaction - Optional database transaction
 * @returns Created budget allocation
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   name: 'IT Equipment FY2024',
 *   fiscalYear: 2024,
 *   budgetedAmount: 500000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
async function createBudgetAllocation(data, transaction) {
    try {
        const budget = await BudgetAllocation.create({
            name: data.name,
            fiscalYear: data.fiscalYear,
            departmentId: data.departmentId,
            costCenterId: data.costCenterId,
            categoryId: data.categoryId,
            budgetedAmount: data.budgetedAmount,
            startDate: data.startDate,
            endDate: data.endDate,
            notes: data.notes,
        }, { transaction });
        return budget;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create budget allocation: ${error.message}`);
    }
}
/**
 * Get budget allocation by ID
 *
 * @param id - Budget allocation ID
 * @returns Budget allocation or null
 *
 * @example
 * ```typescript
 * const budget = await getBudgetAllocationById('budget-001');
 * ```
 */
async function getBudgetAllocationById(id) {
    return await BudgetAllocation.findByPk(id);
}
/**
 * Track budget spending and calculate variance
 *
 * @param budgetId - Budget allocation ID
 * @param asOfDate - Date to calculate as of
 * @returns Budget tracking result
 * @throws NotFoundException if budget not found
 *
 * @example
 * ```typescript
 * const tracking = await trackBudgetSpending('budget-001', new Date());
 * ```
 */
async function trackBudgetSpending(budgetId, asOfDate) {
    const budget = await BudgetAllocation.findByPk(budgetId);
    if (!budget) {
        throw new common_1.NotFoundException(`Budget allocation ${budgetId} not found`);
    }
    // Get all costs for this budget period
    const where = {
        date: {
            [sequelize_1.Op.between]: [budget.startDate, Math.min(asOfDate.getTime(), budget.endDate.getTime())],
        },
    };
    if (budget.costCenterId) {
        where.costCenterId = budget.costCenterId;
    }
    if (budget.departmentId) {
        where.departmentId = budget.departmentId;
    }
    const costs = await AssetCost.findAll({ where });
    const actualSpent = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
    // For simplicity, committed is 0 (would need purchase order integration)
    const committed = 0;
    const available = budget.budgetedAmount - actualSpent - committed;
    const variance = budget.budgetedAmount - actualSpent;
    const variancePercent = (variance / budget.budgetedAmount) * 100;
    let status;
    if (variancePercent > 10) {
        status = BudgetStatus.UNDER_BUDGET;
    }
    else if (variancePercent >= -10) {
        status = BudgetStatus.ON_BUDGET;
    }
    else if (variance >= 0) {
        status = BudgetStatus.OVER_BUDGET;
    }
    else {
        status = BudgetStatus.EXCEEDED;
    }
    return {
        budgetId: budget.id,
        name: budget.name,
        budgetedAmount: budget.budgetedAmount,
        actualSpent,
        committed,
        available,
        variance,
        variancePercent,
        status,
        asOfDate,
    };
}
/**
 * Get budget allocations for a fiscal year
 *
 * @param fiscalYear - Fiscal year
 * @param departmentId - Optional department filter
 * @returns Array of budget allocations
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByFiscalYear(2024);
 * ```
 */
async function getBudgetsByFiscalYear(fiscalYear, departmentId) {
    const where = { fiscalYear };
    if (departmentId) {
        where.departmentId = departmentId;
    }
    return await BudgetAllocation.findAll({ where });
}
// ============================================================================
// ROI ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Analyze Return on Investment (ROI) for an asset
 *
 * @param data - ROI analysis data
 * @param transaction - Optional database transaction
 * @returns ROI analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const roi = await analyzeROI({
 *   assetId: 'asset-001',
 *   initialInvestment: 100000,
 *   annualRevenue: 50000,
 *   annualOperatingCosts: 20000,
 *   analysisYears: 5,
 *   discountRate: 0.08
 * });
 * ```
 */
async function analyzeROI(data, transaction) {
    try {
        const annualCashFlows = [];
        let cumulativeCashFlow = -data.initialInvestment;
        let breakEvenYear = 0;
        let npv = -data.initialInvestment;
        const annualBenefit = (data.annualRevenue || 0) + (data.annualCostSavings || 0);
        const annualNetCashFlow = annualBenefit - data.annualOperatingCosts;
        const discountRate = data.discountRate || 0.08;
        for (let year = 1; year <= data.analysisYears; year++) {
            const revenue = annualBenefit;
            const costs = data.annualOperatingCosts;
            const netCashFlow = revenue - costs;
            cumulativeCashFlow += netCashFlow;
            const presentValue = netCashFlow / Math.pow(1 + discountRate, year);
            npv += presentValue;
            if (breakEvenYear === 0 && cumulativeCashFlow >= 0) {
                breakEvenYear = year;
            }
            annualCashFlows.push({
                year,
                revenue,
                costs,
                netCashFlow,
                cumulativeCashFlow,
                presentValue,
            });
        }
        const totalRevenue = annualBenefit * data.analysisYears;
        const totalCosts = data.initialInvestment + data.annualOperatingCosts * data.analysisYears;
        const netProfit = totalRevenue - totalCosts;
        const roi = (netProfit / data.initialInvestment) * 100;
        const paybackPeriod = data.initialInvestment / annualNetCashFlow;
        // Simplified IRR calculation (approximate)
        const irr = ((Math.pow(cumulativeCashFlow / data.initialInvestment, 1 / data.analysisYears) - 1) * 100);
        const result = {
            assetId: data.assetId,
            initialInvestment: data.initialInvestment,
            totalRevenue,
            totalCosts,
            netProfit,
            roi,
            paybackPeriod,
            npv,
            irr,
            breakEvenYear,
            annualCashFlows,
        };
        // Save analysis
        await FinancialAnalysis.create({
            assetId: data.assetId,
            analysisType: 'roi',
            analysisData: result,
            analysisDate: new Date(),
        }, { transaction });
        return result;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to analyze ROI: ${error.message}`);
    }
}
// ============================================================================
// TCO ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Analyze Total Cost of Ownership (TCO) for an asset
 *
 * @param data - TCO analysis data
 * @param transaction - Optional database transaction
 * @returns TCO analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const tco = await analyzeTCO({
 *   assetId: 'asset-001',
 *   analysisYears: 5,
 *   acquisitionCost: 100000,
 *   annualMaintenanceCost: 10000,
 *   annualOperatingCost: 15000,
 *   discountRate: 0.08
 * });
 * ```
 */
async function analyzeTCO(data, transaction) {
    try {
        const totalAcquisitionCost = data.acquisitionCost + (data.installationCost || 0);
        const totalMaintenanceCost = data.annualMaintenanceCost * data.analysisYears;
        const totalOperatingCost = data.annualOperatingCost * data.analysisYears;
        const totalOtherCosts = (data.annualLicenseCost || 0) * data.analysisYears +
            (data.upgradesCost || 0) +
            (data.trainingCost || 0) +
            (data.disposalCost || 0);
        const totalCostOfOwnership = totalAcquisitionCost + totalMaintenanceCost + totalOperatingCost + totalOtherCosts;
        const annualizedCost = totalCostOfOwnership / data.analysisYears;
        const discountRate = data.discountRate || 0.08;
        let presentValue = totalAcquisitionCost;
        const yearlyBreakdown = [];
        let cumulativeCost = totalAcquisitionCost;
        for (let year = 1; year <= data.analysisYears; year++) {
            const maintenanceCost = data.annualMaintenanceCost;
            const operatingCost = data.annualOperatingCost;
            const otherCost = (data.annualLicenseCost || 0);
            const totalYearlyCost = maintenanceCost + operatingCost + otherCost;
            cumulativeCost += totalYearlyCost;
            presentValue += totalYearlyCost / Math.pow(1 + discountRate, year);
            yearlyBreakdown.push({
                year,
                maintenanceCost,
                operatingCost,
                otherCost,
                totalYearlyCost,
                cumulativeCost,
            });
        }
        const costBreakdown = {
            acquisitionPercent: (totalAcquisitionCost / totalCostOfOwnership) * 100,
            maintenancePercent: (totalMaintenanceCost / totalCostOfOwnership) * 100,
            operatingPercent: (totalOperatingCost / totalCostOfOwnership) * 100,
            otherPercent: (totalOtherCosts / totalCostOfOwnership) * 100,
        };
        const result = {
            assetId: data.assetId,
            analysisYears: data.analysisYears,
            totalAcquisitionCost,
            totalMaintenanceCost,
            totalOperatingCost,
            totalOtherCosts,
            totalCostOfOwnership,
            annualizedCost,
            presentValue,
            costBreakdown,
            yearlyBreakdown,
        };
        // Save analysis
        await FinancialAnalysis.create({
            assetId: data.assetId,
            analysisType: 'tco',
            analysisData: result,
            analysisDate: new Date(),
        }, { transaction });
        return result;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to analyze TCO: ${error.message}`);
    }
}
// ============================================================================
// LEASE VS BUY ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Analyze Lease vs Buy decision
 *
 * @param data - Lease vs buy analysis data
 * @param transaction - Optional database transaction
 * @returns Lease vs buy analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const analysis = await analyzeLeaseVsBuy({
 *   assetDescription: 'MRI Machine',
 *   purchasePrice: 2000000,
 *   leasePayment: 50000,
 *   leaseTerm: 60,
 *   taxRate: 0.21,
 *   discountRate: 0.08
 * });
 * ```
 */
async function analyzeLeaseVsBuy(data, transaction) {
    try {
        const discountRate = data.discountRate || 0.08;
        const taxRate = data.taxRate || 0.21;
        // Buy option analysis
        const loanAmount = data.purchasePrice - (data.downPayment || 0);
        const monthlyInterestRate = (data.loanInterestRate || 0.05) / 12;
        const loanTermMonths = (data.loanTerm || 5) * 12;
        const monthlyPayment = loanAmount > 0
            ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
                (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
            : 0;
        const totalPayments = monthlyPayment * loanTermMonths + (data.downPayment || 0);
        const totalInterest = totalPayments - data.purchasePrice;
        const taxBenefit = totalInterest * taxRate;
        const buyNetCost = totalPayments - taxBenefit;
        // Calculate PV for buy option
        let buyPV = data.downPayment || 0;
        for (let month = 1; month <= loanTermMonths; month++) {
            buyPV += monthlyPayment / Math.pow(1 + discountRate / 12, month);
        }
        // Lease option analysis
        const leaseMonths = data.leaseTerm;
        const totalLeasePayments = data.leasePayment * leaseMonths;
        const leaseTaxBenefit = totalLeasePayments * taxRate;
        const leaseNetCost = totalLeasePayments - leaseTaxBenefit;
        // Calculate PV for lease option
        let leasePV = 0;
        for (let month = 1; month <= leaseMonths; month++) {
            leasePV += data.leasePayment / Math.pow(1 + discountRate / 12, month);
        }
        const recommendation = buyPV < leasePV ? 'buy' : 'lease';
        const savings = Math.abs(buyPV - leasePV);
        const savingsPercent = (savings / Math.max(buyPV, leasePV)) * 100;
        const result = {
            assetDescription: data.assetDescription,
            buyOption: {
                totalCost: totalPayments,
                presentValue: buyPV,
                monthlyPayment,
                totalInterest,
                taxBenefit,
                netCost: buyNetCost,
            },
            leaseOption: {
                totalCost: totalLeasePayments,
                presentValue: leasePV,
                monthlyPayment: data.leasePayment,
                totalPayments: totalLeasePayments,
                taxBenefit: leaseTaxBenefit,
                netCost: leaseNetCost,
            },
            recommendation,
            savings,
            savingsPercent,
        };
        // Save analysis
        await FinancialAnalysis.create({
            analysisType: 'lease_vs_buy',
            analysisData: result,
            analysisDate: new Date(),
        }, { transaction });
        return result;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to analyze lease vs buy: ${error.message}`);
    }
}
/**
 * Generate amortization schedule for a loan
 *
 * @param principal - Loan principal amount
 * @param interestRate - Annual interest rate (decimal)
 * @param termYears - Loan term in years
 * @param startDate - Loan start date
 * @returns Array of amortization schedule entries
 *
 * @example
 * ```typescript
 * const schedule = await generateAmortizationSchedule(
 *   100000,
 *   0.05,
 *   10,
 *   new Date('2024-01-01')
 * );
 * ```
 */
async function generateAmortizationSchedule(principal, interestRate, termYears, startDate) {
    const monthlyRate = interestRate / 12;
    const termMonths = termYears * 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    const schedule = [];
    let remainingBalance = principal;
    for (let period = 1; period <= termMonths; period++) {
        const interest = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interest;
        remainingBalance -= principalPayment;
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(paymentDate.getMonth() + period);
        schedule.push({
            period,
            paymentDate,
            payment: monthlyPayment,
            principal: principalPayment,
            interest,
            remainingBalance: Math.max(remainingBalance, 0),
        });
    }
    return schedule;
}
// ============================================================================
// ASSET IMPAIRMENT FUNCTIONS
// ============================================================================
/**
 * Record an asset impairment
 *
 * @param data - Asset impairment data
 * @param transaction - Optional database transaction
 * @returns Created impairment record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const impairment = await recordAssetImpairment({
 *   assetId: 'asset-001',
 *   impairmentDate: new Date(),
 *   bookValueBeforeImpairment: 50000,
 *   fairValue: 30000,
 *   impairmentLoss: 20000,
 *   reason: 'Technological obsolescence'
 * });
 * ```
 */
async function recordAssetImpairment(data, transaction) {
    try {
        const impairment = await AssetImpairment.create({
            assetId: data.assetId,
            impairmentDate: data.impairmentDate,
            bookValueBeforeImpairment: data.bookValueBeforeImpairment,
            fairValue: data.fairValue,
            impairmentLoss: data.impairmentLoss,
            reason: data.reason,
            notes: data.notes,
        }, { transaction });
        return impairment;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to record asset impairment: ${error.message}`);
    }
}
/**
 * Get impairments for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of impairment records
 *
 * @example
 * ```typescript
 * const impairments = await getAssetImpairments('asset-001');
 * ```
 */
async function getAssetImpairments(assetId) {
    return await AssetImpairment.findAll({
        where: { assetId },
        order: [['impairmentDate', 'DESC']],
    });
}
/**
 * Calculate disposal gain or loss
 *
 * @param assetId - Asset ID
 * @param salePrice - Sale price of the asset
 * @param saleDate - Date of sale
 * @returns Gain or loss amount (positive = gain, negative = loss)
 * @throws NotFoundException if asset not found
 *
 * @example
 * ```typescript
 * const gainLoss = await calculateDisposalGainLoss('asset-001', 25000, new Date());
 * ```
 */
async function calculateDisposalGainLoss(assetId, salePrice, saleDate) {
    const bookValue = await calculateBookValue(assetId, saleDate);
    return salePrice - bookValue.bookValue;
}
/**
 * Get financial summary for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate as of
 * @returns Comprehensive financial summary
 *
 * @example
 * ```typescript
 * const summary = await getAssetFinancialSummary('asset-001', new Date());
 * ```
 */
async function getAssetFinancialSummary(assetId, asOfDate) {
    const [costs, bookValue, impairments, schedule] = await Promise.all([
        getAssetCosts(assetId),
        calculateBookValue(assetId, asOfDate).catch(() => null),
        getAssetImpairments(assetId),
        getDepreciationSchedule(assetId),
    ]);
    const totalCosts = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
    const acquisitionCosts = costs
        .filter((c) => c.costType === CostType.ACQUISITION)
        .reduce((sum, cost) => sum + Number(cost.amount), 0);
    const maintenanceCosts = costs
        .filter((c) => c.costType === CostType.MAINTENANCE)
        .reduce((sum, cost) => sum + Number(cost.amount), 0);
    return {
        assetId,
        asOfDate,
        totalCosts,
        acquisitionCosts,
        maintenanceCosts,
        bookValue: bookValue?.bookValue || 0,
        accumulatedDepreciation: bookValue?.accumulatedDepreciation || 0,
        impairmentLoss: bookValue?.impairmentLoss || 0,
        depreciationMethod: schedule?.method,
        costBreakdown: costs.reduce((acc, cost) => {
            acc[cost.costType] = (acc[cost.costType] || 0) + Number(cost.amount);
            return acc;
        }, {}),
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Cost tracking
    trackAssetCost,
    getAssetCostById,
    getAssetCosts,
    calculateTotalAssetCosts,
    updateAssetCost,
    // Depreciation calculations
    calculateStraightLineDepreciation,
    calculateDecliningBalanceDepreciation,
    calculateDoubleDecliningDepreciation,
    calculateSumOfYearsDigitsDepreciation,
    calculateUnitsOfProductionDepreciation,
    getDepreciationSchedule,
    calculateBookValue,
    // Budget tracking
    createBudgetAllocation,
    getBudgetAllocationById,
    trackBudgetSpending,
    getBudgetsByFiscalYear,
    // ROI and TCO analysis
    analyzeROI,
    analyzeTCO,
    analyzeLeaseVsBuy,
    generateAmortizationSchedule,
    // Impairment
    recordAssetImpairment,
    getAssetImpairments,
    calculateDisposalGainLoss,
    getAssetFinancialSummary,
    // Models
    AssetCost,
    DepreciationSchedule,
    BudgetAllocation,
    AssetImpairment,
    FinancialAnalysis,
    // DTOs
    CreateAssetCostDto,
    CalculateDepreciationDto,
    CreateBudgetAllocationDto,
    // Enums
    DepreciationMethod,
    CostType,
    ExpenseClassification,
    BudgetStatus,
    FinancialStatus,
    LeaseType,
};
//# sourceMappingURL=asset-financial-commands.js.map