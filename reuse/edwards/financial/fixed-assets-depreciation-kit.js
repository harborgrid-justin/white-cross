"use strict";
/**
 * LOC: FIXASSET001
 * File: /reuse/edwards/financial/fixed-assets-depreciation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - date-fns (Date manipulation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Asset management services
 *   - Depreciation calculation services
 *   - Financial reporting modules
 *   - Tax reporting services
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
exports.exportAssetTaxData = exports.listAssetsForDisposal = exports.calculatePeriodDepreciationExpense = exports.generateAssetRegister = exports.generateDepreciationSchedule = exports.testAssetImpairment = exports.revalueFixedAsset = exports.bulkTransferAssets = exports.transferFixedAsset = exports.reverseAssetDisposal = exports.calculateDisposalGainLoss = exports.disposeFixedAsset = exports.batchCalculateDepreciation = exports.recordAssetDepreciation = exports.getMACRSRate = exports.calculateMACRSDepreciation = exports.calculateUnitsOfProductionDepreciation = exports.calculateSumOfYearsDigitsDepreciation = exports.calculateDoubleDecliningDepreciation = exports.calculateDecliningBalanceDepreciation = exports.calculateStraightLineDepreciation = exports.generateAssetNumber = exports.listFixedAssets = exports.getFixedAssetByNumber = exports.getFixedAssetById = exports.updateFixedAsset = exports.createFixedAsset = exports.createAssetDepreciationModel = exports.createFixedAssetModel = exports.RevalueAssetDto = exports.TransferAssetDto = exports.DisposeAssetDto = exports.CalculateDepreciationDto = exports.CreateAssetDto = void 0;
/**
 * File: /reuse/edwards/financial/fixed-assets-depreciation-kit.ts
 * Locator: WC-FIN-FIXASSET-001
 * Purpose: Comprehensive Fixed Assets and Depreciation Management - JD Edwards EnterpriseOne-level asset lifecycle, depreciation calculation, and compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, date-fns 3.x
 * Downstream: ../backend/financial/*, Asset Management Services, Depreciation Services, Tax Reporting, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, date-fns 3.x
 * Exports: 45 functions for asset acquisition, disposal, transfers, depreciation calculation (straight-line, declining balance, MACRS, sum-of-years-digits), asset revaluation, impairment, asset tracking, inventory management, tax compliance
 *
 * LLM Context: Enterprise-grade fixed assets and depreciation management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive asset lifecycle management from acquisition through disposal, automated depreciation calculations
 * using multiple methods (straight-line, declining balance, double-declining balance, MACRS, sum-of-years-digits, units-of-production),
 * asset transfers between locations/cost centers, revaluation and impairment testing, asset inventory reconciliation,
 * gain/loss calculations on disposal, tax basis tracking, compliance reporting, audit trails, and multi-book accounting.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const date_fns_1 = require("date-fns");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateAssetDto = (() => {
    var _a;
    let _assetNumber_decorators;
    let _assetNumber_initializers = [];
    let _assetNumber_extraInitializers = [];
    let _assetTag_decorators;
    let _assetTag_initializers = [];
    let _assetTag_extraInitializers = [];
    let _assetName_decorators;
    let _assetName_initializers = [];
    let _assetName_extraInitializers = [];
    let _assetDescription_decorators;
    let _assetDescription_initializers = [];
    let _assetDescription_extraInitializers = [];
    let _assetCategory_decorators;
    let _assetCategory_initializers = [];
    let _assetCategory_extraInitializers = [];
    let _assetType_decorators;
    let _assetType_initializers = [];
    let _assetType_extraInitializers = [];
    let _acquisitionDate_decorators;
    let _acquisitionDate_initializers = [];
    let _acquisitionDate_extraInitializers = [];
    let _acquisitionCost_decorators;
    let _acquisitionCost_initializers = [];
    let _acquisitionCost_extraInitializers = [];
    let _residualValue_decorators;
    let _residualValue_initializers = [];
    let _residualValue_extraInitializers = [];
    let _usefulLife_decorators;
    let _usefulLife_initializers = [];
    let _usefulLife_extraInitializers = [];
    let _usefulLifeUnit_decorators;
    let _usefulLifeUnit_initializers = [];
    let _usefulLifeUnit_extraInitializers = [];
    let _depreciationMethod_decorators;
    let _depreciationMethod_initializers = [];
    let _depreciationMethod_extraInitializers = [];
    let _locationCode_decorators;
    let _locationCode_initializers = [];
    let _locationCode_extraInitializers = [];
    let _departmentCode_decorators;
    let _departmentCode_initializers = [];
    let _departmentCode_extraInitializers = [];
    let _costCenterCode_decorators;
    let _costCenterCode_initializers = [];
    let _costCenterCode_extraInitializers = [];
    return _a = class CreateAssetDto {
            constructor() {
                this.assetNumber = __runInitializers(this, _assetNumber_initializers, void 0);
                this.assetTag = (__runInitializers(this, _assetNumber_extraInitializers), __runInitializers(this, _assetTag_initializers, void 0));
                this.assetName = (__runInitializers(this, _assetTag_extraInitializers), __runInitializers(this, _assetName_initializers, void 0));
                this.assetDescription = (__runInitializers(this, _assetName_extraInitializers), __runInitializers(this, _assetDescription_initializers, void 0));
                this.assetCategory = (__runInitializers(this, _assetDescription_extraInitializers), __runInitializers(this, _assetCategory_initializers, void 0));
                this.assetType = (__runInitializers(this, _assetCategory_extraInitializers), __runInitializers(this, _assetType_initializers, void 0));
                this.acquisitionDate = (__runInitializers(this, _assetType_extraInitializers), __runInitializers(this, _acquisitionDate_initializers, void 0));
                this.acquisitionCost = (__runInitializers(this, _acquisitionDate_extraInitializers), __runInitializers(this, _acquisitionCost_initializers, void 0));
                this.residualValue = (__runInitializers(this, _acquisitionCost_extraInitializers), __runInitializers(this, _residualValue_initializers, void 0));
                this.usefulLife = (__runInitializers(this, _residualValue_extraInitializers), __runInitializers(this, _usefulLife_initializers, void 0));
                this.usefulLifeUnit = (__runInitializers(this, _usefulLife_extraInitializers), __runInitializers(this, _usefulLifeUnit_initializers, void 0));
                this.depreciationMethod = (__runInitializers(this, _usefulLifeUnit_extraInitializers), __runInitializers(this, _depreciationMethod_initializers, void 0));
                this.locationCode = (__runInitializers(this, _depreciationMethod_extraInitializers), __runInitializers(this, _locationCode_initializers, void 0));
                this.departmentCode = (__runInitializers(this, _locationCode_extraInitializers), __runInitializers(this, _departmentCode_initializers, void 0));
                this.costCenterCode = (__runInitializers(this, _departmentCode_extraInitializers), __runInitializers(this, _costCenterCode_initializers, void 0));
                __runInitializers(this, _costCenterCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset number', example: 'FA-2024-001' })];
            _assetTag_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset tag/barcode', example: 'TAG-12345' })];
            _assetName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset name', example: 'Dell Latitude Laptop' })];
            _assetDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset description' })];
            _assetCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset category', example: 'Computer Equipment' })];
            _assetType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset type', enum: ['tangible', 'intangible', 'equipment', 'vehicle'] })];
            _acquisitionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition date', example: '2024-01-15' })];
            _acquisitionCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquisition cost', example: 1500.00 })];
            _residualValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Residual/salvage value', example: 100.00 })];
            _usefulLife_decorators = [(0, swagger_1.ApiProperty)({ description: 'Useful life', example: 5 })];
            _usefulLifeUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Useful life unit', enum: ['years', 'months', 'units'], default: 'years' })];
            _depreciationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Depreciation method', enum: ['straight-line', 'declining-balance', 'MACRS'] })];
            _locationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location code', example: 'LOC-001' })];
            _departmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code', example: 'DEPT-IT' })];
            _costCenterCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center code', example: 'CC-100' })];
            __esDecorate(null, null, _assetNumber_decorators, { kind: "field", name: "assetNumber", static: false, private: false, access: { has: obj => "assetNumber" in obj, get: obj => obj.assetNumber, set: (obj, value) => { obj.assetNumber = value; } }, metadata: _metadata }, _assetNumber_initializers, _assetNumber_extraInitializers);
            __esDecorate(null, null, _assetTag_decorators, { kind: "field", name: "assetTag", static: false, private: false, access: { has: obj => "assetTag" in obj, get: obj => obj.assetTag, set: (obj, value) => { obj.assetTag = value; } }, metadata: _metadata }, _assetTag_initializers, _assetTag_extraInitializers);
            __esDecorate(null, null, _assetName_decorators, { kind: "field", name: "assetName", static: false, private: false, access: { has: obj => "assetName" in obj, get: obj => obj.assetName, set: (obj, value) => { obj.assetName = value; } }, metadata: _metadata }, _assetName_initializers, _assetName_extraInitializers);
            __esDecorate(null, null, _assetDescription_decorators, { kind: "field", name: "assetDescription", static: false, private: false, access: { has: obj => "assetDescription" in obj, get: obj => obj.assetDescription, set: (obj, value) => { obj.assetDescription = value; } }, metadata: _metadata }, _assetDescription_initializers, _assetDescription_extraInitializers);
            __esDecorate(null, null, _assetCategory_decorators, { kind: "field", name: "assetCategory", static: false, private: false, access: { has: obj => "assetCategory" in obj, get: obj => obj.assetCategory, set: (obj, value) => { obj.assetCategory = value; } }, metadata: _metadata }, _assetCategory_initializers, _assetCategory_extraInitializers);
            __esDecorate(null, null, _assetType_decorators, { kind: "field", name: "assetType", static: false, private: false, access: { has: obj => "assetType" in obj, get: obj => obj.assetType, set: (obj, value) => { obj.assetType = value; } }, metadata: _metadata }, _assetType_initializers, _assetType_extraInitializers);
            __esDecorate(null, null, _acquisitionDate_decorators, { kind: "field", name: "acquisitionDate", static: false, private: false, access: { has: obj => "acquisitionDate" in obj, get: obj => obj.acquisitionDate, set: (obj, value) => { obj.acquisitionDate = value; } }, metadata: _metadata }, _acquisitionDate_initializers, _acquisitionDate_extraInitializers);
            __esDecorate(null, null, _acquisitionCost_decorators, { kind: "field", name: "acquisitionCost", static: false, private: false, access: { has: obj => "acquisitionCost" in obj, get: obj => obj.acquisitionCost, set: (obj, value) => { obj.acquisitionCost = value; } }, metadata: _metadata }, _acquisitionCost_initializers, _acquisitionCost_extraInitializers);
            __esDecorate(null, null, _residualValue_decorators, { kind: "field", name: "residualValue", static: false, private: false, access: { has: obj => "residualValue" in obj, get: obj => obj.residualValue, set: (obj, value) => { obj.residualValue = value; } }, metadata: _metadata }, _residualValue_initializers, _residualValue_extraInitializers);
            __esDecorate(null, null, _usefulLife_decorators, { kind: "field", name: "usefulLife", static: false, private: false, access: { has: obj => "usefulLife" in obj, get: obj => obj.usefulLife, set: (obj, value) => { obj.usefulLife = value; } }, metadata: _metadata }, _usefulLife_initializers, _usefulLife_extraInitializers);
            __esDecorate(null, null, _usefulLifeUnit_decorators, { kind: "field", name: "usefulLifeUnit", static: false, private: false, access: { has: obj => "usefulLifeUnit" in obj, get: obj => obj.usefulLifeUnit, set: (obj, value) => { obj.usefulLifeUnit = value; } }, metadata: _metadata }, _usefulLifeUnit_initializers, _usefulLifeUnit_extraInitializers);
            __esDecorate(null, null, _depreciationMethod_decorators, { kind: "field", name: "depreciationMethod", static: false, private: false, access: { has: obj => "depreciationMethod" in obj, get: obj => obj.depreciationMethod, set: (obj, value) => { obj.depreciationMethod = value; } }, metadata: _metadata }, _depreciationMethod_initializers, _depreciationMethod_extraInitializers);
            __esDecorate(null, null, _locationCode_decorators, { kind: "field", name: "locationCode", static: false, private: false, access: { has: obj => "locationCode" in obj, get: obj => obj.locationCode, set: (obj, value) => { obj.locationCode = value; } }, metadata: _metadata }, _locationCode_initializers, _locationCode_extraInitializers);
            __esDecorate(null, null, _departmentCode_decorators, { kind: "field", name: "departmentCode", static: false, private: false, access: { has: obj => "departmentCode" in obj, get: obj => obj.departmentCode, set: (obj, value) => { obj.departmentCode = value; } }, metadata: _metadata }, _departmentCode_initializers, _departmentCode_extraInitializers);
            __esDecorate(null, null, _costCenterCode_decorators, { kind: "field", name: "costCenterCode", static: false, private: false, access: { has: obj => "costCenterCode" in obj, get: obj => obj.costCenterCode, set: (obj, value) => { obj.costCenterCode = value; } }, metadata: _metadata }, _costCenterCode_initializers, _costCenterCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAssetDto = CreateAssetDto;
let CalculateDepreciationDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _depreciationDate_decorators;
    let _depreciationDate_initializers = [];
    let _depreciationDate_extraInitializers = [];
    let _depreciationType_decorators;
    let _depreciationType_initializers = [];
    let _depreciationType_extraInitializers = [];
    return _a = class CalculateDepreciationDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.depreciationDate = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _depreciationDate_initializers, void 0));
                this.depreciationType = (__runInitializers(this, _depreciationDate_extraInitializers), __runInitializers(this, _depreciationType_initializers, void 0));
                __runInitializers(this, _depreciationType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _depreciationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Depreciation date' })];
            _depreciationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Depreciation type', enum: ['book', 'tax'], default: 'book' })];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _depreciationDate_decorators, { kind: "field", name: "depreciationDate", static: false, private: false, access: { has: obj => "depreciationDate" in obj, get: obj => obj.depreciationDate, set: (obj, value) => { obj.depreciationDate = value; } }, metadata: _metadata }, _depreciationDate_initializers, _depreciationDate_extraInitializers);
            __esDecorate(null, null, _depreciationType_decorators, { kind: "field", name: "depreciationType", static: false, private: false, access: { has: obj => "depreciationType" in obj, get: obj => obj.depreciationType, set: (obj, value) => { obj.depreciationType = value; } }, metadata: _metadata }, _depreciationType_initializers, _depreciationType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateDepreciationDto = CalculateDepreciationDto;
let DisposeAssetDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _disposalDate_decorators;
    let _disposalDate_initializers = [];
    let _disposalDate_extraInitializers = [];
    let _disposalType_decorators;
    let _disposalType_initializers = [];
    let _disposalType_extraInitializers = [];
    let _disposalAmount_decorators;
    let _disposalAmount_initializers = [];
    let _disposalAmount_extraInitializers = [];
    let _disposalReason_decorators;
    let _disposalReason_initializers = [];
    let _disposalReason_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    return _a = class DisposeAssetDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.disposalDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _disposalDate_initializers, void 0));
                this.disposalType = (__runInitializers(this, _disposalDate_extraInitializers), __runInitializers(this, _disposalType_initializers, void 0));
                this.disposalAmount = (__runInitializers(this, _disposalType_extraInitializers), __runInitializers(this, _disposalAmount_initializers, void 0));
                this.disposalReason = (__runInitializers(this, _disposalAmount_extraInitializers), __runInitializers(this, _disposalReason_initializers, void 0));
                this.approvedBy = (__runInitializers(this, _disposalReason_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                __runInitializers(this, _approvedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' })];
            _disposalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal date' })];
            _disposalType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal type', enum: ['sale', 'scrap', 'trade-in', 'donation'] })];
            _disposalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal amount', example: 500.00 })];
            _disposalReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal reason' })];
            _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' })];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _disposalDate_decorators, { kind: "field", name: "disposalDate", static: false, private: false, access: { has: obj => "disposalDate" in obj, get: obj => obj.disposalDate, set: (obj, value) => { obj.disposalDate = value; } }, metadata: _metadata }, _disposalDate_initializers, _disposalDate_extraInitializers);
            __esDecorate(null, null, _disposalType_decorators, { kind: "field", name: "disposalType", static: false, private: false, access: { has: obj => "disposalType" in obj, get: obj => obj.disposalType, set: (obj, value) => { obj.disposalType = value; } }, metadata: _metadata }, _disposalType_initializers, _disposalType_extraInitializers);
            __esDecorate(null, null, _disposalAmount_decorators, { kind: "field", name: "disposalAmount", static: false, private: false, access: { has: obj => "disposalAmount" in obj, get: obj => obj.disposalAmount, set: (obj, value) => { obj.disposalAmount = value; } }, metadata: _metadata }, _disposalAmount_initializers, _disposalAmount_extraInitializers);
            __esDecorate(null, null, _disposalReason_decorators, { kind: "field", name: "disposalReason", static: false, private: false, access: { has: obj => "disposalReason" in obj, get: obj => obj.disposalReason, set: (obj, value) => { obj.disposalReason = value; } }, metadata: _metadata }, _disposalReason_initializers, _disposalReason_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DisposeAssetDto = DisposeAssetDto;
let TransferAssetDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _transferDate_decorators;
    let _transferDate_initializers = [];
    let _transferDate_extraInitializers = [];
    let _toLocationCode_decorators;
    let _toLocationCode_initializers = [];
    let _toLocationCode_extraInitializers = [];
    let _toDepartmentCode_decorators;
    let _toDepartmentCode_initializers = [];
    let _toDepartmentCode_extraInitializers = [];
    let _toCostCenter_decorators;
    let _toCostCenter_initializers = [];
    let _toCostCenter_extraInitializers = [];
    let _transferReason_decorators;
    let _transferReason_initializers = [];
    let _transferReason_extraInitializers = [];
    let _transferredBy_decorators;
    let _transferredBy_initializers = [];
    let _transferredBy_extraInitializers = [];
    return _a = class TransferAssetDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.transferDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _transferDate_initializers, void 0));
                this.toLocationCode = (__runInitializers(this, _transferDate_extraInitializers), __runInitializers(this, _toLocationCode_initializers, void 0));
                this.toDepartmentCode = (__runInitializers(this, _toLocationCode_extraInitializers), __runInitializers(this, _toDepartmentCode_initializers, void 0));
                this.toCostCenter = (__runInitializers(this, _toDepartmentCode_extraInitializers), __runInitializers(this, _toCostCenter_initializers, void 0));
                this.transferReason = (__runInitializers(this, _toCostCenter_extraInitializers), __runInitializers(this, _transferReason_initializers, void 0));
                this.transferredBy = (__runInitializers(this, _transferReason_extraInitializers), __runInitializers(this, _transferredBy_initializers, void 0));
                __runInitializers(this, _transferredBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' })];
            _transferDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer date' })];
            _toLocationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'To location code' })];
            _toDepartmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'To department code' })];
            _toCostCenter_decorators = [(0, swagger_1.ApiProperty)({ description: 'To cost center' })];
            _transferReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer reason' })];
            _transferredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transferred by user ID' })];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _transferDate_decorators, { kind: "field", name: "transferDate", static: false, private: false, access: { has: obj => "transferDate" in obj, get: obj => obj.transferDate, set: (obj, value) => { obj.transferDate = value; } }, metadata: _metadata }, _transferDate_initializers, _transferDate_extraInitializers);
            __esDecorate(null, null, _toLocationCode_decorators, { kind: "field", name: "toLocationCode", static: false, private: false, access: { has: obj => "toLocationCode" in obj, get: obj => obj.toLocationCode, set: (obj, value) => { obj.toLocationCode = value; } }, metadata: _metadata }, _toLocationCode_initializers, _toLocationCode_extraInitializers);
            __esDecorate(null, null, _toDepartmentCode_decorators, { kind: "field", name: "toDepartmentCode", static: false, private: false, access: { has: obj => "toDepartmentCode" in obj, get: obj => obj.toDepartmentCode, set: (obj, value) => { obj.toDepartmentCode = value; } }, metadata: _metadata }, _toDepartmentCode_initializers, _toDepartmentCode_extraInitializers);
            __esDecorate(null, null, _toCostCenter_decorators, { kind: "field", name: "toCostCenter", static: false, private: false, access: { has: obj => "toCostCenter" in obj, get: obj => obj.toCostCenter, set: (obj, value) => { obj.toCostCenter = value; } }, metadata: _metadata }, _toCostCenter_initializers, _toCostCenter_extraInitializers);
            __esDecorate(null, null, _transferReason_decorators, { kind: "field", name: "transferReason", static: false, private: false, access: { has: obj => "transferReason" in obj, get: obj => obj.transferReason, set: (obj, value) => { obj.transferReason = value; } }, metadata: _metadata }, _transferReason_initializers, _transferReason_extraInitializers);
            __esDecorate(null, null, _transferredBy_decorators, { kind: "field", name: "transferredBy", static: false, private: false, access: { has: obj => "transferredBy" in obj, get: obj => obj.transferredBy, set: (obj, value) => { obj.transferredBy = value; } }, metadata: _metadata }, _transferredBy_initializers, _transferredBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TransferAssetDto = TransferAssetDto;
let RevalueAssetDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _revaluationDate_decorators;
    let _revaluationDate_initializers = [];
    let _revaluationDate_extraInitializers = [];
    let _revaluedAmount_decorators;
    let _revaluedAmount_initializers = [];
    let _revaluedAmount_extraInitializers = [];
    let _revaluationReason_decorators;
    let _revaluationReason_initializers = [];
    let _revaluationReason_extraInitializers = [];
    let _accountingStandard_decorators;
    let _accountingStandard_initializers = [];
    let _accountingStandard_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    return _a = class RevalueAssetDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.revaluationDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _revaluationDate_initializers, void 0));
                this.revaluedAmount = (__runInitializers(this, _revaluationDate_extraInitializers), __runInitializers(this, _revaluedAmount_initializers, void 0));
                this.revaluationReason = (__runInitializers(this, _revaluedAmount_extraInitializers), __runInitializers(this, _revaluationReason_initializers, void 0));
                this.accountingStandard = (__runInitializers(this, _revaluationReason_extraInitializers), __runInitializers(this, _accountingStandard_initializers, void 0));
                this.approvedBy = (__runInitializers(this, _accountingStandard_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                __runInitializers(this, _approvedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' })];
            _revaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revaluation date' })];
            _revaluedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revalued amount' })];
            _revaluationReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revaluation reason' })];
            _accountingStandard_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accounting standard', enum: ['GAAP', 'IFRS', 'TAX'] })];
            _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' })];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _revaluationDate_decorators, { kind: "field", name: "revaluationDate", static: false, private: false, access: { has: obj => "revaluationDate" in obj, get: obj => obj.revaluationDate, set: (obj, value) => { obj.revaluationDate = value; } }, metadata: _metadata }, _revaluationDate_initializers, _revaluationDate_extraInitializers);
            __esDecorate(null, null, _revaluedAmount_decorators, { kind: "field", name: "revaluedAmount", static: false, private: false, access: { has: obj => "revaluedAmount" in obj, get: obj => obj.revaluedAmount, set: (obj, value) => { obj.revaluedAmount = value; } }, metadata: _metadata }, _revaluedAmount_initializers, _revaluedAmount_extraInitializers);
            __esDecorate(null, null, _revaluationReason_decorators, { kind: "field", name: "revaluationReason", static: false, private: false, access: { has: obj => "revaluationReason" in obj, get: obj => obj.revaluationReason, set: (obj, value) => { obj.revaluationReason = value; } }, metadata: _metadata }, _revaluationReason_initializers, _revaluationReason_extraInitializers);
            __esDecorate(null, null, _accountingStandard_decorators, { kind: "field", name: "accountingStandard", static: false, private: false, access: { has: obj => "accountingStandard" in obj, get: obj => obj.accountingStandard, set: (obj, value) => { obj.accountingStandard = value; } }, metadata: _metadata }, _accountingStandard_initializers, _accountingStandard_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RevalueAssetDto = RevalueAssetDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Fixed Assets with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FixedAsset model
 *
 * @example
 * ```typescript
 * const FixedAsset = createFixedAssetModel(sequelize);
 * const asset = await FixedAsset.create({
 *   assetNumber: 'FA-2024-001',
 *   assetName: 'Server Equipment',
 *   acquisitionCost: 50000,
 *   usefulLife: 5,
 *   depreciationMethod: 'straight-line'
 * });
 * ```
 */
const createFixedAssetModel = (sequelize) => {
    class FixedAsset extends sequelize_1.Model {
    }
    FixedAsset.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique asset number',
        },
        assetTag: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Physical asset tag/barcode',
        },
        assetName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Asset name',
        },
        assetDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed asset description',
        },
        assetCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Asset category',
        },
        assetClass: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Asset classification code',
        },
        assetType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Asset type',
            validate: {
                isIn: [['tangible', 'intangible', 'land', 'building', 'equipment', 'vehicle', 'furniture', 'software']],
            },
        },
        serialNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Serial number',
        },
        manufacturer: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Manufacturer name',
        },
        model: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Model number',
        },
        acquisitionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of acquisition',
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total acquisition cost',
            validate: {
                min: 0,
            },
        },
        residualValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Residual/salvage value',
            validate: {
                min: 0,
            },
        },
        usefulLife: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Useful life',
            validate: {
                min: 0,
            },
        },
        usefulLifeUnit: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'years',
            comment: 'Useful life unit',
            validate: {
                isIn: [['years', 'months', 'units', 'hours']],
            },
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Depreciation calculation method',
            validate: {
                isIn: [['straight-line', 'declining-balance', 'double-declining', 'sum-of-years', 'units-of-production', 'MACRS']],
            },
        },
        depreciationRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: true,
            comment: 'Depreciation rate (for declining balance)',
            validate: {
                min: 0,
                max: 1,
            },
        },
        macrsClass: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'MACRS asset class',
            validate: {
                isIn: [['3-year', '5-year', '7-year', '10-year', '15-year', '20-year', '27.5-year', '39-year', null]],
            },
        },
        status: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Asset status',
            validate: {
                isIn: [['active', 'disposed', 'fully-depreciated', 'impaired', 'under-construction', 'retired']],
            },
        },
        locationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Current location ID',
        },
        locationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Current location code',
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Current department ID',
        },
        departmentCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Current department code',
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Cost center code',
        },
        responsiblePerson: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Person responsible for asset',
        },
        currentBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Current net book value',
            validate: {
                min: 0,
            },
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accumulated depreciation',
            validate: {
                min: 0,
            },
        },
        taxBasis: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Tax basis (cost for tax purposes)',
            validate: {
                min: 0,
            },
        },
        taxDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accumulated tax depreciation',
            validate: {
                min: 0,
            },
        },
        disposalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date of disposal',
        },
        disposalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Disposal proceeds',
        },
        disposalGainLoss: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Gain or loss on disposal',
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
            comment: 'User who created the asset record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the asset record',
        },
    }, {
        sequelize,
        tableName: 'fixed_assets',
        timestamps: true,
        indexes: [
            { fields: ['assetNumber'], unique: true },
            { fields: ['assetTag'], unique: true },
            { fields: ['assetCategory'] },
            { fields: ['assetType'] },
            { fields: ['status'] },
            { fields: ['locationCode'] },
            { fields: ['departmentCode'] },
            { fields: ['costCenterCode'] },
            { fields: ['acquisitionDate'] },
            { fields: ['disposalDate'] },
        ],
        hooks: {
            beforeCreate: (asset) => {
                if (!asset.createdBy) {
                    throw new Error('createdBy is required');
                }
                asset.updatedBy = asset.createdBy;
                asset.currentBookValue = Number(asset.acquisitionCost || 0);
                asset.taxBasis = Number(asset.acquisitionCost || 0);
            },
            beforeUpdate: (asset) => {
                if (!asset.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
    });
    return FixedAsset;
};
exports.createFixedAssetModel = createFixedAssetModel;
/**
 * Sequelize model for Asset Depreciation records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetDepreciation model
 *
 * @example
 * ```typescript
 * const AssetDepreciation = createAssetDepreciationModel(sequelize);
 * const depreciation = await AssetDepreciation.create({
 *   assetId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   depreciationAmount: 833.33,
 *   depreciationType: 'book'
 * });
 * ```
 */
const createAssetDepreciationModel = (sequelize) => {
    class AssetDepreciation extends sequelize_1.Model {
    }
    AssetDepreciation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to fixed asset',
            references: {
                model: 'fixed_assets',
                key: 'id',
            },
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
            comment: 'Fiscal period (1-12)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        depreciationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Depreciation calculation date',
        },
        depreciationType: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Type of depreciation',
            validate: {
                isIn: [['book', 'tax', 'gaap', 'ifrs']],
            },
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Depreciation method used',
        },
        depreciationAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Depreciation expense for period',
            validate: {
                min: 0,
            },
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total accumulated depreciation',
            validate: {
                min: 0,
            },
        },
        netBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net book value after depreciation',
            validate: {
                min: 0,
            },
        },
        taxDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Tax depreciation for period',
        },
        taxAccumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Total accumulated tax depreciation',
        },
        taxNetBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Tax net book value',
        },
        calculationBasis: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Calculation methodology details',
        },
        isAdjustment: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is this an adjustment entry',
        },
        adjustmentReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for adjustment',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Related journal entry',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'calculated',
            comment: 'Depreciation status',
            validate: {
                isIn: [['calculated', 'posted', 'reversed']],
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
    }, {
        sequelize,
        tableName: 'asset_depreciation',
        timestamps: true,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['depreciationDate'] },
            { fields: ['depreciationType'] },
            { fields: ['status'] },
            { fields: ['assetId', 'fiscalYear', 'fiscalPeriod', 'depreciationType'], unique: true },
        ],
    });
    return AssetDepreciation;
};
exports.createAssetDepreciationModel = createAssetDepreciationModel;
// ============================================================================
// CORE ASSET MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new fixed asset record with full acquisition details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAssetDto} assetData - Asset creation data
 * @param {string} userId - User creating the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created asset record
 *
 * @example
 * ```typescript
 * const asset = await createFixedAsset(sequelize, {
 *   assetNumber: 'FA-2024-001',
 *   assetName: 'Dell Server',
 *   acquisitionCost: 15000,
 *   usefulLife: 5,
 *   depreciationMethod: 'straight-line'
 * }, 'user123');
 * ```
 */
const createFixedAsset = async (sequelize, assetData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    // Generate asset number if not provided
    const assetNumber = assetData.assetNumber || await (0, exports.generateAssetNumber)(sequelize, assetData.assetType);
    // Validate acquisition cost > residual value
    if (assetData.acquisitionCost <= assetData.residualValue) {
        throw new Error('Acquisition cost must be greater than residual value');
    }
    const asset = await FixedAsset.create({
        assetNumber,
        assetTag: assetData.assetTag,
        assetName: assetData.assetName,
        assetDescription: assetData.assetDescription,
        assetCategory: assetData.assetCategory,
        assetClass: assetData.assetCategory,
        assetType: assetData.assetType,
        acquisitionDate: assetData.acquisitionDate,
        acquisitionCost: assetData.acquisitionCost,
        residualValue: assetData.residualValue,
        usefulLife: assetData.usefulLife,
        usefulLifeUnit: assetData.usefulLifeUnit,
        depreciationMethod: assetData.depreciationMethod,
        status: 'active',
        locationCode: assetData.locationCode,
        departmentCode: assetData.departmentCode,
        costCenterCode: assetData.costCenterCode,
        currentBookValue: assetData.acquisitionCost,
        accumulatedDepreciation: 0,
        taxBasis: assetData.acquisitionCost,
        taxDepreciation: 0,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return asset;
};
exports.createFixedAsset = createFixedAsset;
/**
 * Updates an existing fixed asset record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Partial<CreateAssetDto>} updateData - Update data
 * @param {string} userId - User updating the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * const updated = await updateFixedAsset(sequelize, 1, {
 *   locationCode: 'LOC-002',
 *   responsiblePerson: 'John Doe'
 * }, 'user123');
 * ```
 */
const updateFixedAsset = async (sequelize, assetId, updateData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await FixedAsset.findByPk(assetId, { transaction });
    if (!asset) {
        throw new Error('Asset not found');
    }
    if (asset.status === 'disposed') {
        throw new Error('Cannot update disposed asset');
    }
    await asset.update({ ...updateData, updatedBy: userId }, { transaction });
    return asset;
};
exports.updateFixedAsset = updateFixedAsset;
/**
 * Retrieves a fixed asset by ID with full details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset record
 *
 * @example
 * ```typescript
 * const asset = await getFixedAssetById(sequelize, 1);
 * ```
 */
const getFixedAssetById = async (sequelize, assetId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await FixedAsset.findByPk(assetId, { transaction });
    if (!asset) {
        throw new Error('Asset not found');
    }
    return asset;
};
exports.getFixedAssetById = getFixedAssetById;
/**
 * Retrieves a fixed asset by asset number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assetNumber - Asset number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset record
 *
 * @example
 * ```typescript
 * const asset = await getFixedAssetByNumber(sequelize, 'FA-2024-001');
 * ```
 */
const getFixedAssetByNumber = async (sequelize, assetNumber, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await FixedAsset.findOne({
        where: { assetNumber },
        transaction,
    });
    if (!asset) {
        throw new Error('Asset not found');
    }
    return asset;
};
exports.getFixedAssetByNumber = getFixedAssetByNumber;
/**
 * Lists fixed assets with filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter criteria
 * @param {number} [limit=100] - Maximum results
 * @param {number} [offset=0] - Results offset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of assets
 *
 * @example
 * ```typescript
 * const assets = await listFixedAssets(sequelize, {
 *   assetType: 'equipment',
 *   status: 'active',
 *   locationCode: 'LOC-001'
 * }, 50, 0);
 * ```
 */
const listFixedAssets = async (sequelize, filters = {}, limit = 100, offset = 0, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const where = {};
    if (filters.assetType)
        where.assetType = filters.assetType;
    if (filters.assetCategory)
        where.assetCategory = filters.assetCategory;
    if (filters.status)
        where.status = filters.status;
    if (filters.locationCode)
        where.locationCode = filters.locationCode;
    if (filters.departmentCode)
        where.departmentCode = filters.departmentCode;
    if (filters.costCenterCode)
        where.costCenterCode = filters.costCenterCode;
    const assets = await FixedAsset.findAll({
        where,
        limit,
        offset,
        order: [['assetNumber', 'ASC']],
        transaction,
    });
    return assets;
};
exports.listFixedAssets = listFixedAssets;
/**
 * Generates a unique asset number based on type and sequence.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assetType - Asset type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated asset number
 *
 * @example
 * ```typescript
 * const assetNumber = await generateAssetNumber(sequelize, 'equipment');
 * // Returns: 'EQ-2024-00001'
 * ```
 */
const generateAssetNumber = async (sequelize, assetType, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const year = new Date().getFullYear();
    const prefix = assetType.substring(0, 2).toUpperCase();
    const lastAsset = await FixedAsset.findOne({
        where: {
            assetNumber: {
                [sequelize_1.Op.like]: `${prefix}-${year}-%`,
            },
        },
        order: [['assetNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastAsset) {
        const lastNumber = lastAsset.assetNumber.split('-')[2];
        sequence = parseInt(lastNumber, 10) + 1;
    }
    return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};
exports.generateAssetNumber = generateAssetNumber;
// ============================================================================
// DEPRECIATION CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculates straight-line depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateStraightLineDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31')
 * );
 * // For $10,000 asset with 5-year life: returns 166.67 (monthly)
 * ```
 */
const calculateStraightLineDepreciation = async (sequelize, assetId, depreciationDate, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.residualValue);
    let monthlyDepreciation = 0;
    if (asset.usefulLifeUnit === 'years') {
        const totalMonths = Number(asset.usefulLife) * 12;
        monthlyDepreciation = depreciableAmount / totalMonths;
    }
    else if (asset.usefulLifeUnit === 'months') {
        monthlyDepreciation = depreciableAmount / Number(asset.usefulLife);
    }
    // Check if asset is fully depreciated
    if (Number(asset.accumulatedDepreciation) >= depreciableAmount) {
        return 0;
    }
    // Ensure we don't over-depreciate
    const remainingDepreciation = depreciableAmount - Number(asset.accumulatedDepreciation);
    return Math.min(monthlyDepreciation, remainingDepreciation);
};
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
/**
 * Calculates declining balance depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {number} [rate] - Depreciation rate (if not using asset's default)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDecliningBalanceDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31'),
 *   0.20 // 20% declining balance
 * );
 * ```
 */
const calculateDecliningBalanceDepreciation = async (sequelize, assetId, depreciationDate, rate, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const depreciationRate = rate || Number(asset.depreciationRate) || (1 / Number(asset.usefulLife));
    const monthlyRate = depreciationRate / 12;
    const currentBookValue = Number(asset.currentBookValue);
    const residualValue = Number(asset.residualValue);
    // Can't depreciate below residual value
    if (currentBookValue <= residualValue) {
        return 0;
    }
    const depreciation = currentBookValue * monthlyRate;
    // Ensure we don't depreciate below residual value
    const maxDepreciation = currentBookValue - residualValue;
    return Math.min(depreciation, maxDepreciation);
};
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
/**
 * Calculates double-declining balance depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDoubleDecliningDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31')
 * );
 * ```
 */
const calculateDoubleDecliningDepreciation = async (sequelize, assetId, depreciationDate, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const straightLineRate = 1 / Number(asset.usefulLife);
    const doubleDecliningRate = straightLineRate * 2;
    return (0, exports.calculateDecliningBalanceDepreciation)(sequelize, assetId, depreciationDate, doubleDecliningRate, transaction);
};
exports.calculateDoubleDecliningDepreciation = calculateDoubleDecliningDepreciation;
/**
 * Calculates sum-of-years-digits depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateSumOfYearsDigitsDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-06-30')
 * );
 * ```
 */
const calculateSumOfYearsDigitsDepreciation = async (sequelize, assetId, depreciationDate, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.residualValue);
    const usefulLifeYears = asset.usefulLifeUnit === 'years'
        ? Number(asset.usefulLife)
        : Number(asset.usefulLife) / 12;
    // Calculate months since acquisition
    const monthsSinceAcquisition = (0, date_fns_1.differenceInMonths)(depreciationDate, new Date(asset.acquisitionDate));
    const currentYear = Math.floor(monthsSinceAcquisition / 12) + 1;
    if (currentYear > usefulLifeYears) {
        return 0; // Fully depreciated
    }
    // Sum of years digits formula
    const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
    const remainingLife = usefulLifeYears - currentYear + 1;
    const yearlyDepreciation = (remainingLife / sumOfYears) * depreciableAmount;
    const monthlyDepreciation = yearlyDepreciation / 12;
    // Check against accumulated depreciation
    const remainingDepreciation = depreciableAmount - Number(asset.accumulatedDepreciation);
    return Math.min(monthlyDepreciation, remainingDepreciation);
};
exports.calculateSumOfYearsDigitsDepreciation = calculateSumOfYearsDigitsDepreciation;
/**
 * Calculates units-of-production depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} unitsProduced - Units produced in period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateUnitsOfProductionDepreciation(
 *   sequelize,
 *   1,
 *   1000 // units produced this period
 * );
 * ```
 */
const calculateUnitsOfProductionDepreciation = async (sequelize, assetId, unitsProduced, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    if (asset.usefulLifeUnit !== 'units') {
        throw new Error('Asset must have useful life in units for units-of-production method');
    }
    const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.residualValue);
    const totalUnits = Number(asset.usefulLife);
    const perUnitDepreciation = depreciableAmount / totalUnits;
    const depreciation = unitsProduced * perUnitDepreciation;
    // Ensure we don't over-depreciate
    const remainingDepreciation = depreciableAmount - Number(asset.accumulatedDepreciation);
    return Math.min(depreciation, remainingDepreciation);
};
exports.calculateUnitsOfProductionDepreciation = calculateUnitsOfProductionDepreciation;
/**
 * Calculates MACRS depreciation for an asset (US tax purposes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Annual MACRS depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateMACRSDepreciation(
 *   sequelize,
 *   1,
 *   2024
 * );
 * ```
 */
const calculateMACRSDepreciation = async (sequelize, assetId, taxYear, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    if (!asset.macrsClass) {
        throw new Error('Asset must have MACRS class assigned');
    }
    const acquisitionYear = new Date(asset.acquisitionDate).getFullYear();
    const yearsInService = taxYear - acquisitionYear + 1;
    // Get MACRS rate for the asset class and year
    const macrsRate = (0, exports.getMACRSRate)(asset.macrsClass, yearsInService);
    const depreciableAmount = Number(asset.taxBasis);
    const annualDepreciation = depreciableAmount * macrsRate;
    // Ensure we don't over-depreciate
    const remainingDepreciation = depreciableAmount - Number(asset.taxDepreciation);
    return Math.min(annualDepreciation, remainingDepreciation);
};
exports.calculateMACRSDepreciation = calculateMACRSDepreciation;
/**
 * Gets the MACRS depreciation rate for a given class and year.
 *
 * @param {string} macrsClass - MACRS asset class
 * @param {number} year - Year in service (1-based)
 * @returns {number} Depreciation rate (decimal)
 *
 * @example
 * ```typescript
 * const rate = getMACRSRate('5-year', 2); // Returns 0.32 for year 2
 * ```
 */
const getMACRSRate = (macrsClass, year) => {
    // MACRS Half-Year Convention Tables
    const macrsRates = {
        '3-year': [0.3333, 0.4445, 0.1481, 0.0741],
        '5-year': [0.2000, 0.3200, 0.1920, 0.1152, 0.1152, 0.0576],
        '7-year': [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446],
        '10-year': [0.1000, 0.1800, 0.1440, 0.1152, 0.0922, 0.0737, 0.0655, 0.0655, 0.0656, 0.0655, 0.0328],
        '15-year': [0.0500, 0.0950, 0.0855, 0.0770, 0.0693, 0.0623, 0.0590, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0295],
        '20-year': [0.0375, 0.0722, 0.0668, 0.0618, 0.0571, 0.0528, 0.0489, 0.0452, 0.0447, 0.0447, 0.0446, 0.0446, 0.0447, 0.0446, 0.0447, 0.0446, 0.0447, 0.0446, 0.0447, 0.0446, 0.0223],
    };
    const rates = macrsRates[macrsClass];
    if (!rates) {
        throw new Error(`Invalid MACRS class: ${macrsClass}`);
    }
    if (year < 1 || year > rates.length) {
        return 0; // Fully depreciated
    }
    return rates[year - 1];
};
exports.getMACRSRate = getMACRSRate;
/**
 * Records depreciation for an asset for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CalculateDepreciationDto} depreciationData - Depreciation data
 * @param {string} userId - User recording depreciation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Depreciation record
 *
 * @example
 * ```typescript
 * const depreciation = await recordAssetDepreciation(sequelize, {
 *   assetId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   depreciationDate: new Date('2024-01-31'),
 *   depreciationType: 'book'
 * }, 'user123');
 * ```
 */
const recordAssetDepreciation = async (sequelize, depreciationData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const AssetDepreciation = (0, exports.createAssetDepreciationModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, depreciationData.assetId, transaction);
    // Calculate depreciation based on method
    let depreciationAmount = 0;
    let calculationBasis = '';
    switch (asset.depreciationMethod) {
        case 'straight-line':
            depreciationAmount = await (0, exports.calculateStraightLineDepreciation)(sequelize, depreciationData.assetId, depreciationData.depreciationDate, transaction);
            calculationBasis = 'Straight-line method';
            break;
        case 'declining-balance':
            depreciationAmount = await (0, exports.calculateDecliningBalanceDepreciation)(sequelize, depreciationData.assetId, depreciationData.depreciationDate, undefined, transaction);
            calculationBasis = 'Declining balance method';
            break;
        case 'double-declining':
            depreciationAmount = await (0, exports.calculateDoubleDecliningDepreciation)(sequelize, depreciationData.assetId, depreciationData.depreciationDate, transaction);
            calculationBasis = 'Double-declining balance method';
            break;
        case 'sum-of-years':
            depreciationAmount = await (0, exports.calculateSumOfYearsDigitsDepreciation)(sequelize, depreciationData.assetId, depreciationData.depreciationDate, transaction);
            calculationBasis = 'Sum-of-years-digits method';
            break;
        case 'MACRS':
            depreciationAmount = await (0, exports.calculateMACRSDepreciation)(sequelize, depreciationData.assetId, depreciationData.fiscalYear, transaction);
            // Convert annual to monthly for book purposes
            depreciationAmount = depreciationAmount / 12;
            calculationBasis = `MACRS ${asset.macrsClass} method`;
            break;
        default:
            throw new Error(`Unsupported depreciation method: ${asset.depreciationMethod}`);
    }
    const newAccumulatedDepreciation = Number(asset.accumulatedDepreciation) + depreciationAmount;
    const newBookValue = Number(asset.acquisitionCost) - newAccumulatedDepreciation;
    // Create depreciation record
    const depreciation = await AssetDepreciation.create({
        assetId: depreciationData.assetId,
        fiscalYear: depreciationData.fiscalYear,
        fiscalPeriod: depreciationData.fiscalPeriod,
        depreciationDate: depreciationData.depreciationDate,
        depreciationType: depreciationData.depreciationType || 'book',
        depreciationMethod: asset.depreciationMethod,
        depreciationAmount,
        accumulatedDepreciation: newAccumulatedDepreciation,
        netBookValue: newBookValue,
        calculationBasis,
        isAdjustment: false,
        status: 'calculated',
        createdBy: userId,
    }, { transaction });
    // Update asset
    await asset.update({
        accumulatedDepreciation: newAccumulatedDepreciation,
        currentBookValue: newBookValue,
        updatedBy: userId,
    }, { transaction });
    // Check if fully depreciated
    const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.residualValue);
    if (newAccumulatedDepreciation >= depreciableAmount) {
        await asset.update({ status: 'fully-depreciated' }, { transaction });
    }
    return depreciation;
};
exports.recordAssetDepreciation = recordAssetDepreciation;
/**
 * Calculates and records depreciation for multiple assets in a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Date} depreciationDate - Depreciation date
 * @param {string} userId - User running depreciation
 * @param {object} [filters] - Optional asset filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of depreciation records
 *
 * @example
 * ```typescript
 * const depreciations = await batchCalculateDepreciation(
 *   sequelize,
 *   2024,
 *   1,
 *   new Date('2024-01-31'),
 *   'user123',
 *   { locationCode: 'LOC-001' }
 * );
 * ```
 */
const batchCalculateDepreciation = async (sequelize, fiscalYear, fiscalPeriod, depreciationDate, userId, filters = {}, transaction) => {
    const assets = await (0, exports.listFixedAssets)(sequelize, { ...filters, status: 'active' }, 1000, 0, transaction);
    const depreciations = [];
    for (const asset of assets) {
        try {
            const depreciation = await (0, exports.recordAssetDepreciation)(sequelize, {
                assetId: asset.id,
                fiscalYear,
                fiscalPeriod,
                depreciationDate,
                depreciationType: 'book',
            }, userId, transaction);
            depreciations.push(depreciation);
        }
        catch (error) {
            // Log error but continue processing other assets
            console.error(`Failed to depreciate asset ${asset.assetNumber}:`, error.message);
        }
    }
    return depreciations;
};
exports.batchCalculateDepreciation = batchCalculateDepreciation;
// ============================================================================
// ASSET DISPOSAL FUNCTIONS
// ============================================================================
/**
 * Disposes of a fixed asset and calculates gain/loss.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DisposeAssetDto} disposalData - Disposal data
 * @param {string} userId - User disposing the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Disposal record
 *
 * @example
 * ```typescript
 * const disposal = await disposeFixedAsset(sequelize, {
 *   assetId: 1,
 *   disposalDate: new Date('2024-06-30'),
 *   disposalType: 'sale',
 *   disposalAmount: 5000,
 *   disposalReason: 'Upgraded to new model',
 *   approvedBy: 'manager123'
 * }, 'user123');
 * ```
 */
const disposeFixedAsset = async (sequelize, disposalData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, disposalData.assetId, transaction);
    if (asset.status === 'disposed') {
        throw new Error('Asset is already disposed');
    }
    const netBookValue = Number(asset.currentBookValue);
    const disposalAmount = Number(disposalData.disposalAmount);
    const gainLoss = disposalAmount - netBookValue;
    // Create disposal record using raw query (simplified)
    const disposalRecord = {
        disposalId: Date.now(), // Simplified ID generation
        assetId: disposalData.assetId,
        disposalDate: disposalData.disposalDate,
        disposalType: disposalData.disposalType,
        disposalAmount,
        netBookValue,
        accumulatedDepreciation: Number(asset.accumulatedDepreciation),
        gainLoss,
        disposalReason: disposalData.disposalReason,
        disposalApprovedBy: disposalData.approvedBy,
        disposalApprovalDate: new Date(),
    };
    // Update asset
    await asset.update({
        status: 'disposed',
        disposalDate: disposalData.disposalDate,
        disposalAmount,
        disposalGainLoss: gainLoss,
        updatedBy: userId,
    }, { transaction });
    return disposalRecord;
};
exports.disposeFixedAsset = disposeFixedAsset;
/**
 * Calculates gain or loss on asset disposal.
 *
 * @param {number} acquisitionCost - Original acquisition cost
 * @param {number} accumulatedDepreciation - Accumulated depreciation
 * @param {number} disposalAmount - Disposal proceeds
 * @returns {number} Gain (positive) or loss (negative)
 *
 * @example
 * ```typescript
 * const gainLoss = calculateDisposalGainLoss(10000, 6000, 5000);
 * // Returns: 1000 (gain)
 * ```
 */
const calculateDisposalGainLoss = (acquisitionCost, accumulatedDepreciation, disposalAmount) => {
    const netBookValue = acquisitionCost - accumulatedDepreciation;
    return disposalAmount - netBookValue;
};
exports.calculateDisposalGainLoss = calculateDisposalGainLoss;
/**
 * Reverses an asset disposal (before period close).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the disposal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * const asset = await reverseAssetDisposal(
 *   sequelize,
 *   1,
 *   'Disposal cancelled - asset returned',
 *   'user123'
 * );
 * ```
 */
const reverseAssetDisposal = async (sequelize, assetId, reversalReason, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    if (asset.status !== 'disposed') {
        throw new Error('Asset is not disposed');
    }
    // Restore asset to active status
    await asset.update({
        status: 'active',
        disposalDate: null,
        disposalAmount: null,
        disposalGainLoss: null,
        metadata: {
            ...asset.metadata,
            disposalReversal: {
                reversedAt: new Date(),
                reversedBy: userId,
                reason: reversalReason,
            },
        },
        updatedBy: userId,
    }, { transaction });
    return asset;
};
exports.reverseAssetDisposal = reverseAssetDisposal;
// ============================================================================
// ASSET TRANSFER FUNCTIONS
// ============================================================================
/**
 * Transfers an asset to a new location/department/cost center.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransferAssetDto} transferData - Transfer data
 * @param {string} userId - User initiating transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * ```typescript
 * const transfer = await transferFixedAsset(sequelize, {
 *   assetId: 1,
 *   transferDate: new Date(),
 *   toLocationCode: 'LOC-002',
 *   toDepartmentCode: 'DEPT-SALES',
 *   toCostCenter: 'CC-200',
 *   transferReason: 'Departmental reorganization',
 *   transferredBy: 'user123'
 * }, 'user123');
 * ```
 */
const transferFixedAsset = async (sequelize, transferData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, transferData.assetId, transaction);
    if (asset.status !== 'active') {
        throw new Error('Only active assets can be transferred');
    }
    // Create transfer record (simplified)
    const transferRecord = {
        transferId: Date.now(),
        assetId: transferData.assetId,
        transferDate: transferData.transferDate,
        fromLocationCode: asset.locationCode,
        fromDepartmentCode: asset.departmentCode,
        fromCostCenter: asset.costCenterCode,
        toLocationCode: transferData.toLocationCode,
        toDepartmentCode: transferData.toDepartmentCode,
        toCostCenter: transferData.toCostCenter,
        transferReason: transferData.transferReason,
        transferredBy: transferData.transferredBy,
        transferStatus: 'completed',
    };
    // Update asset location
    await asset.update({
        locationCode: transferData.toLocationCode,
        departmentCode: transferData.toDepartmentCode,
        costCenterCode: transferData.toCostCenter,
        updatedBy: userId,
    }, { transaction });
    return transferRecord;
};
exports.transferFixedAsset = transferFixedAsset;
/**
 * Bulk transfers multiple assets to a new location.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} assetIds - Array of asset IDs
 * @param {string} toLocationCode - Target location code
 * @param {string} toDepartmentCode - Target department code
 * @param {string} toCostCenter - Target cost center
 * @param {string} transferReason - Reason for transfer
 * @param {string} userId - User initiating transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of transfer records
 *
 * @example
 * ```typescript
 * const transfers = await bulkTransferAssets(
 *   sequelize,
 *   [1, 2, 3],
 *   'LOC-003',
 *   'DEPT-IT',
 *   'CC-300',
 *   'Office relocation',
 *   'user123'
 * );
 * ```
 */
const bulkTransferAssets = async (sequelize, assetIds, toLocationCode, toDepartmentCode, toCostCenter, transferReason, userId, transaction) => {
    const transfers = [];
    for (const assetId of assetIds) {
        try {
            const transfer = await (0, exports.transferFixedAsset)(sequelize, {
                assetId,
                transferDate: new Date(),
                toLocationCode,
                toDepartmentCode,
                toCostCenter,
                transferReason,
                transferredBy: userId,
            }, userId, transaction);
            transfers.push(transfer);
        }
        catch (error) {
            console.error(`Failed to transfer asset ${assetId}:`, error.message);
        }
    }
    return transfers;
};
exports.bulkTransferAssets = bulkTransferAssets;
// ============================================================================
// ASSET REVALUATION AND IMPAIRMENT FUNCTIONS
// ============================================================================
/**
 * Revalues a fixed asset (IFRS compliance).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevalueAssetDto} revaluationData - Revaluation data
 * @param {string} userId - User performing revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revaluation record
 *
 * @example
 * ```typescript
 * const revaluation = await revalueFixedAsset(sequelize, {
 *   assetId: 1,
 *   revaluationDate: new Date(),
 *   revaluedAmount: 12000,
 *   revaluationReason: 'Fair value adjustment per IFRS 13',
 *   accountingStandard: 'IFRS',
 *   approvedBy: 'cfo123'
 * }, 'user123');
 * ```
 */
const revalueFixedAsset = async (sequelize, revaluationData, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, revaluationData.assetId, transaction);
    if (asset.status !== 'active') {
        throw new Error('Only active assets can be revalued');
    }
    const previousBookValue = Number(asset.currentBookValue);
    const revaluedAmount = Number(revaluationData.revaluedAmount);
    const revaluationSurplus = revaluedAmount - previousBookValue;
    const revaluationType = revaluationSurplus >= 0 ? 'upward' : 'downward';
    // Create revaluation record (simplified)
    const revaluationRecord = {
        revaluationId: Date.now(),
        assetId: revaluationData.assetId,
        revaluationDate: revaluationData.revaluationDate,
        revaluationType,
        previousBookValue,
        revaluedAmount,
        revaluationSurplus,
        revaluationReason: revaluationData.revaluationReason,
        accountingStandard: revaluationData.accountingStandard,
        approvedBy: revaluationData.approvedBy,
    };
    // Update asset book value
    await asset.update({
        currentBookValue: revaluedAmount,
        metadata: {
            ...asset.metadata,
            lastRevaluation: revaluationRecord,
        },
        updatedBy: userId,
    }, { transaction });
    return revaluationRecord;
};
exports.revalueFixedAsset = revalueFixedAsset;
/**
 * Tests an asset for impairment and records impairment loss if necessary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} testingDate - Impairment testing date
 * @param {number} recoverableAmount - Recoverable amount (higher of fair value or value in use)
 * @param {string[]} impairmentIndicators - Indicators that triggered the test
 * @param {string} userId - User performing impairment test
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Impairment record (or null if no impairment)
 *
 * @example
 * ```typescript
 * const impairment = await testAssetImpairment(
 *   sequelize,
 *   1,
 *   new Date(),
 *   8000,
 *   ['Technological obsolescence', 'Market decline'],
 *   'user123'
 * );
 * ```
 */
const testAssetImpairment = async (sequelize, assetId, testingDate, recoverableAmount, impairmentIndicators, userId, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const carryingAmount = Number(asset.currentBookValue);
    if (recoverableAmount >= carryingAmount) {
        return null; // No impairment
    }
    const impairmentLoss = carryingAmount - recoverableAmount;
    // Create impairment record (simplified)
    const impairmentRecord = {
        impairmentId: Date.now(),
        assetId,
        impairmentDate: testingDate,
        testingDate,
        carryingAmount,
        recoverableAmount,
        impairmentLoss,
        impairmentIndicators,
        impairmentReason: impairmentIndicators.join('; '),
        accountingStandard: 'GAAP',
        reversalAllowed: false,
        testedBy: userId,
        approvedBy: userId,
    };
    // Update asset
    await asset.update({
        currentBookValue: recoverableAmount,
        status: 'impaired',
        accumulatedDepreciation: Number(asset.accumulatedDepreciation) + impairmentLoss,
        metadata: {
            ...asset.metadata,
            impairment: impairmentRecord,
        },
        updatedBy: userId,
    }, { transaction });
    return impairmentRecord;
};
exports.testAssetImpairment = testAssetImpairment;
// ============================================================================
// ASSET REPORTING AND ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates a depreciation schedule for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} [numberOfPeriods=12] - Number of periods to project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AssetDepreciationSchedule[]>} Depreciation schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateDepreciationSchedule(sequelize, 1, 60);
 * // Returns 60-month depreciation projection
 * ```
 */
const generateDepreciationSchedule = async (sequelize, assetId, numberOfPeriods = 12, transaction) => {
    const asset = await (0, exports.getFixedAssetById)(sequelize, assetId, transaction);
    const schedule = [];
    let runningBookValue = Number(asset.currentBookValue);
    let runningAccumulated = Number(asset.accumulatedDepreciation);
    const startDate = new Date();
    for (let i = 0; i < numberOfPeriods; i++) {
        const periodDate = (0, date_fns_1.addMonths)(startDate, i);
        const periodYear = periodDate.getFullYear();
        const periodMonth = periodDate.getMonth() + 1;
        // Calculate depreciation for this period
        let depreciation = 0;
        if (asset.depreciationMethod === 'straight-line') {
            const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.residualValue);
            const totalMonths = Number(asset.usefulLife) * 12;
            depreciation = depreciableAmount / totalMonths;
        }
        else if (asset.depreciationMethod === 'declining-balance') {
            const rate = Number(asset.depreciationRate) || (1 / Number(asset.usefulLife));
            depreciation = runningBookValue * (rate / 12);
        }
        // Ensure we don't depreciate below residual value
        const maxDepreciation = runningBookValue - Number(asset.residualValue);
        depreciation = Math.min(depreciation, maxDepreciation);
        if (depreciation < 0)
            depreciation = 0;
        runningAccumulated += depreciation;
        runningBookValue -= depreciation;
        schedule.push({
            scheduleId: i + 1,
            assetId,
            periodYear,
            periodMonth,
            beginningBookValue: runningBookValue + depreciation,
            depreciationExpense: depreciation,
            accumulatedDepreciation: runningAccumulated,
            endingBookValue: runningBookValue,
        });
        // Stop if fully depreciated
        if (runningBookValue <= Number(asset.residualValue)) {
            break;
        }
    }
    return schedule;
};
exports.generateDepreciationSchedule = generateDepreciationSchedule;
/**
 * Generates an asset register report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Report filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset register data
 *
 * @example
 * ```typescript
 * const register = await generateAssetRegister(sequelize, {
 *   assetType: 'equipment',
 *   status: 'active',
 *   locationCode: 'LOC-001'
 * });
 * ```
 */
const generateAssetRegister = async (sequelize, filters = {}, transaction) => {
    const assets = await (0, exports.listFixedAssets)(sequelize, filters, 10000, 0, transaction);
    let totalAcquisitionCost = 0;
    let totalAccumulatedDepreciation = 0;
    let totalCurrentBookValue = 0;
    const assetsByCategory = {};
    const assetsByLocation = {};
    for (const asset of assets) {
        totalAcquisitionCost += Number(asset.acquisitionCost);
        totalAccumulatedDepreciation += Number(asset.accumulatedDepreciation);
        totalCurrentBookValue += Number(asset.currentBookValue);
        // Group by category
        if (!assetsByCategory[asset.assetCategory]) {
            assetsByCategory[asset.assetCategory] = {
                count: 0,
                acquisitionCost: 0,
                accumulatedDepreciation: 0,
                bookValue: 0,
            };
        }
        assetsByCategory[asset.assetCategory].count++;
        assetsByCategory[asset.assetCategory].acquisitionCost += Number(asset.acquisitionCost);
        assetsByCategory[asset.assetCategory].accumulatedDepreciation += Number(asset.accumulatedDepreciation);
        assetsByCategory[asset.assetCategory].bookValue += Number(asset.currentBookValue);
        // Group by location
        if (!assetsByLocation[asset.locationCode]) {
            assetsByLocation[asset.locationCode] = {
                count: 0,
                acquisitionCost: 0,
                accumulatedDepreciation: 0,
                bookValue: 0,
            };
        }
        assetsByLocation[asset.locationCode].count++;
        assetsByLocation[asset.locationCode].acquisitionCost += Number(asset.acquisitionCost);
        assetsByLocation[asset.locationCode].accumulatedDepreciation += Number(asset.accumulatedDepreciation);
        assetsByLocation[asset.locationCode].bookValue += Number(asset.currentBookValue);
    }
    return {
        summary: {
            totalAssets: assets.length,
            totalAcquisitionCost,
            totalAccumulatedDepreciation,
            totalCurrentBookValue,
        },
        byCategory: assetsByCategory,
        byLocation: assetsByLocation,
        assets,
    };
};
exports.generateAssetRegister = generateAssetRegister;
/**
 * Calculates total depreciation expense for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total depreciation expense
 *
 * @example
 * ```typescript
 * const totalDepreciation = await calculatePeriodDepreciationExpense(
 *   sequelize,
 *   2024,
 *   1
 * );
 * ```
 */
const calculatePeriodDepreciationExpense = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const AssetDepreciation = (0, exports.createAssetDepreciationModel)(sequelize);
    const depreciations = await AssetDepreciation.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            status: 'posted',
        },
        transaction,
    });
    let total = 0;
    for (const depreciation of depreciations) {
        total += Number(depreciation.depreciationAmount);
    }
    return total;
};
exports.calculatePeriodDepreciationExpense = calculatePeriodDepreciationExpense;
/**
 * Lists all assets due for disposal based on age or condition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [ageThresholdYears=10] - Age threshold in years
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Assets recommended for disposal
 *
 * @example
 * ```typescript
 * const assetsForDisposal = await listAssetsForDisposal(sequelize, 8);
 * ```
 */
const listAssetsForDisposal = async (sequelize, ageThresholdYears = 10, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const thresholdDate = new Date();
    thresholdDate.setFullYear(thresholdDate.getFullYear() - ageThresholdYears);
    const assets = await FixedAsset.findAll({
        where: {
            status: 'active',
            acquisitionDate: {
                [sequelize_1.Op.lte]: thresholdDate,
            },
        },
        order: [['acquisitionDate', 'ASC']],
        transaction,
    });
    return assets;
};
exports.listAssetsForDisposal = listAssetsForDisposal;
/**
 * Exports asset data for tax reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Tax-ready asset data
 *
 * @example
 * ```typescript
 * const taxData = await exportAssetTaxData(sequelize, 2024);
 * ```
 */
const exportAssetTaxData = async (sequelize, taxYear, transaction) => {
    const FixedAsset = (0, exports.createFixedAssetModel)(sequelize);
    const assets = await FixedAsset.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { status: 'active' },
                {
                    status: 'disposed',
                    disposalDate: {
                        [sequelize_1.Op.gte]: new Date(taxYear, 0, 1),
                        [sequelize_1.Op.lte]: new Date(taxYear, 11, 31),
                    },
                },
            ],
        },
        order: [['assetNumber', 'ASC']],
        transaction,
    });
    return assets.map(asset => ({
        assetNumber: asset.assetNumber,
        assetName: asset.assetName,
        assetCategory: asset.assetCategory,
        acquisitionDate: asset.acquisitionDate,
        acquisitionCost: asset.acquisitionCost,
        taxBasis: asset.taxBasis,
        taxDepreciation: asset.taxDepreciation,
        taxBookValue: Number(asset.taxBasis) - Number(asset.taxDepreciation),
        macrsClass: asset.macrsClass,
        status: asset.status,
        disposalDate: asset.disposalDate,
        disposalAmount: asset.disposalAmount,
        taxGainLoss: asset.status === 'disposed'
            ? Number(asset.disposalAmount || 0) - (Number(asset.taxBasis) - Number(asset.taxDepreciation))
            : null,
    }));
};
exports.exportAssetTaxData = exportAssetTaxData;
//# sourceMappingURL=fixed-assets-depreciation-kit.js.map