"use strict";
/**
 * LOC: WC-ORD-WHSFUL-001
 * File: /reuse/order/warehouse-fulfillment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Order fulfillment services
 *   - Warehouse management systems
 *   - Inventory management services
 *   - Shipping integration services
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
exports.QUALITY_CHECK_SERVICE = exports.CARTONIZATION_ENGINE = exports.WAREHOUSE_FULFILLMENT_SERVICE = exports.PickerPerformance = exports.QualityCheck = exports.Shipment = exports.CartonContent = exports.Carton = exports.PickTask = exports.PickList = exports.OrderLine = exports.Order = exports.WaveOrder = exports.WavePick = exports.WarehouseZone = exports.Warehouse = exports.ZoneType = exports.CartonizationStrategy = exports.ShipmentStatus = exports.QualityCheckStatus = exports.PackingStatus = exports.WaveStatus = exports.PickTaskStatus = exports.PickingStrategy = void 0;
exports.planWave = planWave;
exports.releaseWave = releaseWave;
exports.optimizeWaveRouting = optimizeWaveRouting;
exports.getActiveWaves = getActiveWaves;
exports.cancelWave = cancelWave;
exports.calculateWaveCapacity = calculateWaveCapacity;
exports.generatePickLists = generatePickLists;
exports.assignPickList = assignPickList;
exports.getPickListWithTasks = getPickListWithTasks;
exports.startPicking = startPicking;
exports.confirmPick = confirmPick;
exports.handleShortPick = handleShortPick;
exports.completePickList = completePickList;
exports.getPickTasksByLocation = getPickTasksByLocation;
exports.calculatePickListProgress = calculatePickListProgress;
exports.performCartonization = performCartonization;
exports.createCarton = createCarton;
exports.addItemsToCarton = addItemsToCarton;
exports.completeCartonPacking = completeCartonPacking;
exports.verifyCartonContents = verifyCartonContents;
exports.getPackingSummary = getPackingSummary;
exports.generateShippingLabel = generateShippingLabel;
exports.generatePackingSlip = generatePackingSlip;
exports.manifestShipment = manifestShipment;
exports.printBatchLabels = printBatchLabels;
exports.createQualityCheck = createQualityCheck;
exports.performQualityCheck = performQualityCheck;
exports.validateExpirationDates = validateExpirationDates;
exports.verifyLotAndSerial = verifyLotAndSerial;
exports.checkTemperatureCompliance = checkTemperatureCompliance;
exports.updateInventoryAfterPick = updateInventoryAfterPick;
exports.reserveInventoryForWave = reserveInventoryForWave;
exports.releaseReservedInventory = releaseReservedInventory;
exports.syncInventoryWithWMS = syncInventoryWithWMS;
exports.calculatePickerPerformance = calculatePickerPerformance;
exports.getRealtimePickingStatus = getRealtimePickingStatus;
exports.generateFulfillmentReport = generateFulfillmentReport;
exports.identifyFulfillmentBottlenecks = identifyFulfillmentBottlenecks;
exports.exportAuditTrail = exportAuditTrail;
/**
 * File: /reuse/order/warehouse-fulfillment-kit.ts
 * Locator: WC-ORD-WHSFUL-001
 * Purpose: Warehouse Fulfillment Operations - Picking, packing, shipping
 *
 * Upstream: Independent utility module for warehouse fulfillment operations
 * Downstream: ../backend/warehouse/*, Fulfillment services, Inventory services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 42 utility functions for wave planning, picking, packing, shipping, quality, tracking
 *
 * LLM Context: Enterprise-grade warehouse fulfillment toolkit for White Cross healthcare platform.
 * Provides wave planning optimization, multi-strategy picking (single, batch, zone, cluster),
 * intelligent cartonization, packing operations, shipping label generation, packing slip generation,
 * quality control checkpoints, real-time inventory updates, status tracking, task assignment,
 * picker performance metrics, and HIPAA-compliant audit trails for medical supply fulfillment.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Picking strategy types
 */
var PickingStrategy;
(function (PickingStrategy) {
    PickingStrategy["SINGLE_ORDER"] = "SINGLE_ORDER";
    PickingStrategy["BATCH_PICK"] = "BATCH_PICK";
    PickingStrategy["ZONE_PICK"] = "ZONE_PICK";
    PickingStrategy["CLUSTER_PICK"] = "CLUSTER_PICK";
    PickingStrategy["WAVE_PICK"] = "WAVE_PICK";
})(PickingStrategy || (exports.PickingStrategy = PickingStrategy = {}));
/**
 * Pick task status
 */
var PickTaskStatus;
(function (PickTaskStatus) {
    PickTaskStatus["PENDING"] = "PENDING";
    PickTaskStatus["ASSIGNED"] = "ASSIGNED";
    PickTaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PickTaskStatus["PICKED"] = "PICKED";
    PickTaskStatus["SHORT_PICKED"] = "SHORT_PICKED";
    PickTaskStatus["CANCELLED"] = "CANCELLED";
    PickTaskStatus["COMPLETED"] = "COMPLETED";
})(PickTaskStatus || (exports.PickTaskStatus = PickTaskStatus = {}));
/**
 * Wave status
 */
var WaveStatus;
(function (WaveStatus) {
    WaveStatus["PLANNED"] = "PLANNED";
    WaveStatus["RELEASED"] = "RELEASED";
    WaveStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WaveStatus["PICKING_COMPLETE"] = "PICKING_COMPLETE";
    WaveStatus["PACKING_COMPLETE"] = "PACKING_COMPLETE";
    WaveStatus["SHIPPED"] = "SHIPPED";
    WaveStatus["CANCELLED"] = "CANCELLED";
})(WaveStatus || (exports.WaveStatus = WaveStatus = {}));
/**
 * Packing status
 */
var PackingStatus;
(function (PackingStatus) {
    PackingStatus["PENDING"] = "PENDING";
    PackingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PackingStatus["PACKED"] = "PACKED";
    PackingStatus["MANIFESTED"] = "MANIFESTED";
    PackingStatus["SHIPPED"] = "SHIPPED";
    PackingStatus["CANCELLED"] = "CANCELLED";
})(PackingStatus || (exports.PackingStatus = PackingStatus = {}));
/**
 * Quality check status
 */
var QualityCheckStatus;
(function (QualityCheckStatus) {
    QualityCheckStatus["PENDING"] = "PENDING";
    QualityCheckStatus["IN_PROGRESS"] = "IN_PROGRESS";
    QualityCheckStatus["PASSED"] = "PASSED";
    QualityCheckStatus["FAILED"] = "FAILED";
    QualityCheckStatus["CONDITIONAL_PASS"] = "CONDITIONAL_PASS";
})(QualityCheckStatus || (exports.QualityCheckStatus = QualityCheckStatus = {}));
/**
 * Shipment status
 */
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["PENDING"] = "PENDING";
    ShipmentStatus["LABEL_CREATED"] = "LABEL_CREATED";
    ShipmentStatus["MANIFESTED"] = "MANIFESTED";
    ShipmentStatus["PICKED_UP"] = "PICKED_UP";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["EXCEPTION"] = "EXCEPTION";
    ShipmentStatus["RETURNED"] = "RETURNED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
/**
 * Cartonization strategy
 */
var CartonizationStrategy;
(function (CartonizationStrategy) {
    CartonizationStrategy["MINIMIZE_BOXES"] = "MINIMIZE_BOXES";
    CartonizationStrategy["MINIMIZE_COST"] = "MINIMIZE_COST";
    CartonizationStrategy["OPTIMIZE_WEIGHT"] = "OPTIMIZE_WEIGHT";
    CartonizationStrategy["FRAGILE_FIRST"] = "FRAGILE_FIRST";
    CartonizationStrategy["TEMPERATURE_CONTROLLED"] = "TEMPERATURE_CONTROLLED";
})(CartonizationStrategy || (exports.CartonizationStrategy = CartonizationStrategy = {}));
/**
 * Zone type
 */
var ZoneType;
(function (ZoneType) {
    ZoneType["FAST_PICK"] = "FAST_PICK";
    ZoneType["RESERVE"] = "RESERVE";
    ZoneType["BULK"] = "BULK";
    ZoneType["REFRIGERATED"] = "REFRIGERATED";
    ZoneType["CONTROLLED_SUBSTANCE"] = "CONTROLLED_SUBSTANCE";
    ZoneType["HAZMAT"] = "HAZMAT";
})(ZoneType || (exports.ZoneType = ZoneType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Warehouse model
 */
let Warehouse = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'warehouses', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _warehouseCode_decorators;
    let _warehouseCode_initializers = [];
    let _warehouseCode_extraInitializers = [];
    let _warehouseName_decorators;
    let _warehouseName_initializers = [];
    let _warehouseName_extraInitializers = [];
    let _addressLine1_decorators;
    let _addressLine1_initializers = [];
    let _addressLine1_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _stateProvince_decorators;
    let _stateProvince_initializers = [];
    let _stateProvince_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _waves_decorators;
    let _waves_initializers = [];
    let _waves_extraInitializers = [];
    let _zones_decorators;
    let _zones_initializers = [];
    let _zones_extraInitializers = [];
    let _pickTasks_decorators;
    let _pickTasks_initializers = [];
    let _pickTasks_extraInitializers = [];
    var Warehouse = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.warehouseId = __runInitializers(this, _warehouseId_initializers, void 0);
            this.warehouseCode = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _warehouseCode_initializers, void 0));
            this.warehouseName = (__runInitializers(this, _warehouseCode_extraInitializers), __runInitializers(this, _warehouseName_initializers, void 0));
            this.addressLine1 = (__runInitializers(this, _warehouseName_extraInitializers), __runInitializers(this, _addressLine1_initializers, void 0));
            this.city = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _city_initializers, void 0));
            this.stateProvince = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _stateProvince_initializers, void 0));
            this.postalCode = (__runInitializers(this, _stateProvince_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
            this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.isActive = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.waves = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _waves_initializers, void 0));
            this.zones = (__runInitializers(this, _waves_extraInitializers), __runInitializers(this, _zones_initializers, void 0));
            this.pickTasks = (__runInitializers(this, _zones_extraInitializers), __runInitializers(this, _pickTasks_initializers, void 0));
            __runInitializers(this, _pickTasks_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Warehouse");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _warehouseId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _warehouseCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _warehouseName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _addressLine1_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _city_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _stateProvince_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _postalCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20) })];
        _country_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(2) })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _waves_decorators = [(0, sequelize_typescript_1.HasMany)(() => WavePick)];
        _zones_decorators = [(0, sequelize_typescript_1.HasMany)(() => WarehouseZone)];
        _pickTasks_decorators = [(0, sequelize_typescript_1.HasMany)(() => PickTask)];
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _warehouseCode_decorators, { kind: "field", name: "warehouseCode", static: false, private: false, access: { has: obj => "warehouseCode" in obj, get: obj => obj.warehouseCode, set: (obj, value) => { obj.warehouseCode = value; } }, metadata: _metadata }, _warehouseCode_initializers, _warehouseCode_extraInitializers);
        __esDecorate(null, null, _warehouseName_decorators, { kind: "field", name: "warehouseName", static: false, private: false, access: { has: obj => "warehouseName" in obj, get: obj => obj.warehouseName, set: (obj, value) => { obj.warehouseName = value; } }, metadata: _metadata }, _warehouseName_initializers, _warehouseName_extraInitializers);
        __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: obj => "addressLine1" in obj, get: obj => obj.addressLine1, set: (obj, value) => { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _stateProvince_decorators, { kind: "field", name: "stateProvince", static: false, private: false, access: { has: obj => "stateProvince" in obj, get: obj => obj.stateProvince, set: (obj, value) => { obj.stateProvince = value; } }, metadata: _metadata }, _stateProvince_initializers, _stateProvince_extraInitializers);
        __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _waves_decorators, { kind: "field", name: "waves", static: false, private: false, access: { has: obj => "waves" in obj, get: obj => obj.waves, set: (obj, value) => { obj.waves = value; } }, metadata: _metadata }, _waves_initializers, _waves_extraInitializers);
        __esDecorate(null, null, _zones_decorators, { kind: "field", name: "zones", static: false, private: false, access: { has: obj => "zones" in obj, get: obj => obj.zones, set: (obj, value) => { obj.zones = value; } }, metadata: _metadata }, _zones_initializers, _zones_extraInitializers);
        __esDecorate(null, null, _pickTasks_decorators, { kind: "field", name: "pickTasks", static: false, private: false, access: { has: obj => "pickTasks" in obj, get: obj => obj.pickTasks, set: (obj, value) => { obj.pickTasks = value; } }, metadata: _metadata }, _pickTasks_initializers, _pickTasks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Warehouse = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Warehouse = _classThis;
})();
exports.Warehouse = Warehouse;
/**
 * Warehouse zone model
 */
let WarehouseZone = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'warehouse_zones', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _zoneCode_decorators;
    let _zoneCode_initializers = [];
    let _zoneCode_extraInitializers = [];
    let _zoneName_decorators;
    let _zoneName_initializers = [];
    let _zoneName_extraInitializers = [];
    let _zoneType_decorators;
    let _zoneType_initializers = [];
    let _zoneType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _warehouse_decorators;
    let _warehouse_initializers = [];
    let _warehouse_extraInitializers = [];
    let _pickTasks_decorators;
    let _pickTasks_initializers = [];
    let _pickTasks_extraInitializers = [];
    var WarehouseZone = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.zoneId = __runInitializers(this, _zoneId_initializers, void 0);
            this.warehouseId = (__runInitializers(this, _zoneId_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.zoneCode = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _zoneCode_initializers, void 0));
            this.zoneName = (__runInitializers(this, _zoneCode_extraInitializers), __runInitializers(this, _zoneName_initializers, void 0));
            this.zoneType = (__runInitializers(this, _zoneName_extraInitializers), __runInitializers(this, _zoneType_initializers, void 0));
            this.priority = (__runInitializers(this, _zoneType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.isActive = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.warehouse = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _warehouse_initializers, void 0));
            this.pickTasks = (__runInitializers(this, _warehouse_extraInitializers), __runInitializers(this, _pickTasks_initializers, void 0));
            __runInitializers(this, _pickTasks_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WarehouseZone");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _zoneId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _warehouseId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Warehouse), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _zoneCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _zoneName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _zoneType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ZoneType)), allowNull: false })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 1 })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _warehouse_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Warehouse)];
        _pickTasks_decorators = [(0, sequelize_typescript_1.HasMany)(() => PickTask)];
        __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _zoneCode_decorators, { kind: "field", name: "zoneCode", static: false, private: false, access: { has: obj => "zoneCode" in obj, get: obj => obj.zoneCode, set: (obj, value) => { obj.zoneCode = value; } }, metadata: _metadata }, _zoneCode_initializers, _zoneCode_extraInitializers);
        __esDecorate(null, null, _zoneName_decorators, { kind: "field", name: "zoneName", static: false, private: false, access: { has: obj => "zoneName" in obj, get: obj => obj.zoneName, set: (obj, value) => { obj.zoneName = value; } }, metadata: _metadata }, _zoneName_initializers, _zoneName_extraInitializers);
        __esDecorate(null, null, _zoneType_decorators, { kind: "field", name: "zoneType", static: false, private: false, access: { has: obj => "zoneType" in obj, get: obj => obj.zoneType, set: (obj, value) => { obj.zoneType = value; } }, metadata: _metadata }, _zoneType_initializers, _zoneType_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _warehouse_decorators, { kind: "field", name: "warehouse", static: false, private: false, access: { has: obj => "warehouse" in obj, get: obj => obj.warehouse, set: (obj, value) => { obj.warehouse = value; } }, metadata: _metadata }, _warehouse_initializers, _warehouse_extraInitializers);
        __esDecorate(null, null, _pickTasks_decorators, { kind: "field", name: "pickTasks", static: false, private: false, access: { has: obj => "pickTasks" in obj, get: obj => obj.pickTasks, set: (obj, value) => { obj.pickTasks = value; } }, metadata: _metadata }, _pickTasks_initializers, _pickTasks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarehouseZone = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarehouseZone = _classThis;
})();
exports.WarehouseZone = WarehouseZone;
/**
 * Wave pick model
 */
let WavePick = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wave_picks',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['waveNumber'], unique: true },
                { fields: ['warehouseId', 'status'] },
                { fields: ['plannedReleaseTime'] },
            ],
        }), (0, sequelize_typescript_1.Scopes)(() => ({
            active: {
                where: {
                    status: {
                        [sequelize_1.Op.in]: [WaveStatus.PLANNED, WaveStatus.RELEASED, WaveStatus.IN_PROGRESS],
                    },
                },
            },
            released: {
                where: { status: WaveStatus.RELEASED },
            },
            inProgress: {
                where: { status: WaveStatus.IN_PROGRESS },
            },
        }))];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _waveId_decorators;
    let _waveId_initializers = [];
    let _waveId_extraInitializers = [];
    let _waveNumber_decorators;
    let _waveNumber_initializers = [];
    let _waveNumber_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _pickingStrategy_decorators;
    let _pickingStrategy_initializers = [];
    let _pickingStrategy_extraInitializers = [];
    let _totalOrders_decorators;
    let _totalOrders_initializers = [];
    let _totalOrders_extraInitializers = [];
    let _totalItems_decorators;
    let _totalItems_initializers = [];
    let _totalItems_extraInitializers = [];
    let _totalWeight_decorators;
    let _totalWeight_initializers = [];
    let _totalWeight_extraInitializers = [];
    let _plannedReleaseTime_decorators;
    let _plannedReleaseTime_initializers = [];
    let _plannedReleaseTime_extraInitializers = [];
    let _actualReleaseTime_decorators;
    let _actualReleaseTime_initializers = [];
    let _actualReleaseTime_extraInitializers = [];
    let _pickingStartTime_decorators;
    let _pickingStartTime_initializers = [];
    let _pickingStartTime_extraInitializers = [];
    let _pickingCompleteTime_decorators;
    let _pickingCompleteTime_initializers = [];
    let _pickingCompleteTime_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _releasedBy_decorators;
    let _releasedBy_initializers = [];
    let _releasedBy_extraInitializers = [];
    let _warehouse_decorators;
    let _warehouse_initializers = [];
    let _warehouse_extraInitializers = [];
    let _pickLists_decorators;
    let _pickLists_initializers = [];
    let _pickLists_extraInitializers = [];
    let _orders_decorators;
    let _orders_initializers = [];
    let _orders_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WavePick = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.waveId = __runInitializers(this, _waveId_initializers, void 0);
            this.waveNumber = (__runInitializers(this, _waveId_extraInitializers), __runInitializers(this, _waveNumber_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _waveNumber_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.status = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.pickingStrategy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _pickingStrategy_initializers, void 0));
            this.totalOrders = (__runInitializers(this, _pickingStrategy_extraInitializers), __runInitializers(this, _totalOrders_initializers, void 0));
            this.totalItems = (__runInitializers(this, _totalOrders_extraInitializers), __runInitializers(this, _totalItems_initializers, void 0));
            this.totalWeight = (__runInitializers(this, _totalItems_extraInitializers), __runInitializers(this, _totalWeight_initializers, void 0));
            this.plannedReleaseTime = (__runInitializers(this, _totalWeight_extraInitializers), __runInitializers(this, _plannedReleaseTime_initializers, void 0));
            this.actualReleaseTime = (__runInitializers(this, _plannedReleaseTime_extraInitializers), __runInitializers(this, _actualReleaseTime_initializers, void 0));
            this.pickingStartTime = (__runInitializers(this, _actualReleaseTime_extraInitializers), __runInitializers(this, _pickingStartTime_initializers, void 0));
            this.pickingCompleteTime = (__runInitializers(this, _pickingStartTime_extraInitializers), __runInitializers(this, _pickingCompleteTime_initializers, void 0));
            this.createdBy = (__runInitializers(this, _pickingCompleteTime_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.releasedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _releasedBy_initializers, void 0));
            this.warehouse = (__runInitializers(this, _releasedBy_extraInitializers), __runInitializers(this, _warehouse_initializers, void 0));
            this.pickLists = (__runInitializers(this, _warehouse_extraInitializers), __runInitializers(this, _pickLists_initializers, void 0));
            this.orders = (__runInitializers(this, _pickLists_extraInitializers), __runInitializers(this, _orders_initializers, void 0));
            this.createdAt = (__runInitializers(this, _orders_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WavePick");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _waveId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _waveNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _warehouseId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Warehouse), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(WaveStatus)), allowNull: false, defaultValue: WaveStatus.PLANNED }), sequelize_typescript_1.Index];
        _pickingStrategy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PickingStrategy)), allowNull: false })];
        _totalOrders_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _totalItems_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _totalWeight_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _plannedReleaseTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _actualReleaseTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _pickingStartTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _pickingCompleteTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _releasedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _warehouse_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Warehouse)];
        _pickLists_decorators = [(0, sequelize_typescript_1.HasMany)(() => PickList)];
        _orders_decorators = [(0, sequelize_typescript_1.BelongsToMany)(() => Order, () => WaveOrder)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _waveId_decorators, { kind: "field", name: "waveId", static: false, private: false, access: { has: obj => "waveId" in obj, get: obj => obj.waveId, set: (obj, value) => { obj.waveId = value; } }, metadata: _metadata }, _waveId_initializers, _waveId_extraInitializers);
        __esDecorate(null, null, _waveNumber_decorators, { kind: "field", name: "waveNumber", static: false, private: false, access: { has: obj => "waveNumber" in obj, get: obj => obj.waveNumber, set: (obj, value) => { obj.waveNumber = value; } }, metadata: _metadata }, _waveNumber_initializers, _waveNumber_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _pickingStrategy_decorators, { kind: "field", name: "pickingStrategy", static: false, private: false, access: { has: obj => "pickingStrategy" in obj, get: obj => obj.pickingStrategy, set: (obj, value) => { obj.pickingStrategy = value; } }, metadata: _metadata }, _pickingStrategy_initializers, _pickingStrategy_extraInitializers);
        __esDecorate(null, null, _totalOrders_decorators, { kind: "field", name: "totalOrders", static: false, private: false, access: { has: obj => "totalOrders" in obj, get: obj => obj.totalOrders, set: (obj, value) => { obj.totalOrders = value; } }, metadata: _metadata }, _totalOrders_initializers, _totalOrders_extraInitializers);
        __esDecorate(null, null, _totalItems_decorators, { kind: "field", name: "totalItems", static: false, private: false, access: { has: obj => "totalItems" in obj, get: obj => obj.totalItems, set: (obj, value) => { obj.totalItems = value; } }, metadata: _metadata }, _totalItems_initializers, _totalItems_extraInitializers);
        __esDecorate(null, null, _totalWeight_decorators, { kind: "field", name: "totalWeight", static: false, private: false, access: { has: obj => "totalWeight" in obj, get: obj => obj.totalWeight, set: (obj, value) => { obj.totalWeight = value; } }, metadata: _metadata }, _totalWeight_initializers, _totalWeight_extraInitializers);
        __esDecorate(null, null, _plannedReleaseTime_decorators, { kind: "field", name: "plannedReleaseTime", static: false, private: false, access: { has: obj => "plannedReleaseTime" in obj, get: obj => obj.plannedReleaseTime, set: (obj, value) => { obj.plannedReleaseTime = value; } }, metadata: _metadata }, _plannedReleaseTime_initializers, _plannedReleaseTime_extraInitializers);
        __esDecorate(null, null, _actualReleaseTime_decorators, { kind: "field", name: "actualReleaseTime", static: false, private: false, access: { has: obj => "actualReleaseTime" in obj, get: obj => obj.actualReleaseTime, set: (obj, value) => { obj.actualReleaseTime = value; } }, metadata: _metadata }, _actualReleaseTime_initializers, _actualReleaseTime_extraInitializers);
        __esDecorate(null, null, _pickingStartTime_decorators, { kind: "field", name: "pickingStartTime", static: false, private: false, access: { has: obj => "pickingStartTime" in obj, get: obj => obj.pickingStartTime, set: (obj, value) => { obj.pickingStartTime = value; } }, metadata: _metadata }, _pickingStartTime_initializers, _pickingStartTime_extraInitializers);
        __esDecorate(null, null, _pickingCompleteTime_decorators, { kind: "field", name: "pickingCompleteTime", static: false, private: false, access: { has: obj => "pickingCompleteTime" in obj, get: obj => obj.pickingCompleteTime, set: (obj, value) => { obj.pickingCompleteTime = value; } }, metadata: _metadata }, _pickingCompleteTime_initializers, _pickingCompleteTime_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _releasedBy_decorators, { kind: "field", name: "releasedBy", static: false, private: false, access: { has: obj => "releasedBy" in obj, get: obj => obj.releasedBy, set: (obj, value) => { obj.releasedBy = value; } }, metadata: _metadata }, _releasedBy_initializers, _releasedBy_extraInitializers);
        __esDecorate(null, null, _warehouse_decorators, { kind: "field", name: "warehouse", static: false, private: false, access: { has: obj => "warehouse" in obj, get: obj => obj.warehouse, set: (obj, value) => { obj.warehouse = value; } }, metadata: _metadata }, _warehouse_initializers, _warehouse_extraInitializers);
        __esDecorate(null, null, _pickLists_decorators, { kind: "field", name: "pickLists", static: false, private: false, access: { has: obj => "pickLists" in obj, get: obj => obj.pickLists, set: (obj, value) => { obj.pickLists = value; } }, metadata: _metadata }, _pickLists_initializers, _pickLists_extraInitializers);
        __esDecorate(null, null, _orders_decorators, { kind: "field", name: "orders", static: false, private: false, access: { has: obj => "orders" in obj, get: obj => obj.orders, set: (obj, value) => { obj.orders = value; } }, metadata: _metadata }, _orders_initializers, _orders_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WavePick = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WavePick = _classThis;
})();
exports.WavePick = WavePick;
/**
 * Wave order junction table
 */
let WaveOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'wave_orders', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _waveId_decorators;
    let _waveId_initializers = [];
    let _waveId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _sequenceNumber_decorators;
    let _sequenceNumber_initializers = [];
    let _sequenceNumber_extraInitializers = [];
    let _addedToWaveAt_decorators;
    let _addedToWaveAt_initializers = [];
    let _addedToWaveAt_extraInitializers = [];
    let _wave_decorators;
    let _wave_initializers = [];
    let _wave_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    var WaveOrder = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.waveId = __runInitializers(this, _waveId_initializers, void 0);
            this.orderId = (__runInitializers(this, _waveId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.sequenceNumber = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _sequenceNumber_initializers, void 0));
            this.addedToWaveAt = (__runInitializers(this, _sequenceNumber_extraInitializers), __runInitializers(this, _addedToWaveAt_initializers, void 0));
            this.wave = (__runInitializers(this, _addedToWaveAt_extraInitializers), __runInitializers(this, _wave_initializers, void 0));
            this.order = (__runInitializers(this, _wave_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            __runInitializers(this, _order_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WaveOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _waveId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => WavePick), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _orderId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Order), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _sequenceNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _addedToWaveAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _wave_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WavePick)];
        _order_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Order)];
        __esDecorate(null, null, _waveId_decorators, { kind: "field", name: "waveId", static: false, private: false, access: { has: obj => "waveId" in obj, get: obj => obj.waveId, set: (obj, value) => { obj.waveId = value; } }, metadata: _metadata }, _waveId_initializers, _waveId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _sequenceNumber_decorators, { kind: "field", name: "sequenceNumber", static: false, private: false, access: { has: obj => "sequenceNumber" in obj, get: obj => obj.sequenceNumber, set: (obj, value) => { obj.sequenceNumber = value; } }, metadata: _metadata }, _sequenceNumber_initializers, _sequenceNumber_extraInitializers);
        __esDecorate(null, null, _addedToWaveAt_decorators, { kind: "field", name: "addedToWaveAt", static: false, private: false, access: { has: obj => "addedToWaveAt" in obj, get: obj => obj.addedToWaveAt, set: (obj, value) => { obj.addedToWaveAt = value; } }, metadata: _metadata }, _addedToWaveAt_initializers, _addedToWaveAt_extraInitializers);
        __esDecorate(null, null, _wave_decorators, { kind: "field", name: "wave", static: false, private: false, access: { has: obj => "wave" in obj, get: obj => obj.wave, set: (obj, value) => { obj.wave = value; } }, metadata: _metadata }, _wave_initializers, _wave_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaveOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaveOrder = _classThis;
})();
exports.WaveOrder = WaveOrder;
/**
 * Order model (simplified for fulfillment context)
 */
let Order = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'orders', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _orderNumber_decorators;
    let _orderNumber_initializers = [];
    let _orderNumber_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _orderDate_decorators;
    let _orderDate_initializers = [];
    let _orderDate_extraInitializers = [];
    let _requestedDeliveryDate_decorators;
    let _requestedDeliveryDate_initializers = [];
    let _requestedDeliveryDate_extraInitializers = [];
    let _orderLines_decorators;
    let _orderLines_initializers = [];
    let _orderLines_extraInitializers = [];
    let _waves_decorators;
    let _waves_initializers = [];
    let _waves_extraInitializers = [];
    let _shipments_decorators;
    let _shipments_initializers = [];
    let _shipments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Order = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.orderId = __runInitializers(this, _orderId_initializers, void 0);
            this.orderNumber = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _orderNumber_initializers, void 0));
            this.customerId = (__runInitializers(this, _orderNumber_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.status = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.orderDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _orderDate_initializers, void 0));
            this.requestedDeliveryDate = (__runInitializers(this, _orderDate_extraInitializers), __runInitializers(this, _requestedDeliveryDate_initializers, void 0));
            this.orderLines = (__runInitializers(this, _requestedDeliveryDate_extraInitializers), __runInitializers(this, _orderLines_initializers, void 0));
            this.waves = (__runInitializers(this, _orderLines_extraInitializers), __runInitializers(this, _waves_initializers, void 0));
            this.shipments = (__runInitializers(this, _waves_extraInitializers), __runInitializers(this, _shipments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _shipments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Order");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _orderId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _orderNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _customerId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20) }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 1 })];
        _orderDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _requestedDeliveryDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _orderLines_decorators = [(0, sequelize_typescript_1.HasMany)(() => OrderLine)];
        _waves_decorators = [(0, sequelize_typescript_1.BelongsToMany)(() => WavePick, () => WaveOrder)];
        _shipments_decorators = [(0, sequelize_typescript_1.HasMany)(() => Shipment)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _orderNumber_decorators, { kind: "field", name: "orderNumber", static: false, private: false, access: { has: obj => "orderNumber" in obj, get: obj => obj.orderNumber, set: (obj, value) => { obj.orderNumber = value; } }, metadata: _metadata }, _orderNumber_initializers, _orderNumber_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _orderDate_decorators, { kind: "field", name: "orderDate", static: false, private: false, access: { has: obj => "orderDate" in obj, get: obj => obj.orderDate, set: (obj, value) => { obj.orderDate = value; } }, metadata: _metadata }, _orderDate_initializers, _orderDate_extraInitializers);
        __esDecorate(null, null, _requestedDeliveryDate_decorators, { kind: "field", name: "requestedDeliveryDate", static: false, private: false, access: { has: obj => "requestedDeliveryDate" in obj, get: obj => obj.requestedDeliveryDate, set: (obj, value) => { obj.requestedDeliveryDate = value; } }, metadata: _metadata }, _requestedDeliveryDate_initializers, _requestedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _orderLines_decorators, { kind: "field", name: "orderLines", static: false, private: false, access: { has: obj => "orderLines" in obj, get: obj => obj.orderLines, set: (obj, value) => { obj.orderLines = value; } }, metadata: _metadata }, _orderLines_initializers, _orderLines_extraInitializers);
        __esDecorate(null, null, _waves_decorators, { kind: "field", name: "waves", static: false, private: false, access: { has: obj => "waves" in obj, get: obj => obj.waves, set: (obj, value) => { obj.waves = value; } }, metadata: _metadata }, _waves_initializers, _waves_extraInitializers);
        __esDecorate(null, null, _shipments_decorators, { kind: "field", name: "shipments", static: false, private: false, access: { has: obj => "shipments" in obj, get: obj => obj.shipments, set: (obj, value) => { obj.shipments = value; } }, metadata: _metadata }, _shipments_initializers, _shipments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
})();
exports.Order = Order;
/**
 * Order line model
 */
let OrderLine = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'order_lines', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _orderLineId_decorators;
    let _orderLineId_initializers = [];
    let _orderLineId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _lineNumber_decorators;
    let _lineNumber_initializers = [];
    let _lineNumber_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _quantityOrdered_decorators;
    let _quantityOrdered_initializers = [];
    let _quantityOrdered_extraInitializers = [];
    let _quantityPicked_decorators;
    let _quantityPicked_initializers = [];
    let _quantityPicked_extraInitializers = [];
    let _quantityPacked_decorators;
    let _quantityPacked_initializers = [];
    let _quantityPacked_extraInitializers = [];
    let _quantityShipped_decorators;
    let _quantityShipped_initializers = [];
    let _quantityShipped_extraInitializers = [];
    let _unitOfMeasure_decorators;
    let _unitOfMeasure_initializers = [];
    let _unitOfMeasure_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _pickTasks_decorators;
    let _pickTasks_initializers = [];
    let _pickTasks_extraInitializers = [];
    var OrderLine = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.orderLineId = __runInitializers(this, _orderLineId_initializers, void 0);
            this.orderId = (__runInitializers(this, _orderLineId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.lineNumber = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _lineNumber_initializers, void 0));
            this.itemId = (__runInitializers(this, _lineNumber_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
            this.itemNumber = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.quantityOrdered = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _quantityOrdered_initializers, void 0));
            this.quantityPicked = (__runInitializers(this, _quantityOrdered_extraInitializers), __runInitializers(this, _quantityPicked_initializers, void 0));
            this.quantityPacked = (__runInitializers(this, _quantityPicked_extraInitializers), __runInitializers(this, _quantityPacked_initializers, void 0));
            this.quantityShipped = (__runInitializers(this, _quantityPacked_extraInitializers), __runInitializers(this, _quantityShipped_initializers, void 0));
            this.unitOfMeasure = (__runInitializers(this, _quantityShipped_extraInitializers), __runInitializers(this, _unitOfMeasure_initializers, void 0));
            this.location = (__runInitializers(this, _unitOfMeasure_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.order = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.pickTasks = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _pickTasks_initializers, void 0));
            __runInitializers(this, _pickTasks_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrderLine");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _orderLineId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _orderId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Order), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _lineNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _itemId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _itemNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _itemDescription_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _quantityOrdered_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _quantityPicked_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _quantityPacked_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _quantityShipped_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _unitOfMeasure_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20) })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _order_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Order)];
        _pickTasks_decorators = [(0, sequelize_typescript_1.HasMany)(() => PickTask)];
        __esDecorate(null, null, _orderLineId_decorators, { kind: "field", name: "orderLineId", static: false, private: false, access: { has: obj => "orderLineId" in obj, get: obj => obj.orderLineId, set: (obj, value) => { obj.orderLineId = value; } }, metadata: _metadata }, _orderLineId_initializers, _orderLineId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _lineNumber_decorators, { kind: "field", name: "lineNumber", static: false, private: false, access: { has: obj => "lineNumber" in obj, get: obj => obj.lineNumber, set: (obj, value) => { obj.lineNumber = value; } }, metadata: _metadata }, _lineNumber_initializers, _lineNumber_extraInitializers);
        __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
        __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _quantityOrdered_decorators, { kind: "field", name: "quantityOrdered", static: false, private: false, access: { has: obj => "quantityOrdered" in obj, get: obj => obj.quantityOrdered, set: (obj, value) => { obj.quantityOrdered = value; } }, metadata: _metadata }, _quantityOrdered_initializers, _quantityOrdered_extraInitializers);
        __esDecorate(null, null, _quantityPicked_decorators, { kind: "field", name: "quantityPicked", static: false, private: false, access: { has: obj => "quantityPicked" in obj, get: obj => obj.quantityPicked, set: (obj, value) => { obj.quantityPicked = value; } }, metadata: _metadata }, _quantityPicked_initializers, _quantityPicked_extraInitializers);
        __esDecorate(null, null, _quantityPacked_decorators, { kind: "field", name: "quantityPacked", static: false, private: false, access: { has: obj => "quantityPacked" in obj, get: obj => obj.quantityPacked, set: (obj, value) => { obj.quantityPacked = value; } }, metadata: _metadata }, _quantityPacked_initializers, _quantityPacked_extraInitializers);
        __esDecorate(null, null, _quantityShipped_decorators, { kind: "field", name: "quantityShipped", static: false, private: false, access: { has: obj => "quantityShipped" in obj, get: obj => obj.quantityShipped, set: (obj, value) => { obj.quantityShipped = value; } }, metadata: _metadata }, _quantityShipped_initializers, _quantityShipped_extraInitializers);
        __esDecorate(null, null, _unitOfMeasure_decorators, { kind: "field", name: "unitOfMeasure", static: false, private: false, access: { has: obj => "unitOfMeasure" in obj, get: obj => obj.unitOfMeasure, set: (obj, value) => { obj.unitOfMeasure = value; } }, metadata: _metadata }, _unitOfMeasure_initializers, _unitOfMeasure_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _pickTasks_decorators, { kind: "field", name: "pickTasks", static: false, private: false, access: { has: obj => "pickTasks" in obj, get: obj => obj.pickTasks, set: (obj, value) => { obj.pickTasks = value; } }, metadata: _metadata }, _pickTasks_initializers, _pickTasks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderLine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderLine = _classThis;
})();
exports.OrderLine = OrderLine;
/**
 * Pick list model
 */
let PickList = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'pick_lists',
            timestamps: true,
            indexes: [
                { fields: ['pickListNumber'], unique: true },
                { fields: ['waveId', 'status'] },
                { fields: ['assignedTo'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _pickListId_decorators;
    let _pickListId_initializers = [];
    let _pickListId_extraInitializers = [];
    let _pickListNumber_decorators;
    let _pickListNumber_initializers = [];
    let _pickListNumber_extraInitializers = [];
    let _waveId_decorators;
    let _waveId_initializers = [];
    let _waveId_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _pickingStrategy_decorators;
    let _pickingStrategy_initializers = [];
    let _pickingStrategy_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _assignedAt_decorators;
    let _assignedAt_initializers = [];
    let _assignedAt_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _totalTasks_decorators;
    let _totalTasks_initializers = [];
    let _totalTasks_extraInitializers = [];
    let _completedTasks_decorators;
    let _completedTasks_initializers = [];
    let _completedTasks_extraInitializers = [];
    let _completionPercent_decorators;
    let _completionPercent_initializers = [];
    let _completionPercent_extraInitializers = [];
    let _wave_decorators;
    let _wave_initializers = [];
    let _wave_extraInitializers = [];
    let _warehouse_decorators;
    let _warehouse_initializers = [];
    let _warehouse_extraInitializers = [];
    let _pickTasks_decorators;
    let _pickTasks_initializers = [];
    let _pickTasks_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PickList = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pickListId = __runInitializers(this, _pickListId_initializers, void 0);
            this.pickListNumber = (__runInitializers(this, _pickListId_extraInitializers), __runInitializers(this, _pickListNumber_initializers, void 0));
            this.waveId = (__runInitializers(this, _pickListNumber_extraInitializers), __runInitializers(this, _waveId_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _waveId_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.pickingStrategy = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _pickingStrategy_initializers, void 0));
            this.status = (__runInitializers(this, _pickingStrategy_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedToName = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
            this.assignedAt = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _assignedAt_initializers, void 0));
            this.startedAt = (__runInitializers(this, _assignedAt_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.totalTasks = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _totalTasks_initializers, void 0));
            this.completedTasks = (__runInitializers(this, _totalTasks_extraInitializers), __runInitializers(this, _completedTasks_initializers, void 0));
            this.completionPercent = (__runInitializers(this, _completedTasks_extraInitializers), __runInitializers(this, _completionPercent_initializers, void 0));
            this.wave = (__runInitializers(this, _completionPercent_extraInitializers), __runInitializers(this, _wave_initializers, void 0));
            this.warehouse = (__runInitializers(this, _wave_extraInitializers), __runInitializers(this, _warehouse_initializers, void 0));
            this.pickTasks = (__runInitializers(this, _warehouse_extraInitializers), __runInitializers(this, _pickTasks_initializers, void 0));
            this.createdAt = (__runInitializers(this, _pickTasks_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PickList");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pickListId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _pickListNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _waveId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => WavePick), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _warehouseId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Warehouse), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _pickingStrategy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PickingStrategy)), allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PickTaskStatus)), allowNull: false, defaultValue: PickTaskStatus.PENDING }), sequelize_typescript_1.Index];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _assignedToName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _assignedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _startedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _totalTasks_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _completedTasks_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _completionPercent_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _wave_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WavePick)];
        _warehouse_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Warehouse)];
        _pickTasks_decorators = [(0, sequelize_typescript_1.HasMany)(() => PickTask)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _pickListId_decorators, { kind: "field", name: "pickListId", static: false, private: false, access: { has: obj => "pickListId" in obj, get: obj => obj.pickListId, set: (obj, value) => { obj.pickListId = value; } }, metadata: _metadata }, _pickListId_initializers, _pickListId_extraInitializers);
        __esDecorate(null, null, _pickListNumber_decorators, { kind: "field", name: "pickListNumber", static: false, private: false, access: { has: obj => "pickListNumber" in obj, get: obj => obj.pickListNumber, set: (obj, value) => { obj.pickListNumber = value; } }, metadata: _metadata }, _pickListNumber_initializers, _pickListNumber_extraInitializers);
        __esDecorate(null, null, _waveId_decorators, { kind: "field", name: "waveId", static: false, private: false, access: { has: obj => "waveId" in obj, get: obj => obj.waveId, set: (obj, value) => { obj.waveId = value; } }, metadata: _metadata }, _waveId_initializers, _waveId_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _pickingStrategy_decorators, { kind: "field", name: "pickingStrategy", static: false, private: false, access: { has: obj => "pickingStrategy" in obj, get: obj => obj.pickingStrategy, set: (obj, value) => { obj.pickingStrategy = value; } }, metadata: _metadata }, _pickingStrategy_initializers, _pickingStrategy_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
        __esDecorate(null, null, _assignedAt_decorators, { kind: "field", name: "assignedAt", static: false, private: false, access: { has: obj => "assignedAt" in obj, get: obj => obj.assignedAt, set: (obj, value) => { obj.assignedAt = value; } }, metadata: _metadata }, _assignedAt_initializers, _assignedAt_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _totalTasks_decorators, { kind: "field", name: "totalTasks", static: false, private: false, access: { has: obj => "totalTasks" in obj, get: obj => obj.totalTasks, set: (obj, value) => { obj.totalTasks = value; } }, metadata: _metadata }, _totalTasks_initializers, _totalTasks_extraInitializers);
        __esDecorate(null, null, _completedTasks_decorators, { kind: "field", name: "completedTasks", static: false, private: false, access: { has: obj => "completedTasks" in obj, get: obj => obj.completedTasks, set: (obj, value) => { obj.completedTasks = value; } }, metadata: _metadata }, _completedTasks_initializers, _completedTasks_extraInitializers);
        __esDecorate(null, null, _completionPercent_decorators, { kind: "field", name: "completionPercent", static: false, private: false, access: { has: obj => "completionPercent" in obj, get: obj => obj.completionPercent, set: (obj, value) => { obj.completionPercent = value; } }, metadata: _metadata }, _completionPercent_initializers, _completionPercent_extraInitializers);
        __esDecorate(null, null, _wave_decorators, { kind: "field", name: "wave", static: false, private: false, access: { has: obj => "wave" in obj, get: obj => obj.wave, set: (obj, value) => { obj.wave = value; } }, metadata: _metadata }, _wave_initializers, _wave_extraInitializers);
        __esDecorate(null, null, _warehouse_decorators, { kind: "field", name: "warehouse", static: false, private: false, access: { has: obj => "warehouse" in obj, get: obj => obj.warehouse, set: (obj, value) => { obj.warehouse = value; } }, metadata: _metadata }, _warehouse_initializers, _warehouse_extraInitializers);
        __esDecorate(null, null, _pickTasks_decorators, { kind: "field", name: "pickTasks", static: false, private: false, access: { has: obj => "pickTasks" in obj, get: obj => obj.pickTasks, set: (obj, value) => { obj.pickTasks = value; } }, metadata: _metadata }, _pickTasks_initializers, _pickTasks_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PickList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PickList = _classThis;
})();
exports.PickList = PickList;
/**
 * Pick task model
 */
let PickTask = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'pick_tasks',
            timestamps: true,
            indexes: [
                { fields: ['pickListId', 'sequenceNumber'] },
                { fields: ['orderLineId'] },
                { fields: ['status'] },
                { fields: ['location'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _pickTaskId_decorators;
    let _pickTaskId_initializers = [];
    let _pickTaskId_extraInitializers = [];
    let _pickListId_decorators;
    let _pickListId_initializers = [];
    let _pickListId_extraInitializers = [];
    let _orderLineId_decorators;
    let _orderLineId_initializers = [];
    let _orderLineId_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    let _sequenceNumber_decorators;
    let _sequenceNumber_initializers = [];
    let _sequenceNumber_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _quantityToPick_decorators;
    let _quantityToPick_initializers = [];
    let _quantityToPick_extraInitializers = [];
    let _quantityPicked_decorators;
    let _quantityPicked_initializers = [];
    let _quantityPicked_extraInitializers = [];
    let _quantityShort_decorators;
    let _quantityShort_initializers = [];
    let _quantityShort_extraInitializers = [];
    let _unitOfMeasure_decorators;
    let _unitOfMeasure_initializers = [];
    let _unitOfMeasure_extraInitializers = [];
    let _lotNumber_decorators;
    let _lotNumber_initializers = [];
    let _lotNumber_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _pickedAt_decorators;
    let _pickedAt_initializers = [];
    let _pickedAt_extraInitializers = [];
    let _pickedBy_decorators;
    let _pickedBy_initializers = [];
    let _pickedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _pickList_decorators;
    let _pickList_initializers = [];
    let _pickList_extraInitializers = [];
    let _orderLine_decorators;
    let _orderLine_initializers = [];
    let _orderLine_extraInitializers = [];
    let _warehouse_decorators;
    let _warehouse_initializers = [];
    let _warehouse_extraInitializers = [];
    let _zone_decorators;
    let _zone_initializers = [];
    let _zone_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PickTask = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pickTaskId = __runInitializers(this, _pickTaskId_initializers, void 0);
            this.pickListId = (__runInitializers(this, _pickTaskId_extraInitializers), __runInitializers(this, _pickListId_initializers, void 0));
            this.orderLineId = (__runInitializers(this, _pickListId_extraInitializers), __runInitializers(this, _orderLineId_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _orderLineId_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.zoneId = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _zoneId_initializers, void 0));
            this.sequenceNumber = (__runInitializers(this, _zoneId_extraInitializers), __runInitializers(this, _sequenceNumber_initializers, void 0));
            this.itemId = (__runInitializers(this, _sequenceNumber_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
            this.itemNumber = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.location = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.quantityToPick = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _quantityToPick_initializers, void 0));
            this.quantityPicked = (__runInitializers(this, _quantityToPick_extraInitializers), __runInitializers(this, _quantityPicked_initializers, void 0));
            this.quantityShort = (__runInitializers(this, _quantityPicked_extraInitializers), __runInitializers(this, _quantityShort_initializers, void 0));
            this.unitOfMeasure = (__runInitializers(this, _quantityShort_extraInitializers), __runInitializers(this, _unitOfMeasure_initializers, void 0));
            this.lotNumber = (__runInitializers(this, _unitOfMeasure_extraInitializers), __runInitializers(this, _lotNumber_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _lotNumber_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.status = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.pickedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _pickedAt_initializers, void 0));
            this.pickedBy = (__runInitializers(this, _pickedAt_extraInitializers), __runInitializers(this, _pickedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _pickedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.pickList = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _pickList_initializers, void 0));
            this.orderLine = (__runInitializers(this, _pickList_extraInitializers), __runInitializers(this, _orderLine_initializers, void 0));
            this.warehouse = (__runInitializers(this, _orderLine_extraInitializers), __runInitializers(this, _warehouse_initializers, void 0));
            this.zone = (__runInitializers(this, _warehouse_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
            this.createdAt = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PickTask");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pickTaskId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _pickListId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PickList), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _orderLineId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => OrderLine), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _warehouseId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Warehouse), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _zoneId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => WarehouseZone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _sequenceNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _itemId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _itemNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _itemDescription_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _quantityToPick_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _quantityPicked_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _quantityShort_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _unitOfMeasure_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20) })];
        _lotNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _serialNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PickTaskStatus)), allowNull: false, defaultValue: PickTaskStatus.PENDING }), sequelize_typescript_1.Index];
        _pickedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _pickedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _pickList_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PickList)];
        _orderLine_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => OrderLine)];
        _warehouse_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Warehouse)];
        _zone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WarehouseZone)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _pickTaskId_decorators, { kind: "field", name: "pickTaskId", static: false, private: false, access: { has: obj => "pickTaskId" in obj, get: obj => obj.pickTaskId, set: (obj, value) => { obj.pickTaskId = value; } }, metadata: _metadata }, _pickTaskId_initializers, _pickTaskId_extraInitializers);
        __esDecorate(null, null, _pickListId_decorators, { kind: "field", name: "pickListId", static: false, private: false, access: { has: obj => "pickListId" in obj, get: obj => obj.pickListId, set: (obj, value) => { obj.pickListId = value; } }, metadata: _metadata }, _pickListId_initializers, _pickListId_extraInitializers);
        __esDecorate(null, null, _orderLineId_decorators, { kind: "field", name: "orderLineId", static: false, private: false, access: { has: obj => "orderLineId" in obj, get: obj => obj.orderLineId, set: (obj, value) => { obj.orderLineId = value; } }, metadata: _metadata }, _orderLineId_initializers, _orderLineId_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
        __esDecorate(null, null, _sequenceNumber_decorators, { kind: "field", name: "sequenceNumber", static: false, private: false, access: { has: obj => "sequenceNumber" in obj, get: obj => obj.sequenceNumber, set: (obj, value) => { obj.sequenceNumber = value; } }, metadata: _metadata }, _sequenceNumber_initializers, _sequenceNumber_extraInitializers);
        __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
        __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _quantityToPick_decorators, { kind: "field", name: "quantityToPick", static: false, private: false, access: { has: obj => "quantityToPick" in obj, get: obj => obj.quantityToPick, set: (obj, value) => { obj.quantityToPick = value; } }, metadata: _metadata }, _quantityToPick_initializers, _quantityToPick_extraInitializers);
        __esDecorate(null, null, _quantityPicked_decorators, { kind: "field", name: "quantityPicked", static: false, private: false, access: { has: obj => "quantityPicked" in obj, get: obj => obj.quantityPicked, set: (obj, value) => { obj.quantityPicked = value; } }, metadata: _metadata }, _quantityPicked_initializers, _quantityPicked_extraInitializers);
        __esDecorate(null, null, _quantityShort_decorators, { kind: "field", name: "quantityShort", static: false, private: false, access: { has: obj => "quantityShort" in obj, get: obj => obj.quantityShort, set: (obj, value) => { obj.quantityShort = value; } }, metadata: _metadata }, _quantityShort_initializers, _quantityShort_extraInitializers);
        __esDecorate(null, null, _unitOfMeasure_decorators, { kind: "field", name: "unitOfMeasure", static: false, private: false, access: { has: obj => "unitOfMeasure" in obj, get: obj => obj.unitOfMeasure, set: (obj, value) => { obj.unitOfMeasure = value; } }, metadata: _metadata }, _unitOfMeasure_initializers, _unitOfMeasure_extraInitializers);
        __esDecorate(null, null, _lotNumber_decorators, { kind: "field", name: "lotNumber", static: false, private: false, access: { has: obj => "lotNumber" in obj, get: obj => obj.lotNumber, set: (obj, value) => { obj.lotNumber = value; } }, metadata: _metadata }, _lotNumber_initializers, _lotNumber_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _pickedAt_decorators, { kind: "field", name: "pickedAt", static: false, private: false, access: { has: obj => "pickedAt" in obj, get: obj => obj.pickedAt, set: (obj, value) => { obj.pickedAt = value; } }, metadata: _metadata }, _pickedAt_initializers, _pickedAt_extraInitializers);
        __esDecorate(null, null, _pickedBy_decorators, { kind: "field", name: "pickedBy", static: false, private: false, access: { has: obj => "pickedBy" in obj, get: obj => obj.pickedBy, set: (obj, value) => { obj.pickedBy = value; } }, metadata: _metadata }, _pickedBy_initializers, _pickedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _pickList_decorators, { kind: "field", name: "pickList", static: false, private: false, access: { has: obj => "pickList" in obj, get: obj => obj.pickList, set: (obj, value) => { obj.pickList = value; } }, metadata: _metadata }, _pickList_initializers, _pickList_extraInitializers);
        __esDecorate(null, null, _orderLine_decorators, { kind: "field", name: "orderLine", static: false, private: false, access: { has: obj => "orderLine" in obj, get: obj => obj.orderLine, set: (obj, value) => { obj.orderLine = value; } }, metadata: _metadata }, _orderLine_initializers, _orderLine_extraInitializers);
        __esDecorate(null, null, _warehouse_decorators, { kind: "field", name: "warehouse", static: false, private: false, access: { has: obj => "warehouse" in obj, get: obj => obj.warehouse, set: (obj, value) => { obj.warehouse = value; } }, metadata: _metadata }, _warehouse_initializers, _warehouse_extraInitializers);
        __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: obj => "zone" in obj, get: obj => obj.zone, set: (obj, value) => { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PickTask = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PickTask = _classThis;
})();
exports.PickTask = PickTask;
/**
 * Carton model
 */
let Carton = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'cartons', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _cartonId_decorators;
    let _cartonId_initializers = [];
    let _cartonId_extraInitializers = [];
    let _shipmentId_decorators;
    let _shipmentId_initializers = [];
    let _shipmentId_extraInitializers = [];
    let _cartonNumber_decorators;
    let _cartonNumber_initializers = [];
    let _cartonNumber_extraInitializers = [];
    let _cartonType_decorators;
    let _cartonType_initializers = [];
    let _cartonType_extraInitializers = [];
    let _length_decorators;
    let _length_initializers = [];
    let _length_extraInitializers = [];
    let _width_decorators;
    let _width_initializers = [];
    let _width_extraInitializers = [];
    let _height_decorators;
    let _height_initializers = [];
    let _height_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _tareWeight_decorators;
    let _tareWeight_initializers = [];
    let _tareWeight_extraInitializers = [];
    let _trackingNumber_decorators;
    let _trackingNumber_initializers = [];
    let _trackingNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _packedBy_decorators;
    let _packedBy_initializers = [];
    let _packedBy_extraInitializers = [];
    let _packedAt_decorators;
    let _packedAt_initializers = [];
    let _packedAt_extraInitializers = [];
    let _shipment_decorators;
    let _shipment_initializers = [];
    let _shipment_extraInitializers = [];
    let _contents_decorators;
    let _contents_initializers = [];
    let _contents_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Carton = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.cartonId = __runInitializers(this, _cartonId_initializers, void 0);
            this.shipmentId = (__runInitializers(this, _cartonId_extraInitializers), __runInitializers(this, _shipmentId_initializers, void 0));
            this.cartonNumber = (__runInitializers(this, _shipmentId_extraInitializers), __runInitializers(this, _cartonNumber_initializers, void 0));
            this.cartonType = (__runInitializers(this, _cartonNumber_extraInitializers), __runInitializers(this, _cartonType_initializers, void 0));
            this.length = (__runInitializers(this, _cartonType_extraInitializers), __runInitializers(this, _length_initializers, void 0));
            this.width = (__runInitializers(this, _length_extraInitializers), __runInitializers(this, _width_initializers, void 0));
            this.height = (__runInitializers(this, _width_extraInitializers), __runInitializers(this, _height_initializers, void 0));
            this.weight = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.tareWeight = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _tareWeight_initializers, void 0));
            this.trackingNumber = (__runInitializers(this, _tareWeight_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
            this.status = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.packedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _packedBy_initializers, void 0));
            this.packedAt = (__runInitializers(this, _packedBy_extraInitializers), __runInitializers(this, _packedAt_initializers, void 0));
            this.shipment = (__runInitializers(this, _packedAt_extraInitializers), __runInitializers(this, _shipment_initializers, void 0));
            this.contents = (__runInitializers(this, _shipment_extraInitializers), __runInitializers(this, _contents_initializers, void 0));
            this.createdAt = (__runInitializers(this, _contents_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Carton");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _cartonId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _shipmentId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Shipment), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _cartonNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _cartonType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _length_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _width_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _height_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _weight_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _tareWeight_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _trackingNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PackingStatus)), defaultValue: PackingStatus.PENDING })];
        _packedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _packedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _shipment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Shipment)];
        _contents_decorators = [(0, sequelize_typescript_1.HasMany)(() => CartonContent)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _cartonId_decorators, { kind: "field", name: "cartonId", static: false, private: false, access: { has: obj => "cartonId" in obj, get: obj => obj.cartonId, set: (obj, value) => { obj.cartonId = value; } }, metadata: _metadata }, _cartonId_initializers, _cartonId_extraInitializers);
        __esDecorate(null, null, _shipmentId_decorators, { kind: "field", name: "shipmentId", static: false, private: false, access: { has: obj => "shipmentId" in obj, get: obj => obj.shipmentId, set: (obj, value) => { obj.shipmentId = value; } }, metadata: _metadata }, _shipmentId_initializers, _shipmentId_extraInitializers);
        __esDecorate(null, null, _cartonNumber_decorators, { kind: "field", name: "cartonNumber", static: false, private: false, access: { has: obj => "cartonNumber" in obj, get: obj => obj.cartonNumber, set: (obj, value) => { obj.cartonNumber = value; } }, metadata: _metadata }, _cartonNumber_initializers, _cartonNumber_extraInitializers);
        __esDecorate(null, null, _cartonType_decorators, { kind: "field", name: "cartonType", static: false, private: false, access: { has: obj => "cartonType" in obj, get: obj => obj.cartonType, set: (obj, value) => { obj.cartonType = value; } }, metadata: _metadata }, _cartonType_initializers, _cartonType_extraInitializers);
        __esDecorate(null, null, _length_decorators, { kind: "field", name: "length", static: false, private: false, access: { has: obj => "length" in obj, get: obj => obj.length, set: (obj, value) => { obj.length = value; } }, metadata: _metadata }, _length_initializers, _length_extraInitializers);
        __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width, set: (obj, value) => { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
        __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height, set: (obj, value) => { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _tareWeight_decorators, { kind: "field", name: "tareWeight", static: false, private: false, access: { has: obj => "tareWeight" in obj, get: obj => obj.tareWeight, set: (obj, value) => { obj.tareWeight = value; } }, metadata: _metadata }, _tareWeight_initializers, _tareWeight_extraInitializers);
        __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: obj => "trackingNumber" in obj, get: obj => obj.trackingNumber, set: (obj, value) => { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _packedBy_decorators, { kind: "field", name: "packedBy", static: false, private: false, access: { has: obj => "packedBy" in obj, get: obj => obj.packedBy, set: (obj, value) => { obj.packedBy = value; } }, metadata: _metadata }, _packedBy_initializers, _packedBy_extraInitializers);
        __esDecorate(null, null, _packedAt_decorators, { kind: "field", name: "packedAt", static: false, private: false, access: { has: obj => "packedAt" in obj, get: obj => obj.packedAt, set: (obj, value) => { obj.packedAt = value; } }, metadata: _metadata }, _packedAt_initializers, _packedAt_extraInitializers);
        __esDecorate(null, null, _shipment_decorators, { kind: "field", name: "shipment", static: false, private: false, access: { has: obj => "shipment" in obj, get: obj => obj.shipment, set: (obj, value) => { obj.shipment = value; } }, metadata: _metadata }, _shipment_initializers, _shipment_extraInitializers);
        __esDecorate(null, null, _contents_decorators, { kind: "field", name: "contents", static: false, private: false, access: { has: obj => "contents" in obj, get: obj => obj.contents, set: (obj, value) => { obj.contents = value; } }, metadata: _metadata }, _contents_initializers, _contents_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Carton = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Carton = _classThis;
})();
exports.Carton = Carton;
/**
 * Carton content model
 */
let CartonContent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'carton_contents', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _cartonContentId_decorators;
    let _cartonContentId_initializers = [];
    let _cartonContentId_extraInitializers = [];
    let _cartonId_decorators;
    let _cartonId_initializers = [];
    let _cartonId_extraInitializers = [];
    let _pickTaskId_decorators;
    let _pickTaskId_initializers = [];
    let _pickTaskId_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _lotNumber_decorators;
    let _lotNumber_initializers = [];
    let _lotNumber_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _carton_decorators;
    let _carton_initializers = [];
    let _carton_extraInitializers = [];
    let _pickTask_decorators;
    let _pickTask_initializers = [];
    let _pickTask_extraInitializers = [];
    var CartonContent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.cartonContentId = __runInitializers(this, _cartonContentId_initializers, void 0);
            this.cartonId = (__runInitializers(this, _cartonContentId_extraInitializers), __runInitializers(this, _cartonId_initializers, void 0));
            this.pickTaskId = (__runInitializers(this, _cartonId_extraInitializers), __runInitializers(this, _pickTaskId_initializers, void 0));
            this.itemId = (__runInitializers(this, _pickTaskId_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
            this.itemNumber = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
            this.quantity = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.lotNumber = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _lotNumber_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _lotNumber_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.carton = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _carton_initializers, void 0));
            this.pickTask = (__runInitializers(this, _carton_extraInitializers), __runInitializers(this, _pickTask_initializers, void 0));
            __runInitializers(this, _pickTask_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CartonContent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _cartonContentId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _cartonId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Carton), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _pickTaskId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PickTask), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _itemId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _itemNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _quantity_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _lotNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _serialNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _carton_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Carton)];
        _pickTask_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PickTask)];
        __esDecorate(null, null, _cartonContentId_decorators, { kind: "field", name: "cartonContentId", static: false, private: false, access: { has: obj => "cartonContentId" in obj, get: obj => obj.cartonContentId, set: (obj, value) => { obj.cartonContentId = value; } }, metadata: _metadata }, _cartonContentId_initializers, _cartonContentId_extraInitializers);
        __esDecorate(null, null, _cartonId_decorators, { kind: "field", name: "cartonId", static: false, private: false, access: { has: obj => "cartonId" in obj, get: obj => obj.cartonId, set: (obj, value) => { obj.cartonId = value; } }, metadata: _metadata }, _cartonId_initializers, _cartonId_extraInitializers);
        __esDecorate(null, null, _pickTaskId_decorators, { kind: "field", name: "pickTaskId", static: false, private: false, access: { has: obj => "pickTaskId" in obj, get: obj => obj.pickTaskId, set: (obj, value) => { obj.pickTaskId = value; } }, metadata: _metadata }, _pickTaskId_initializers, _pickTaskId_extraInitializers);
        __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
        __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _lotNumber_decorators, { kind: "field", name: "lotNumber", static: false, private: false, access: { has: obj => "lotNumber" in obj, get: obj => obj.lotNumber, set: (obj, value) => { obj.lotNumber = value; } }, metadata: _metadata }, _lotNumber_initializers, _lotNumber_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _carton_decorators, { kind: "field", name: "carton", static: false, private: false, access: { has: obj => "carton" in obj, get: obj => obj.carton, set: (obj, value) => { obj.carton = value; } }, metadata: _metadata }, _carton_initializers, _carton_extraInitializers);
        __esDecorate(null, null, _pickTask_decorators, { kind: "field", name: "pickTask", static: false, private: false, access: { has: obj => "pickTask" in obj, get: obj => obj.pickTask, set: (obj, value) => { obj.pickTask = value; } }, metadata: _metadata }, _pickTask_initializers, _pickTask_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartonContent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartonContent = _classThis;
})();
exports.CartonContent = CartonContent;
/**
 * Shipment model
 */
let Shipment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'shipments',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['shipmentNumber'], unique: true },
                { fields: ['orderId'] },
                { fields: ['status'] },
                { fields: ['trackingNumber'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _shipmentId_decorators;
    let _shipmentId_initializers = [];
    let _shipmentId_extraInitializers = [];
    let _shipmentNumber_decorators;
    let _shipmentNumber_initializers = [];
    let _shipmentNumber_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _trackingNumber_decorators;
    let _trackingNumber_initializers = [];
    let _trackingNumber_extraInitializers = [];
    let _carrier_decorators;
    let _carrier_initializers = [];
    let _carrier_extraInitializers = [];
    let _serviceLevel_decorators;
    let _serviceLevel_initializers = [];
    let _serviceLevel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalWeight_decorators;
    let _totalWeight_initializers = [];
    let _totalWeight_extraInitializers = [];
    let _totalCartons_decorators;
    let _totalCartons_initializers = [];
    let _totalCartons_extraInitializers = [];
    let _shippingCost_decorators;
    let _shippingCost_initializers = [];
    let _shippingCost_extraInitializers = [];
    let _shipDate_decorators;
    let _shipDate_initializers = [];
    let _shipDate_extraInitializers = [];
    let _estimatedDeliveryDate_decorators;
    let _estimatedDeliveryDate_initializers = [];
    let _estimatedDeliveryDate_extraInitializers = [];
    let _actualDeliveryDate_decorators;
    let _actualDeliveryDate_initializers = [];
    let _actualDeliveryDate_extraInitializers = [];
    let _shippedBy_decorators;
    let _shippedBy_initializers = [];
    let _shippedBy_extraInitializers = [];
    let _shippingLabel_decorators;
    let _shippingLabel_initializers = [];
    let _shippingLabel_extraInitializers = [];
    let _packingSlip_decorators;
    let _packingSlip_initializers = [];
    let _packingSlip_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _cartons_decorators;
    let _cartons_initializers = [];
    let _cartons_extraInitializers = [];
    let _qualityChecks_decorators;
    let _qualityChecks_initializers = [];
    let _qualityChecks_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Shipment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.shipmentId = __runInitializers(this, _shipmentId_initializers, void 0);
            this.shipmentNumber = (__runInitializers(this, _shipmentId_extraInitializers), __runInitializers(this, _shipmentNumber_initializers, void 0));
            this.orderId = (__runInitializers(this, _shipmentNumber_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.trackingNumber = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
            this.carrier = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _carrier_initializers, void 0));
            this.serviceLevel = (__runInitializers(this, _carrier_extraInitializers), __runInitializers(this, _serviceLevel_initializers, void 0));
            this.status = (__runInitializers(this, _serviceLevel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.totalWeight = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalWeight_initializers, void 0));
            this.totalCartons = (__runInitializers(this, _totalWeight_extraInitializers), __runInitializers(this, _totalCartons_initializers, void 0));
            this.shippingCost = (__runInitializers(this, _totalCartons_extraInitializers), __runInitializers(this, _shippingCost_initializers, void 0));
            this.shipDate = (__runInitializers(this, _shippingCost_extraInitializers), __runInitializers(this, _shipDate_initializers, void 0));
            this.estimatedDeliveryDate = (__runInitializers(this, _shipDate_extraInitializers), __runInitializers(this, _estimatedDeliveryDate_initializers, void 0));
            this.actualDeliveryDate = (__runInitializers(this, _estimatedDeliveryDate_extraInitializers), __runInitializers(this, _actualDeliveryDate_initializers, void 0));
            this.shippedBy = (__runInitializers(this, _actualDeliveryDate_extraInitializers), __runInitializers(this, _shippedBy_initializers, void 0));
            this.shippingLabel = (__runInitializers(this, _shippedBy_extraInitializers), __runInitializers(this, _shippingLabel_initializers, void 0));
            this.packingSlip = (__runInitializers(this, _shippingLabel_extraInitializers), __runInitializers(this, _packingSlip_initializers, void 0));
            this.order = (__runInitializers(this, _packingSlip_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.cartons = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _cartons_initializers, void 0));
            this.qualityChecks = (__runInitializers(this, _cartons_extraInitializers), __runInitializers(this, _qualityChecks_initializers, void 0));
            this.createdAt = (__runInitializers(this, _qualityChecks_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Shipment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _shipmentId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _shipmentNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _orderId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Order), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _warehouseId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _trackingNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }), sequelize_typescript_1.Index];
        _carrier_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _serviceLevel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ShipmentStatus)), defaultValue: ShipmentStatus.PENDING }), sequelize_typescript_1.Index];
        _totalWeight_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _totalCartons_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _shippingCost_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _shipDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _estimatedDeliveryDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualDeliveryDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _shippedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _shippingLabel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _packingSlip_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _order_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Order)];
        _cartons_decorators = [(0, sequelize_typescript_1.HasMany)(() => Carton)];
        _qualityChecks_decorators = [(0, sequelize_typescript_1.HasMany)(() => QualityCheck)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _shipmentId_decorators, { kind: "field", name: "shipmentId", static: false, private: false, access: { has: obj => "shipmentId" in obj, get: obj => obj.shipmentId, set: (obj, value) => { obj.shipmentId = value; } }, metadata: _metadata }, _shipmentId_initializers, _shipmentId_extraInitializers);
        __esDecorate(null, null, _shipmentNumber_decorators, { kind: "field", name: "shipmentNumber", static: false, private: false, access: { has: obj => "shipmentNumber" in obj, get: obj => obj.shipmentNumber, set: (obj, value) => { obj.shipmentNumber = value; } }, metadata: _metadata }, _shipmentNumber_initializers, _shipmentNumber_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: obj => "trackingNumber" in obj, get: obj => obj.trackingNumber, set: (obj, value) => { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
        __esDecorate(null, null, _carrier_decorators, { kind: "field", name: "carrier", static: false, private: false, access: { has: obj => "carrier" in obj, get: obj => obj.carrier, set: (obj, value) => { obj.carrier = value; } }, metadata: _metadata }, _carrier_initializers, _carrier_extraInitializers);
        __esDecorate(null, null, _serviceLevel_decorators, { kind: "field", name: "serviceLevel", static: false, private: false, access: { has: obj => "serviceLevel" in obj, get: obj => obj.serviceLevel, set: (obj, value) => { obj.serviceLevel = value; } }, metadata: _metadata }, _serviceLevel_initializers, _serviceLevel_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _totalWeight_decorators, { kind: "field", name: "totalWeight", static: false, private: false, access: { has: obj => "totalWeight" in obj, get: obj => obj.totalWeight, set: (obj, value) => { obj.totalWeight = value; } }, metadata: _metadata }, _totalWeight_initializers, _totalWeight_extraInitializers);
        __esDecorate(null, null, _totalCartons_decorators, { kind: "field", name: "totalCartons", static: false, private: false, access: { has: obj => "totalCartons" in obj, get: obj => obj.totalCartons, set: (obj, value) => { obj.totalCartons = value; } }, metadata: _metadata }, _totalCartons_initializers, _totalCartons_extraInitializers);
        __esDecorate(null, null, _shippingCost_decorators, { kind: "field", name: "shippingCost", static: false, private: false, access: { has: obj => "shippingCost" in obj, get: obj => obj.shippingCost, set: (obj, value) => { obj.shippingCost = value; } }, metadata: _metadata }, _shippingCost_initializers, _shippingCost_extraInitializers);
        __esDecorate(null, null, _shipDate_decorators, { kind: "field", name: "shipDate", static: false, private: false, access: { has: obj => "shipDate" in obj, get: obj => obj.shipDate, set: (obj, value) => { obj.shipDate = value; } }, metadata: _metadata }, _shipDate_initializers, _shipDate_extraInitializers);
        __esDecorate(null, null, _estimatedDeliveryDate_decorators, { kind: "field", name: "estimatedDeliveryDate", static: false, private: false, access: { has: obj => "estimatedDeliveryDate" in obj, get: obj => obj.estimatedDeliveryDate, set: (obj, value) => { obj.estimatedDeliveryDate = value; } }, metadata: _metadata }, _estimatedDeliveryDate_initializers, _estimatedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _actualDeliveryDate_decorators, { kind: "field", name: "actualDeliveryDate", static: false, private: false, access: { has: obj => "actualDeliveryDate" in obj, get: obj => obj.actualDeliveryDate, set: (obj, value) => { obj.actualDeliveryDate = value; } }, metadata: _metadata }, _actualDeliveryDate_initializers, _actualDeliveryDate_extraInitializers);
        __esDecorate(null, null, _shippedBy_decorators, { kind: "field", name: "shippedBy", static: false, private: false, access: { has: obj => "shippedBy" in obj, get: obj => obj.shippedBy, set: (obj, value) => { obj.shippedBy = value; } }, metadata: _metadata }, _shippedBy_initializers, _shippedBy_extraInitializers);
        __esDecorate(null, null, _shippingLabel_decorators, { kind: "field", name: "shippingLabel", static: false, private: false, access: { has: obj => "shippingLabel" in obj, get: obj => obj.shippingLabel, set: (obj, value) => { obj.shippingLabel = value; } }, metadata: _metadata }, _shippingLabel_initializers, _shippingLabel_extraInitializers);
        __esDecorate(null, null, _packingSlip_decorators, { kind: "field", name: "packingSlip", static: false, private: false, access: { has: obj => "packingSlip" in obj, get: obj => obj.packingSlip, set: (obj, value) => { obj.packingSlip = value; } }, metadata: _metadata }, _packingSlip_initializers, _packingSlip_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _cartons_decorators, { kind: "field", name: "cartons", static: false, private: false, access: { has: obj => "cartons" in obj, get: obj => obj.cartons, set: (obj, value) => { obj.cartons = value; } }, metadata: _metadata }, _cartons_initializers, _cartons_extraInitializers);
        __esDecorate(null, null, _qualityChecks_decorators, { kind: "field", name: "qualityChecks", static: false, private: false, access: { has: obj => "qualityChecks" in obj, get: obj => obj.qualityChecks, set: (obj, value) => { obj.qualityChecks = value; } }, metadata: _metadata }, _qualityChecks_initializers, _qualityChecks_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Shipment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Shipment = _classThis;
})();
exports.Shipment = Shipment;
/**
 * Quality check model
 */
let QualityCheck = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'quality_checks', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _qualityCheckId_decorators;
    let _qualityCheckId_initializers = [];
    let _qualityCheckId_extraInitializers = [];
    let _shipmentId_decorators;
    let _shipmentId_initializers = [];
    let _shipmentId_extraInitializers = [];
    let _pickTaskId_decorators;
    let _pickTaskId_initializers = [];
    let _pickTaskId_extraInitializers = [];
    let _checkType_decorators;
    let _checkType_initializers = [];
    let _checkType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _isMandatory_decorators;
    let _isMandatory_initializers = [];
    let _isMandatory_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _performedAt_decorators;
    let _performedAt_initializers = [];
    let _performedAt_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _shipment_decorators;
    let _shipment_initializers = [];
    let _shipment_extraInitializers = [];
    let _pickTask_decorators;
    let _pickTask_initializers = [];
    let _pickTask_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var QualityCheck = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.qualityCheckId = __runInitializers(this, _qualityCheckId_initializers, void 0);
            this.shipmentId = (__runInitializers(this, _qualityCheckId_extraInitializers), __runInitializers(this, _shipmentId_initializers, void 0));
            this.pickTaskId = (__runInitializers(this, _shipmentId_extraInitializers), __runInitializers(this, _pickTaskId_initializers, void 0));
            this.checkType = (__runInitializers(this, _pickTaskId_extraInitializers), __runInitializers(this, _checkType_initializers, void 0));
            this.status = (__runInitializers(this, _checkType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.isMandatory = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _isMandatory_initializers, void 0));
            this.performedBy = (__runInitializers(this, _isMandatory_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.performedAt = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _performedAt_initializers, void 0));
            this.findings = (__runInitializers(this, _performedAt_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.notes = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.shipment = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _shipment_initializers, void 0));
            this.pickTask = (__runInitializers(this, _shipment_extraInitializers), __runInitializers(this, _pickTask_initializers, void 0));
            this.createdAt = (__runInitializers(this, _pickTask_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "QualityCheck");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _qualityCheckId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _shipmentId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Shipment), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _pickTaskId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PickTask), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _checkType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(QualityCheckStatus)), defaultValue: QualityCheckStatus.PENDING })];
        _isMandatory_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _performedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _performedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _findings_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _shipment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Shipment)];
        _pickTask_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PickTask)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _qualityCheckId_decorators, { kind: "field", name: "qualityCheckId", static: false, private: false, access: { has: obj => "qualityCheckId" in obj, get: obj => obj.qualityCheckId, set: (obj, value) => { obj.qualityCheckId = value; } }, metadata: _metadata }, _qualityCheckId_initializers, _qualityCheckId_extraInitializers);
        __esDecorate(null, null, _shipmentId_decorators, { kind: "field", name: "shipmentId", static: false, private: false, access: { has: obj => "shipmentId" in obj, get: obj => obj.shipmentId, set: (obj, value) => { obj.shipmentId = value; } }, metadata: _metadata }, _shipmentId_initializers, _shipmentId_extraInitializers);
        __esDecorate(null, null, _pickTaskId_decorators, { kind: "field", name: "pickTaskId", static: false, private: false, access: { has: obj => "pickTaskId" in obj, get: obj => obj.pickTaskId, set: (obj, value) => { obj.pickTaskId = value; } }, metadata: _metadata }, _pickTaskId_initializers, _pickTaskId_extraInitializers);
        __esDecorate(null, null, _checkType_decorators, { kind: "field", name: "checkType", static: false, private: false, access: { has: obj => "checkType" in obj, get: obj => obj.checkType, set: (obj, value) => { obj.checkType = value; } }, metadata: _metadata }, _checkType_initializers, _checkType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _isMandatory_decorators, { kind: "field", name: "isMandatory", static: false, private: false, access: { has: obj => "isMandatory" in obj, get: obj => obj.isMandatory, set: (obj, value) => { obj.isMandatory = value; } }, metadata: _metadata }, _isMandatory_initializers, _isMandatory_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _performedAt_decorators, { kind: "field", name: "performedAt", static: false, private: false, access: { has: obj => "performedAt" in obj, get: obj => obj.performedAt, set: (obj, value) => { obj.performedAt = value; } }, metadata: _metadata }, _performedAt_initializers, _performedAt_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _shipment_decorators, { kind: "field", name: "shipment", static: false, private: false, access: { has: obj => "shipment" in obj, get: obj => obj.shipment, set: (obj, value) => { obj.shipment = value; } }, metadata: _metadata }, _shipment_initializers, _shipment_extraInitializers);
        __esDecorate(null, null, _pickTask_decorators, { kind: "field", name: "pickTask", static: false, private: false, access: { has: obj => "pickTask" in obj, get: obj => obj.pickTask, set: (obj, value) => { obj.pickTask = value; } }, metadata: _metadata }, _pickTask_initializers, _pickTask_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QualityCheck = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QualityCheck = _classThis;
})();
exports.QualityCheck = QualityCheck;
/**
 * Picker performance model
 */
let PickerPerformance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'picker_performance', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _performanceId_decorators;
    let _performanceId_initializers = [];
    let _performanceId_extraInitializers = [];
    let _pickerId_decorators;
    let _pickerId_initializers = [];
    let _pickerId_extraInitializers = [];
    let _pickerName_decorators;
    let _pickerName_initializers = [];
    let _pickerName_extraInitializers = [];
    let _performanceDate_decorators;
    let _performanceDate_initializers = [];
    let _performanceDate_extraInitializers = [];
    let _totalPicks_decorators;
    let _totalPicks_initializers = [];
    let _totalPicks_extraInitializers = [];
    let _totalUnits_decorators;
    let _totalUnits_initializers = [];
    let _totalUnits_extraInitializers = [];
    let _totalHours_decorators;
    let _totalHours_initializers = [];
    let _totalHours_extraInitializers = [];
    let _picksPerHour_decorators;
    let _picksPerHour_initializers = [];
    let _picksPerHour_extraInitializers = [];
    let _unitsPerHour_decorators;
    let _unitsPerHour_initializers = [];
    let _unitsPerHour_extraInitializers = [];
    let _accuracyPercent_decorators;
    let _accuracyPercent_initializers = [];
    let _accuracyPercent_extraInitializers = [];
    let _errorCount_decorators;
    let _errorCount_initializers = [];
    let _errorCount_extraInitializers = [];
    let _averagePickTime_decorators;
    let _averagePickTime_initializers = [];
    let _averagePickTime_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PickerPerformance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.performanceId = __runInitializers(this, _performanceId_initializers, void 0);
            this.pickerId = (__runInitializers(this, _performanceId_extraInitializers), __runInitializers(this, _pickerId_initializers, void 0));
            this.pickerName = (__runInitializers(this, _pickerId_extraInitializers), __runInitializers(this, _pickerName_initializers, void 0));
            this.performanceDate = (__runInitializers(this, _pickerName_extraInitializers), __runInitializers(this, _performanceDate_initializers, void 0));
            this.totalPicks = (__runInitializers(this, _performanceDate_extraInitializers), __runInitializers(this, _totalPicks_initializers, void 0));
            this.totalUnits = (__runInitializers(this, _totalPicks_extraInitializers), __runInitializers(this, _totalUnits_initializers, void 0));
            this.totalHours = (__runInitializers(this, _totalUnits_extraInitializers), __runInitializers(this, _totalHours_initializers, void 0));
            this.picksPerHour = (__runInitializers(this, _totalHours_extraInitializers), __runInitializers(this, _picksPerHour_initializers, void 0));
            this.unitsPerHour = (__runInitializers(this, _picksPerHour_extraInitializers), __runInitializers(this, _unitsPerHour_initializers, void 0));
            this.accuracyPercent = (__runInitializers(this, _unitsPerHour_extraInitializers), __runInitializers(this, _accuracyPercent_initializers, void 0));
            this.errorCount = (__runInitializers(this, _accuracyPercent_extraInitializers), __runInitializers(this, _errorCount_initializers, void 0));
            this.averagePickTime = (__runInitializers(this, _errorCount_extraInitializers), __runInitializers(this, _averagePickTime_initializers, void 0));
            this.createdAt = (__runInitializers(this, _averagePickTime_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PickerPerformance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _performanceId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _pickerId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _pickerName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _performanceDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _totalPicks_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _totalUnits_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _totalHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _picksPerHour_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _unitsPerHour_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _accuracyPercent_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _errorCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _averagePickTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _performanceId_decorators, { kind: "field", name: "performanceId", static: false, private: false, access: { has: obj => "performanceId" in obj, get: obj => obj.performanceId, set: (obj, value) => { obj.performanceId = value; } }, metadata: _metadata }, _performanceId_initializers, _performanceId_extraInitializers);
        __esDecorate(null, null, _pickerId_decorators, { kind: "field", name: "pickerId", static: false, private: false, access: { has: obj => "pickerId" in obj, get: obj => obj.pickerId, set: (obj, value) => { obj.pickerId = value; } }, metadata: _metadata }, _pickerId_initializers, _pickerId_extraInitializers);
        __esDecorate(null, null, _pickerName_decorators, { kind: "field", name: "pickerName", static: false, private: false, access: { has: obj => "pickerName" in obj, get: obj => obj.pickerName, set: (obj, value) => { obj.pickerName = value; } }, metadata: _metadata }, _pickerName_initializers, _pickerName_extraInitializers);
        __esDecorate(null, null, _performanceDate_decorators, { kind: "field", name: "performanceDate", static: false, private: false, access: { has: obj => "performanceDate" in obj, get: obj => obj.performanceDate, set: (obj, value) => { obj.performanceDate = value; } }, metadata: _metadata }, _performanceDate_initializers, _performanceDate_extraInitializers);
        __esDecorate(null, null, _totalPicks_decorators, { kind: "field", name: "totalPicks", static: false, private: false, access: { has: obj => "totalPicks" in obj, get: obj => obj.totalPicks, set: (obj, value) => { obj.totalPicks = value; } }, metadata: _metadata }, _totalPicks_initializers, _totalPicks_extraInitializers);
        __esDecorate(null, null, _totalUnits_decorators, { kind: "field", name: "totalUnits", static: false, private: false, access: { has: obj => "totalUnits" in obj, get: obj => obj.totalUnits, set: (obj, value) => { obj.totalUnits = value; } }, metadata: _metadata }, _totalUnits_initializers, _totalUnits_extraInitializers);
        __esDecorate(null, null, _totalHours_decorators, { kind: "field", name: "totalHours", static: false, private: false, access: { has: obj => "totalHours" in obj, get: obj => obj.totalHours, set: (obj, value) => { obj.totalHours = value; } }, metadata: _metadata }, _totalHours_initializers, _totalHours_extraInitializers);
        __esDecorate(null, null, _picksPerHour_decorators, { kind: "field", name: "picksPerHour", static: false, private: false, access: { has: obj => "picksPerHour" in obj, get: obj => obj.picksPerHour, set: (obj, value) => { obj.picksPerHour = value; } }, metadata: _metadata }, _picksPerHour_initializers, _picksPerHour_extraInitializers);
        __esDecorate(null, null, _unitsPerHour_decorators, { kind: "field", name: "unitsPerHour", static: false, private: false, access: { has: obj => "unitsPerHour" in obj, get: obj => obj.unitsPerHour, set: (obj, value) => { obj.unitsPerHour = value; } }, metadata: _metadata }, _unitsPerHour_initializers, _unitsPerHour_extraInitializers);
        __esDecorate(null, null, _accuracyPercent_decorators, { kind: "field", name: "accuracyPercent", static: false, private: false, access: { has: obj => "accuracyPercent" in obj, get: obj => obj.accuracyPercent, set: (obj, value) => { obj.accuracyPercent = value; } }, metadata: _metadata }, _accuracyPercent_initializers, _accuracyPercent_extraInitializers);
        __esDecorate(null, null, _errorCount_decorators, { kind: "field", name: "errorCount", static: false, private: false, access: { has: obj => "errorCount" in obj, get: obj => obj.errorCount, set: (obj, value) => { obj.errorCount = value; } }, metadata: _metadata }, _errorCount_initializers, _errorCount_extraInitializers);
        __esDecorate(null, null, _averagePickTime_decorators, { kind: "field", name: "averagePickTime", static: false, private: false, access: { has: obj => "averagePickTime" in obj, get: obj => obj.averagePickTime, set: (obj, value) => { obj.averagePickTime = value; } }, metadata: _metadata }, _averagePickTime_initializers, _averagePickTime_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PickerPerformance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PickerPerformance = _classThis;
})();
exports.PickerPerformance = PickerPerformance;
// ============================================================================
// 1-6. WAVE PLANNING FUNCTIONS
// ============================================================================
/**
 * 1. Plans a new wave based on pending orders and configuration
 */
async function planWave(warehouseId, config, sequelize) {
    const transaction = await sequelize.transaction();
    const logger = new common_1.Logger('planWave');
    try {
        // Find eligible orders
        const eligibleOrders = await Order.findAll({
            where: {
                status: 'CONFIRMED',
                [sequelize_1.Op.or]: [
                    { requestedDeliveryDate: { [sequelize_1.Op.lte]: new Date(Date.now() + 86400000) } },
                    { priority: { [sequelize_1.Op.gte]: config.priorityThreshold } },
                ],
            },
            include: [
                {
                    model: OrderLine,
                    as: 'orderLines',
                    required: true,
                },
            ],
            limit: config.maxOrders,
            order: [['priority', 'DESC'], ['orderDate', 'ASC']],
            transaction,
        });
        if (eligibleOrders.length === 0) {
            throw new common_1.NotFoundException('No eligible orders found for wave planning');
        }
        // Create wave
        const waveNumber = `WAVE-${Date.now()}`;
        const wave = await WavePick.create({
            waveNumber,
            warehouseId,
            status: WaveStatus.PLANNED,
            pickingStrategy: config.pickingStrategy,
            totalOrders: eligibleOrders.length,
            totalItems: eligibleOrders.reduce((sum, order) => sum + order.orderLines.length, 0),
            plannedReleaseTime: config.releaseTime || new Date(),
            createdBy: 'SYSTEM',
        }, { transaction });
        // Add orders to wave
        await Promise.all(eligibleOrders.map((order, index) => WaveOrder.create({
            waveId: wave.waveId,
            orderId: order.orderId,
            sequenceNumber: index + 1,
            addedToWaveAt: new Date(),
        }, { transaction })));
        await transaction.commit();
        logger.log(`Wave ${waveNumber} planned with ${eligibleOrders.length} orders`);
        return wave;
    }
    catch (error) {
        await transaction.rollback();
        logger.error('Failed to plan wave', error);
        throw error;
    }
}
/**
 * 2. Releases a planned wave for picking
 */
async function releaseWave(waveId, releasedBy, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const wave = await WavePick.findByPk(waveId, { transaction });
        if (!wave) {
            throw new common_1.NotFoundException('Wave not found');
        }
        if (wave.status !== WaveStatus.PLANNED) {
            throw new common_1.ConflictException('Wave must be in PLANNED status to release');
        }
        wave.status = WaveStatus.RELEASED;
        wave.actualReleaseTime = new Date();
        wave.releasedBy = releasedBy;
        await wave.save({ transaction });
        await transaction.commit();
        return wave;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 3. Optimizes wave for picking efficiency
 */
async function optimizeWaveRouting(waveId, sequelize) {
    const wave = await WavePick.findByPk(waveId, {
        include: [
            {
                model: Order,
                as: 'orders',
                include: [{ model: OrderLine, as: 'orderLines' }],
            },
        ],
    });
    if (!wave) {
        throw new common_1.NotFoundException('Wave not found');
    }
    // Extract all pick locations
    const locations = [];
    wave.orders.forEach(order => {
        order.orderLines.forEach(line => {
            if (line.location)
                locations.push(line.location);
        });
    });
    // Simple optimization: sort by aisle/zone
    const optimizedRoute = locations.sort((a, b) => a.localeCompare(b));
    const estimatedTime = locations.length * 30; // 30 seconds per pick
    return { optimizedRoute, estimatedTime };
}
/**
 * 4. Retrieves active waves for a warehouse
 */
async function getActiveWaves(warehouseId) {
    return await WavePick.scope('active').findAll({
        where: { warehouseId },
        include: [
            { model: Order, as: 'orders' },
            { model: PickList, as: 'pickLists' },
        ],
        order: [['plannedReleaseTime', 'ASC']],
    });
}
/**
 * 5. Cancels a wave before completion
 */
async function cancelWave(waveId, reason, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const wave = await WavePick.findByPk(waveId, { transaction });
        if (!wave) {
            throw new common_1.NotFoundException('Wave not found');
        }
        if (wave.status === WaveStatus.SHIPPED) {
            throw new common_1.ConflictException('Cannot cancel shipped wave');
        }
        wave.status = WaveStatus.CANCELLED;
        await wave.save({ transaction });
        // Cancel all associated pick lists
        await PickList.update({ status: PickTaskStatus.CANCELLED }, { where: { waveId }, transaction });
        await transaction.commit();
        return wave;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 6. Calculates wave capacity utilization
 */
async function calculateWaveCapacity(waveId, maxCapacity) {
    const wave = await WavePick.findByPk(waveId, {
        include: [{ model: Order, as: 'orders', include: [{ model: OrderLine, as: 'orderLines' }] }],
    });
    if (!wave) {
        throw new common_1.NotFoundException('Wave not found');
    }
    const orderUtilization = (wave.totalOrders / maxCapacity.maxOrders) * 100;
    const itemUtilization = (wave.totalItems / maxCapacity.maxItems) * 100;
    const weightUtilization = (Number(wave.totalWeight) / maxCapacity.maxWeight) * 100;
    const utilizationPercent = Math.max(orderUtilization, itemUtilization, weightUtilization);
    const canAddOrders = utilizationPercent < 100;
    return {
        utilizationPercent,
        canAddOrders,
        remainingCapacity: {
            orders: maxCapacity.maxOrders - wave.totalOrders,
            items: maxCapacity.maxItems - wave.totalItems,
            weight: maxCapacity.maxWeight - Number(wave.totalWeight),
        },
    };
}
// ============================================================================
// 7-12. PICK LIST GENERATION FUNCTIONS
// ============================================================================
/**
 * 7. Generates pick lists for a wave based on strategy
 */
async function generatePickLists(waveId, strategy, sequelize) {
    const transaction = await sequelize.transaction();
    const logger = new common_1.Logger('generatePickLists');
    try {
        const wave = await WavePick.findByPk(waveId, {
            include: [
                {
                    model: Order,
                    as: 'orders',
                    include: [{ model: OrderLine, as: 'orderLines' }],
                },
            ],
            transaction,
        });
        if (!wave) {
            throw new common_1.NotFoundException('Wave not found');
        }
        const pickLists = [];
        switch (strategy) {
            case PickingStrategy.SINGLE_ORDER:
                for (const order of wave.orders) {
                    const pickList = await createSingleOrderPickList(wave, order, transaction);
                    pickLists.push(pickList);
                }
                break;
            case PickingStrategy.BATCH_PICK:
                const batchPickList = await createBatchPickList(wave, wave.orders, transaction);
                pickLists.push(batchPickList);
                break;
            case PickingStrategy.ZONE_PICK:
                const zonePickLists = await createZonePickLists(wave, wave.orders, transaction);
                pickLists.push(...zonePickLists);
                break;
            default:
                throw new common_1.BadRequestException(`Strategy ${strategy} not implemented`);
        }
        await transaction.commit();
        logger.log(`Generated ${pickLists.length} pick lists for wave ${wave.waveNumber}`);
        return pickLists;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 8. Creates single order pick list
 */
async function createSingleOrderPickList(wave, order, transaction) {
    const pickListNumber = `PL-${wave.waveNumber}-${order.orderNumber}`;
    const pickList = await PickList.create({
        pickListNumber,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        pickingStrategy: PickingStrategy.SINGLE_ORDER,
        status: PickTaskStatus.PENDING,
        totalTasks: order.orderLines.length,
    }, { transaction });
    // Create pick tasks
    await Promise.all(order.orderLines.map((line, index) => PickTask.create({
        pickListId: pickList.pickListId,
        orderLineId: line.orderLineId,
        warehouseId: wave.warehouseId,
        sequenceNumber: index + 1,
        itemId: line.itemId,
        itemNumber: line.itemNumber,
        itemDescription: line.itemDescription,
        location: line.location,
        quantityToPick: line.quantityOrdered - line.quantityPicked,
        unitOfMeasure: line.unitOfMeasure,
        status: PickTaskStatus.PENDING,
    }, { transaction })));
    return pickList;
}
/**
 * 9. Creates batch pick list
 */
async function createBatchPickList(wave, orders, transaction) {
    const pickListNumber = `PL-${wave.waveNumber}-BATCH`;
    const allLines = orders.flatMap(order => order.orderLines);
    const pickList = await PickList.create({
        pickListNumber,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        pickingStrategy: PickingStrategy.BATCH_PICK,
        status: PickTaskStatus.PENDING,
        totalTasks: allLines.length,
    }, { transaction });
    // Create pick tasks sorted by location
    const sortedLines = allLines.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
    await Promise.all(sortedLines.map((line, index) => PickTask.create({
        pickListId: pickList.pickListId,
        orderLineId: line.orderLineId,
        warehouseId: wave.warehouseId,
        sequenceNumber: index + 1,
        itemId: line.itemId,
        itemNumber: line.itemNumber,
        itemDescription: line.itemDescription,
        location: line.location,
        quantityToPick: line.quantityOrdered - line.quantityPicked,
        unitOfMeasure: line.unitOfMeasure,
        status: PickTaskStatus.PENDING,
    }, { transaction })));
    return pickList;
}
/**
 * 10. Creates zone-based pick lists
 */
async function createZonePickLists(wave, orders, transaction) {
    const zones = await WarehouseZone.findAll({
        where: { warehouseId: wave.warehouseId, isActive: true },
        order: [['priority', 'ASC']],
        transaction,
    });
    const pickLists = [];
    for (const zone of zones) {
        const pickListNumber = `PL-${wave.waveNumber}-${zone.zoneCode}`;
        const pickList = await PickList.create({
            pickListNumber,
            waveId: wave.waveId,
            warehouseId: wave.warehouseId,
            pickingStrategy: PickingStrategy.ZONE_PICK,
            status: PickTaskStatus.PENDING,
            totalTasks: 0,
        }, { transaction });
        // Create tasks for items in this zone
        let taskCount = 0;
        for (const order of orders) {
            for (const line of order.orderLines) {
                if (line.location?.startsWith(zone.zoneCode)) {
                    await PickTask.create({
                        pickListId: pickList.pickListId,
                        orderLineId: line.orderLineId,
                        warehouseId: wave.warehouseId,
                        zoneId: zone.zoneId,
                        sequenceNumber: taskCount + 1,
                        itemId: line.itemId,
                        itemNumber: line.itemNumber,
                        itemDescription: line.itemDescription,
                        location: line.location,
                        quantityToPick: line.quantityOrdered - line.quantityPicked,
                        unitOfMeasure: line.unitOfMeasure,
                        status: PickTaskStatus.PENDING,
                    }, { transaction });
                    taskCount++;
                }
            }
        }
        if (taskCount > 0) {
            pickList.totalTasks = taskCount;
            await pickList.save({ transaction });
            pickLists.push(pickList);
        }
    }
    return pickLists;
}
/**
 * 11. Assigns pick list to picker
 */
async function assignPickList(pickListId, pickerId, pickerName, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const pickList = await PickList.findByPk(pickListId, { transaction });
        if (!pickList) {
            throw new common_1.NotFoundException('Pick list not found');
        }
        if (pickList.status !== PickTaskStatus.PENDING) {
            throw new common_1.ConflictException('Pick list is already assigned or completed');
        }
        pickList.assignedTo = pickerId;
        pickList.assignedToName = pickerName;
        pickList.assignedAt = new Date();
        pickList.status = PickTaskStatus.ASSIGNED;
        await pickList.save({ transaction });
        await transaction.commit();
        return pickList;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 12. Retrieves pick list with tasks
 */
async function getPickListWithTasks(pickListId) {
    const pickList = await PickList.findByPk(pickListId, {
        include: [
            {
                model: PickTask,
                as: 'pickTasks',
                include: [
                    {
                        model: OrderLine,
                        as: 'orderLine',
                        include: [{ model: Order, as: 'order' }],
                    },
                ],
                order: [['sequenceNumber', 'ASC']],
            },
            { model: WavePick, as: 'wave' },
        ],
    });
    if (!pickList) {
        throw new common_1.NotFoundException('Pick list not found');
    }
    return pickList;
}
// ============================================================================
// 13-18. PICKING OPERATIONS FUNCTIONS
// ============================================================================
/**
 * 13. Starts picking a pick list
 */
async function startPicking(pickListId, pickerId, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const pickList = await PickList.findByPk(pickListId, { transaction });
        if (!pickList) {
            throw new common_1.NotFoundException('Pick list not found');
        }
        if (pickList.assignedTo !== pickerId) {
            throw new common_1.ConflictException('Pick list is not assigned to this picker');
        }
        pickList.status = PickTaskStatus.IN_PROGRESS;
        pickList.startedAt = new Date();
        await pickList.save({ transaction });
        await transaction.commit();
        return pickList;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 14. Confirms a pick task
 */
async function confirmPick(pickTaskId, quantityPicked, pickerId, lotNumber, serialNumber, sequelize) {
    const transaction = sequelize ? await sequelize.transaction() : undefined;
    try {
        const pickTask = await PickTask.findByPk(pickTaskId, {
            include: [{ model: OrderLine, as: 'orderLine' }],
            transaction,
        });
        if (!pickTask) {
            throw new common_1.NotFoundException('Pick task not found');
        }
        if (quantityPicked > pickTask.quantityToPick) {
            throw new common_1.BadRequestException('Quantity picked exceeds quantity to pick');
        }
        pickTask.quantityPicked = quantityPicked;
        pickTask.quantityShort = pickTask.quantityToPick - quantityPicked;
        pickTask.status = quantityPicked === pickTask.quantityToPick
            ? PickTaskStatus.PICKED
            : PickTaskStatus.SHORT_PICKED;
        pickTask.pickedAt = new Date();
        pickTask.pickedBy = pickerId;
        pickTask.lotNumber = lotNumber || pickTask.lotNumber;
        pickTask.serialNumber = serialNumber || pickTask.serialNumber;
        await pickTask.save({ transaction });
        // Update order line
        if (pickTask.orderLine) {
            pickTask.orderLine.quantityPicked += quantityPicked;
            await pickTask.orderLine.save({ transaction });
        }
        if (transaction)
            await transaction.commit();
        return pickTask;
    }
    catch (error) {
        if (transaction)
            await transaction.rollback();
        throw error;
    }
}
/**
 * 15. Handles short pick scenarios
 */
async function handleShortPick(pickTaskId, quantityShort, reason, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const pickTask = await PickTask.findByPk(pickTaskId, { transaction });
        if (!pickTask) {
            throw new common_1.NotFoundException('Pick task not found');
        }
        pickTask.quantityShort = quantityShort;
        pickTask.quantityPicked = pickTask.quantityToPick - quantityShort;
        pickTask.status = PickTaskStatus.SHORT_PICKED;
        pickTask.notes = `Short pick: ${reason}`;
        await pickTask.save({ transaction });
        await transaction.commit();
        return pickTask;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 16. Completes a pick list
 */
async function completePickList(pickListId, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const pickList = await PickList.findByPk(pickListId, {
            include: [{ model: PickTask, as: 'pickTasks' }],
            transaction,
        });
        if (!pickList) {
            throw new common_1.NotFoundException('Pick list not found');
        }
        const allCompleted = pickList.pickTasks.every(task => task.status === PickTaskStatus.PICKED || task.status === PickTaskStatus.SHORT_PICKED);
        if (!allCompleted) {
            throw new common_1.ConflictException('Not all pick tasks are completed');
        }
        pickList.status = PickTaskStatus.COMPLETED;
        pickList.completedAt = new Date();
        pickList.completedTasks = pickList.pickTasks.length;
        pickList.completionPercent = 100;
        await pickList.save({ transaction });
        await transaction.commit();
        return pickList;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 17. Retrieves pick tasks by location for cluster picking
 */
async function getPickTasksByLocation(warehouseId, locations) {
    return await PickTask.findAll({
        where: {
            warehouseId,
            location: { [sequelize_1.Op.in]: locations },
            status: PickTaskStatus.PENDING,
        },
        include: [
            {
                model: OrderLine,
                as: 'orderLine',
                include: [{ model: Order, as: 'order' }],
            },
        ],
        order: [['location', 'ASC'], ['sequenceNumber', 'ASC']],
    });
}
/**
 * 18. Calculates pick list progress
 */
async function calculatePickListProgress(pickListId) {
    const pickList = await PickList.findByPk(pickListId, {
        include: [{ model: PickTask, as: 'pickTasks' }],
    });
    if (!pickList) {
        throw new common_1.NotFoundException('Pick list not found');
    }
    const totalTasks = pickList.pickTasks.length;
    const completedTasks = pickList.pickTasks.filter(task => task.status === PickTaskStatus.PICKED || task.status === PickTaskStatus.SHORT_PICKED).length;
    const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const averagePickTime = 30; // seconds per pick
    const remainingTasks = totalTasks - completedTasks;
    const estimatedTimeRemaining = remainingTasks * averagePickTime;
    return {
        totalTasks,
        completedTasks,
        progressPercent,
        estimatedTimeRemaining,
    };
}
// ============================================================================
// 19-24. PACKING AND CARTONIZATION FUNCTIONS
// ============================================================================
/**
 * 19. Performs intelligent cartonization
 */
async function performCartonization(pickListId, strategy, availableCartons) {
    const pickList = await getPickListWithTasks(pickListId);
    const items = pickList.pickTasks.map(task => ({
        itemId: task.itemId,
        itemNumber: task.itemNumber,
        itemDescription: task.itemDescription,
        location: task.location,
        quantity: task.quantityPicked,
        unitOfMeasure: task.unitOfMeasure,
        lotNumber: task.lotNumber,
        serialNumber: task.serialNumber,
    }));
    // Simple bin-packing algorithm
    const cartons = [];
    let currentCarton = null;
    let currentWeight = 0;
    for (const item of items) {
        const itemWeight = 1.0; // Mock weight per unit
        if (!currentCarton || currentWeight + itemWeight > currentCarton.cartonSpec.maxWeight) {
            // Need new carton
            const cartonSpec = availableCartons.find(c => c.maxWeight >= itemWeight) || availableCartons[0];
            currentCarton = {
                cartonId: `CARTON-${cartons.length + 1}`,
                cartonSpec,
                items: [],
                weight: cartonSpec.tareWeight,
            };
            cartons.push(currentCarton);
            currentWeight = cartonSpec.tareWeight;
        }
        currentCarton.items.push(item);
        currentWeight += itemWeight;
        currentCarton.weight = currentWeight;
    }
    const totalWeight = cartons.reduce((sum, carton) => sum + carton.weight, 0);
    const totalCartons = cartons.length;
    const packingEfficiency = items.length / totalCartons; // items per carton
    return {
        cartons,
        totalWeight,
        totalCartons,
        packingEfficiency,
    };
}
/**
 * 20. Creates carton record
 */
async function createCarton(shipmentId, cartonSpec, weight, packedBy, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const cartonNumber = `CTN-${Date.now()}`;
        const carton = await Carton.create({
            shipmentId,
            cartonNumber,
            cartonType: cartonSpec.cartonId,
            length: cartonSpec.length,
            width: cartonSpec.width,
            height: cartonSpec.height,
            weight,
            tareWeight: cartonSpec.tareWeight,
            status: PackingStatus.PENDING,
            packedBy,
        }, { transaction });
        await transaction.commit();
        return carton;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 21. Adds items to carton
 */
async function addItemsToCarton(cartonId, pickTasks, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const contents = await Promise.all(pickTasks.map(task => CartonContent.create({
            cartonId,
            pickTaskId: task.pickTaskId,
            itemId: task.itemId,
            itemNumber: task.itemNumber,
            quantity: task.quantityPicked,
            lotNumber: task.lotNumber,
            serialNumber: task.serialNumber,
        }, { transaction })));
        await transaction.commit();
        return contents;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 22. Completes packing for a carton
 */
async function completeCartonPacking(cartonId, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const carton = await Carton.findByPk(cartonId, { transaction });
        if (!carton) {
            throw new common_1.NotFoundException('Carton not found');
        }
        carton.status = PackingStatus.PACKED;
        carton.packedAt = new Date();
        await carton.save({ transaction });
        await transaction.commit();
        return carton;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 23. Verifies carton contents
 */
async function verifyCartonContents(cartonId) {
    const carton = await Carton.findByPk(cartonId, {
        include: [
            {
                model: CartonContent,
                as: 'contents',
                include: [{ model: PickTask, as: 'pickTask' }],
            },
        ],
    });
    if (!carton) {
        throw new common_1.NotFoundException('Carton not found');
    }
    const discrepancies = [];
    // Verify each content item
    for (const content of carton.contents) {
        if (!content.pickTask) {
            discrepancies.push(`Missing pick task for item ${content.itemNumber}`);
            continue;
        }
        if (content.quantity > content.pickTask.quantityPicked) {
            discrepancies.push(`Quantity mismatch for item ${content.itemNumber}`);
        }
    }
    return {
        isValid: discrepancies.length === 0,
        discrepancies,
    };
}
/**
 * 24. Retrieves packing summary for shipment
 */
async function getPackingSummary(shipmentId) {
    const cartons = await Carton.findAll({
        where: { shipmentId },
        include: [{ model: CartonContent, as: 'contents' }],
    });
    const totalCartons = cartons.length;
    const totalItems = cartons.reduce((sum, carton) => sum + carton.contents.length, 0);
    const totalWeight = cartons.reduce((sum, carton) => sum + Number(carton.weight), 0);
    return {
        totalCartons,
        totalItems,
        totalWeight,
        cartons,
    };
}
// ============================================================================
// 25-28. SHIPPING LABEL AND PACKING SLIP GENERATION
// ============================================================================
/**
 * 25. Generates shipping label for carton
 */
async function generateShippingLabel(cartonId, carrier, serviceLevel, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const carton = await Carton.findByPk(cartonId, {
            include: [
                {
                    model: Shipment,
                    as: 'shipment',
                    include: [{ model: Order, as: 'order' }],
                },
            ],
            transaction,
        });
        if (!carton) {
            throw new common_1.NotFoundException('Carton not found');
        }
        // Generate tracking number (mock)
        const trackingNumber = `${carrier.substring(0, 3).toUpperCase()}${Date.now()}${Math.floor(Math.random() * 1000)}`;
        // Generate label data (mock base64)
        const labelData = `LABEL_DATA_${trackingNumber}`;
        carton.trackingNumber = trackingNumber;
        carton.status = PackingStatus.MANIFESTED;
        await carton.save({ transaction });
        await transaction.commit();
        return { labelData, trackingNumber };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 26. Generates packing slip for shipment
 */
async function generatePackingSlip(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId, {
        include: [
            {
                model: Order,
                as: 'order',
                include: [{ model: OrderLine, as: 'orderLines' }],
            },
            {
                model: Carton,
                as: 'cartons',
                include: [{ model: CartonContent, as: 'contents' }],
            },
        ],
    });
    if (!shipment) {
        throw new common_1.NotFoundException('Shipment not found');
    }
    const packingSlipData = `
PACKING SLIP
Shipment: ${shipment.shipmentNumber}
Order: ${shipment.order.orderNumber}
Date: ${new Date().toISOString()}

Items:
${shipment.order.orderLines.map(line => `- ${line.itemNumber}: ${line.itemDescription} (Qty: ${line.quantityShipped})`).join('\n')}

Total Cartons: ${shipment.cartons.length}
  `;
    const itemCount = shipment.order.orderLines.length;
    return { packingSlipData, itemCount };
}
/**
 * 27. Manifests shipment with carrier
 */
async function manifestShipment(shipmentId, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const shipment = await Shipment.findByPk(shipmentId, {
            include: [{ model: Carton, as: 'cartons' }],
            transaction,
        });
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        const unmanifested = shipment.cartons.filter(c => c.status !== PackingStatus.MANIFESTED);
        if (unmanifested.length > 0) {
            throw new common_1.ConflictException('All cartons must be packed and labeled before manifesting');
        }
        shipment.status = ShipmentStatus.MANIFESTED;
        await shipment.save({ transaction });
        await transaction.commit();
        return shipment;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 28. Prints batch labels for multiple cartons
 */
async function printBatchLabels(shipmentId) {
    const cartons = await Carton.findAll({
        where: { shipmentId },
        order: [['cartonNumber', 'ASC']],
    });
    const labels = cartons.map(carton => ({
        cartonId: carton.cartonId,
        trackingNumber: carton.trackingNumber || 'PENDING',
        labelData: `LABEL_${carton.cartonNumber}`,
    }));
    return { labels };
}
// ============================================================================
// 29-33. QUALITY CHECK FUNCTIONS
// ============================================================================
/**
 * 29. Creates quality check for shipment
 */
async function createQualityCheck(shipmentId, checkType, isMandatory, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const qualityCheck = await QualityCheck.create({
            shipmentId,
            checkType,
            status: QualityCheckStatus.PENDING,
            isMandatory,
        }, { transaction });
        await transaction.commit();
        return qualityCheck;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 30. Performs quality check
 */
async function performQualityCheck(qualityCheckId, performedBy, passed, findings, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const qualityCheck = await QualityCheck.findByPk(qualityCheckId, { transaction });
        if (!qualityCheck) {
            throw new common_1.NotFoundException('Quality check not found');
        }
        qualityCheck.status = passed ? QualityCheckStatus.PASSED : QualityCheckStatus.FAILED;
        qualityCheck.performedBy = performedBy;
        qualityCheck.performedAt = new Date();
        qualityCheck.findings = findings;
        await qualityCheck.save({ transaction });
        await transaction.commit();
        return qualityCheck;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 31. Validates expiration dates for medical supplies
 */
async function validateExpirationDates(pickTasks, minDaysValid = 90) {
    const warnings = [];
    const today = new Date();
    const minExpirationDate = new Date(today.getTime() + minDaysValid * 86400000);
    for (const task of pickTasks) {
        if (task.expirationDate) {
            if (task.expirationDate < today) {
                warnings.push(`Item ${task.itemNumber} is expired (${task.expirationDate.toISOString()})`);
            }
            else if (task.expirationDate < minExpirationDate) {
                warnings.push(`Item ${task.itemNumber} expires soon (${task.expirationDate.toISOString()})`);
            }
        }
    }
    return {
        valid: warnings.length === 0,
        warnings,
    };
}
/**
 * 32. Verifies lot numbers and serial numbers
 */
async function verifyLotAndSerial(pickTaskId, lotNumber, serialNumber) {
    const pickTask = await PickTask.findByPk(pickTaskId);
    if (!pickTask) {
        throw new common_1.NotFoundException('Pick task not found');
    }
    // Mock validation logic
    if (lotNumber && lotNumber.length < 5) {
        return { isValid: false, message: 'Lot number must be at least 5 characters' };
    }
    if (serialNumber && serialNumber.length < 8) {
        return { isValid: false, message: 'Serial number must be at least 8 characters' };
    }
    return { isValid: true, message: 'Lot and serial numbers verified' };
}
/**
 * 33. Checks temperature compliance for cold chain items
 */
async function checkTemperatureCompliance(shipmentId, temperatureLog, minTemp, maxTemp) {
    const violations = [];
    for (const reading of temperatureLog) {
        if (reading.temperature < minTemp) {
            violations.push(`Temperature ${reading.temperature}°F below minimum at ${reading.timestamp.toISOString()}`);
        }
        else if (reading.temperature > maxTemp) {
            violations.push(`Temperature ${reading.temperature}°F above maximum at ${reading.timestamp.toISOString()}`);
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
    };
}
// ============================================================================
// 34-37. INVENTORY UPDATE FUNCTIONS
// ============================================================================
/**
 * 34. Updates inventory after pick confirmation
 */
async function updateInventoryAfterPick(pickTaskId, sequelize) {
    const transaction = await sequelize.transaction();
    try {
        const pickTask = await PickTask.findByPk(pickTaskId, { transaction });
        if (!pickTask) {
            throw new common_1.NotFoundException('Pick task not found');
        }
        // Mock inventory update
        const newQuantity = 100 - pickTask.quantityPicked; // Mock current inventory
        await transaction.commit();
        return { success: true, newQuantity };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
/**
 * 35. Reserves inventory for wave
 */
async function reserveInventoryForWave(waveId, sequelize) {
    const wave = await WavePick.findByPk(waveId, {
        include: [
            {
                model: Order,
                as: 'orders',
                include: [{ model: OrderLine, as: 'orderLines' }],
            },
        ],
    });
    if (!wave) {
        throw new common_1.NotFoundException('Wave not found');
    }
    let reservedItems = 0;
    let totalQuantity = 0;
    for (const order of wave.orders) {
        for (const line of order.orderLines) {
            reservedItems++;
            totalQuantity += line.quantityOrdered;
        }
    }
    // Mock reservation logic
    return { reservedItems, totalQuantity };
}
/**
 * 36. Releases reserved inventory after cancellation
 */
async function releaseReservedInventory(waveId, sequelize) {
    const wave = await WavePick.findByPk(waveId);
    if (!wave) {
        throw new common_1.NotFoundException('Wave not found');
    }
    // Mock inventory release
    const releasedItems = wave.totalItems;
    return { releasedItems };
}
/**
 * 37. Syncs inventory with warehouse management system
 */
async function syncInventoryWithWMS(warehouseId) {
    // Mock WMS sync
    const syncedItems = 150;
    const lastSync = new Date();
    return { syncedItems, lastSync };
}
// ============================================================================
// 38-42. PERFORMANCE METRICS AND TRACKING
// ============================================================================
/**
 * 38. Calculates picker performance metrics
 */
async function calculatePickerPerformance(pickerId, startDate, endDate) {
    const pickLists = await PickList.findAll({
        where: {
            assignedTo: pickerId,
            completedAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        include: [{ model: PickTask, as: 'pickTasks' }],
    });
    const totalPicks = pickLists.reduce((sum, pl) => sum + pl.pickTasks.length, 0);
    const totalUnits = pickLists.reduce((sum, pl) => sum + pl.pickTasks.reduce((s, t) => s + t.quantityPicked, 0), 0);
    const totalHours = pickLists.reduce((sum, pl) => {
        if (pl.startedAt && pl.completedAt) {
            return sum + (pl.completedAt.getTime() - pl.startedAt.getTime()) / 3600000;
        }
        return sum;
    }, 0);
    const picksPerHour = totalHours > 0 ? totalPicks / totalHours : 0;
    const unitsPerHour = totalHours > 0 ? totalUnits / totalHours : 0;
    const totalErrors = pickLists.reduce((sum, pl) => sum + pl.pickTasks.filter(t => t.status === PickTaskStatus.SHORT_PICKED).length, 0);
    const accuracy = totalPicks > 0 ? ((totalPicks - totalErrors) / totalPicks) * 100 : 100;
    const averagePickTime = totalHours > 0 ? (totalHours * 3600) / totalPicks : 0;
    return {
        pickerId,
        pickerName: pickLists[0]?.assignedToName || 'Unknown',
        totalPicks,
        totalUnits,
        picksPerHour,
        unitsPerHour,
        accuracy,
        averagePickTime,
        periodStart: startDate,
        periodEnd: endDate,
    };
}
/**
 * 39. Tracks real-time picking status
 */
async function getRealtimePickingStatus(warehouseId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activePickLists = await PickList.count({
        where: {
            warehouseId,
            status: PickTaskStatus.IN_PROGRESS,
        },
    });
    const activePickers = await PickList.count({
        where: {
            warehouseId,
            status: PickTaskStatus.IN_PROGRESS,
        },
        distinct: true,
        col: 'assignedTo',
    });
    const completedToday = await PickList.count({
        where: {
            warehouseId,
            status: PickTaskStatus.COMPLETED,
            completedAt: { [sequelize_1.Op.gte]: today },
        },
    });
    const pendingOrders = await Order.count({
        where: {
            status: 'CONFIRMED',
        },
    });
    return {
        activePickers,
        activePickLists,
        completedToday,
        pendingOrders,
    };
}
/**
 * 40. Generates fulfillment summary report
 */
async function generateFulfillmentReport(warehouseId, startDate, endDate) {
    const waves = await WavePick.findAll({
        where: {
            warehouseId,
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const shipments = await Shipment.findAll({
        where: {
            warehouseId,
            shipDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        include: [{ model: Order, as: 'order', include: [{ model: OrderLine, as: 'orderLines' }] }],
    });
    const totalOrders = waves.reduce((sum, w) => sum + w.totalOrders, 0);
    const totalShipments = shipments.length;
    const totalUnits = shipments.reduce((sum, s) => sum + s.order.orderLines.reduce((s2, l) => s2 + l.quantityShipped, 0), 0);
    const fulfillmentTimes = shipments
        .filter(s => s.order.orderDate && s.shipDate)
        .map(s => (s.shipDate.getTime() - s.order.orderDate.getTime()) / 3600000);
    const averageFulfillmentTime = fulfillmentTimes.length > 0
        ? fulfillmentTimes.reduce((sum, t) => sum + t, 0) / fulfillmentTimes.length
        : 0;
    const onTimeShipments = shipments.filter(s => !s.order.requestedDeliveryDate || s.shipDate <= s.order.requestedDeliveryDate).length;
    const onTimePercent = totalShipments > 0 ? (onTimeShipments / totalShipments) * 100 : 100;
    return {
        totalOrders,
        totalShipments,
        totalUnits,
        averageFulfillmentTime,
        onTimePercent,
    };
}
/**
 * 41. Identifies bottlenecks in fulfillment process
 */
async function identifyFulfillmentBottlenecks(warehouseId) {
    const pickLists = await PickList.findAll({
        where: {
            warehouseId,
            status: PickTaskStatus.COMPLETED,
            startedAt: { [sequelize_1.Op.ne]: null },
            completedAt: { [sequelize_1.Op.ne]: null },
        },
        limit: 100,
        order: [['completedAt', 'DESC']],
    });
    const pickingDurations = pickLists.map(pl => ({
        stage: 'PICKING',
        duration: (pl.completedAt.getTime() - pl.startedAt.getTime()) / 60000, // minutes
    }));
    const avgPickingDuration = pickingDurations.length > 0
        ? pickingDurations.reduce((sum, d) => sum + d.duration, 0) / pickingDurations.length
        : 0;
    return [
        { stage: 'PICKING', avgDuration: avgPickingDuration, taskCount: pickingDurations.length },
        { stage: 'PACKING', avgDuration: 15, taskCount: 50 }, // Mock data
        { stage: 'QUALITY_CHECK', avgDuration: 5, taskCount: 50 }, // Mock data
    ];
}
/**
 * 42. Exports audit trail for HIPAA compliance
 */
async function exportAuditTrail(startDate, endDate) {
    // Mock audit trail export
    const auditRecords = [
        {
            timestamp: new Date(),
            action: 'PICK_CONFIRMED',
            userId: 'user123',
            entityType: 'PickTask',
            entityId: 'task-abc',
            details: 'Picked 10 units of item XYZ',
        },
        {
            timestamp: new Date(),
            action: 'CARTON_PACKED',
            userId: 'user456',
            entityType: 'Carton',
            entityId: 'carton-def',
            details: 'Packed carton with 5 items',
        },
    ];
    return auditRecords;
}
// ============================================================================
// PROVIDER TOKENS FOR NESTJS DI
// ============================================================================
exports.WAREHOUSE_FULFILLMENT_SERVICE = 'WAREHOUSE_FULFILLMENT_SERVICE';
exports.CARTONIZATION_ENGINE = 'CARTONIZATION_ENGINE';
exports.QUALITY_CHECK_SERVICE = 'QUALITY_CHECK_SERVICE';
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
exports.default = {
    // Models
    Warehouse,
    WarehouseZone,
    WavePick,
    WaveOrder,
    Order,
    OrderLine,
    PickList,
    PickTask,
    Carton,
    CartonContent,
    Shipment,
    QualityCheck,
    PickerPerformance,
    // Wave planning functions
    planWave,
    releaseWave,
    optimizeWaveRouting,
    getActiveWaves,
    cancelWave,
    calculateWaveCapacity,
    // Pick list generation
    generatePickLists,
    assignPickList,
    getPickListWithTasks,
    // Picking operations
    startPicking,
    confirmPick,
    handleShortPick,
    completePickList,
    getPickTasksByLocation,
    calculatePickListProgress,
    // Packing and cartonization
    performCartonization,
    createCarton,
    addItemsToCarton,
    completeCartonPacking,
    verifyCartonContents,
    getPackingSummary,
    // Shipping labels and packing slips
    generateShippingLabel,
    generatePackingSlip,
    manifestShipment,
    printBatchLabels,
    // Quality checks
    createQualityCheck,
    performQualityCheck,
    validateExpirationDates,
    verifyLotAndSerial,
    checkTemperatureCompliance,
    // Inventory updates
    updateInventoryAfterPick,
    reserveInventoryForWave,
    releaseReservedInventory,
    syncInventoryWithWMS,
    // Performance and tracking
    calculatePickerPerformance,
    getRealtimePickingStatus,
    generateFulfillmentReport,
    identifyFulfillmentBottlenecks,
    exportAuditTrail,
};
//# sourceMappingURL=warehouse-fulfillment-kit.js.map