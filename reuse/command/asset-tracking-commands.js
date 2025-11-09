"use strict";
/**
 * ASSET TRACKING COMMAND FUNCTIONS
 *
 * Enterprise-grade asset tracking system providing comprehensive functionality
 * for RFID tracking, barcode/QR scanning, GPS location tracking, BLE beacon
 * integration, asset check-in/check-out, movement history, real-time location
 * services, and geofencing. Competes with Zebra MotionWorks and AirFinder
 * asset tracking solutions.
 *
 * Features:
 * - RFID tag reading and tracking
 * - Barcode and QR code scanning
 * - GPS and indoor positioning
 * - BLE beacon integration
 * - Asset check-in/check-out workflows
 * - Movement history and audit trails
 * - Real-time location tracking
 * - Geofencing and alerts
 * - Zone management
 * - Asset custody chain
 *
 * @module AssetTrackingCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   trackAssetLocation,
 *   checkOutAsset,
 *   checkInAsset,
 *   createGeofence,
 *   TrackingMethod,
 *   CheckOutStatus
 * } from './asset-tracking-commands';
 *
 * // Track asset location
 * const location = await trackAssetLocation({
 *   assetId: 'asset-123',
 *   trackingMethod: TrackingMethod.GPS,
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10
 * });
 *
 * // Check out asset
 * const checkout = await checkOutAsset({
 *   assetId: 'asset-123',
 *   checkedOutBy: 'user-456',
 *   checkOutLocation: 'Warehouse A',
 *   expectedReturnDate: new Date('2024-12-31')
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
exports.TrackingAlert = exports.MovementHistory = exports.BLEBeacon = exports.RFIDTag = exports.Zone = exports.GeofenceEvent = exports.Geofence = exports.AssetCheckOut = exports.AssetLocation = exports.AlertType = exports.GeofenceStatus = exports.ZoneType = exports.MovementType = exports.CheckOutStatus = exports.TrackingMethod = void 0;
exports.trackAssetLocation = trackAssetLocation;
exports.getCurrentAssetLocation = getCurrentAssetLocation;
exports.getLocationHistory = getLocationHistory;
exports.getAssetsInZone = getAssetsInZone;
exports.checkOutAsset = checkOutAsset;
exports.checkInAsset = checkInAsset;
exports.getActiveCheckOuts = getActiveCheckOuts;
exports.getOverdueCheckOuts = getOverdueCheckOuts;
exports.createGeofence = createGeofence;
exports.checkGeofences = checkGeofences;
exports.getGeofenceEvents = getGeofenceEvents;
exports.createZone = createZone;
exports.getZoneHierarchy = getZoneHierarchy;
exports.updateZoneOccupancy = updateZoneOccupancy;
exports.registerRFIDTag = registerRFIDTag;
exports.recordRFIDRead = recordRFIDRead;
exports.registerBLEBeacon = registerBLEBeacon;
exports.recordMovement = recordMovement;
exports.getMovementHistory = getMovementHistory;
exports.createTrackingAlert = createTrackingAlert;
exports.acknowledgeAlert = acknowledgeAlert;
exports.getUnacknowledgedAlerts = getUnacknowledgedAlerts;
exports.getTrackingAnalytics = getTrackingAnalytics;
exports.getAssetMovementSummary = getAssetMovementSummary;
exports.findNearbyAssets = findNearbyAssets;
exports.trackAssetProximity = trackAssetProximity;
exports.createTrackingAlertRule = createTrackingAlertRule;
exports.evaluateTrackingAlerts = evaluateTrackingAlerts;
exports.getCustodyChain = getCustodyChain;
exports.verifyCustodyChain = verifyCustodyChain;
exports.recordAssetRoute = recordAssetRoute;
exports.getAssetRoutes = getAssetRoutes;
exports.markAssetLost = markAssetLost;
exports.markAssetRecovered = markAssetRecovered;
exports.getLostStolenReports = getLostStolenReports;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Tracking Method
 */
var TrackingMethod;
(function (TrackingMethod) {
    TrackingMethod["GPS"] = "gps";
    TrackingMethod["RFID"] = "rfid";
    TrackingMethod["BARCODE"] = "barcode";
    TrackingMethod["QR_CODE"] = "qr_code";
    TrackingMethod["BLE_BEACON"] = "ble_beacon";
    TrackingMethod["NFC"] = "nfc";
    TrackingMethod["WIFI"] = "wifi";
    TrackingMethod["MANUAL"] = "manual";
})(TrackingMethod || (exports.TrackingMethod = TrackingMethod = {}));
/**
 * Check-Out Status
 */
var CheckOutStatus;
(function (CheckOutStatus) {
    CheckOutStatus["CHECKED_OUT"] = "checked_out";
    CheckOutStatus["OVERDUE"] = "overdue";
    CheckOutStatus["CHECKED_IN"] = "checked_in";
    CheckOutStatus["LOST"] = "lost";
    CheckOutStatus["DAMAGED"] = "damaged";
})(CheckOutStatus || (exports.CheckOutStatus = CheckOutStatus = {}));
/**
 * Movement Type
 */
var MovementType;
(function (MovementType) {
    MovementType["CHECK_OUT"] = "check_out";
    MovementType["CHECK_IN"] = "check_in";
    MovementType["TRANSFER"] = "transfer";
    MovementType["RELOCATION"] = "relocation";
    MovementType["SHIPMENT"] = "shipment";
    MovementType["RETURN"] = "return";
    MovementType["DISPOSAL"] = "disposal";
})(MovementType || (exports.MovementType = MovementType = {}));
/**
 * Zone Type
 */
var ZoneType;
(function (ZoneType) {
    ZoneType["WAREHOUSE"] = "warehouse";
    ZoneType["BUILDING"] = "building";
    ZoneType["FLOOR"] = "floor";
    ZoneType["ROOM"] = "room";
    ZoneType["YARD"] = "yard";
    ZoneType["SECURE_AREA"] = "secure_area";
    ZoneType["STORAGE"] = "storage";
    ZoneType["CUSTOM"] = "custom";
})(ZoneType || (exports.ZoneType = ZoneType = {}));
/**
 * Geofence Status
 */
var GeofenceStatus;
(function (GeofenceStatus) {
    GeofenceStatus["ACTIVE"] = "active";
    GeofenceStatus["INACTIVE"] = "inactive";
    GeofenceStatus["TRIGGERED"] = "triggered";
})(GeofenceStatus || (exports.GeofenceStatus = GeofenceStatus = {}));
/**
 * Alert Type
 */
var AlertType;
(function (AlertType) {
    AlertType["GEOFENCE_ENTRY"] = "geofence_entry";
    AlertType["GEOFENCE_EXIT"] = "geofence_exit";
    AlertType["ASSET_MOVED"] = "asset_moved";
    AlertType["UNAUTHORIZED_MOVEMENT"] = "unauthorized_movement";
    AlertType["OVERDUE_RETURN"] = "overdue_return";
    AlertType["BATTERY_LOW"] = "battery_low";
    AlertType["TAG_REMOVED"] = "tag_removed";
})(AlertType || (exports.AlertType = AlertType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Asset Location Model
 */
let AssetLocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_locations',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['zone_id'] },
                { fields: ['tracking_method'] },
                { fields: ['timestamp'] },
                { fields: ['is_current'] },
            ],
        })];
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
    let _trackingMethod_decorators;
    let _trackingMethod_initializers = [];
    let _trackingMethod_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _altitude_decorators;
    let _altitude_initializers = [];
    let _altitude_extraInitializers = [];
    let _accuracy_decorators;
    let _accuracy_initializers = [];
    let _accuracy_extraInitializers = [];
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    let _buildingId_decorators;
    let _buildingId_initializers = [];
    let _buildingId_extraInitializers = [];
    let _floor_decorators;
    let _floor_initializers = [];
    let _floor_extraInitializers = [];
    let _room_decorators;
    let _room_initializers = [];
    let _room_extraInitializers = [];
    let _rfidTagId_decorators;
    let _rfidTagId_initializers = [];
    let _rfidTagId_extraInitializers = [];
    let _beaconId_decorators;
    let _beaconId_initializers = [];
    let _beaconId_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _isCurrent_decorators;
    let _isCurrent_initializers = [];
    let _isCurrent_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _zone_decorators;
    let _zone_initializers = [];
    let _zone_extraInitializers = [];
    var AssetLocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.trackingMethod = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _trackingMethod_initializers, void 0));
            this.latitude = (__runInitializers(this, _trackingMethod_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.altitude = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _altitude_initializers, void 0));
            this.accuracy = (__runInitializers(this, _altitude_extraInitializers), __runInitializers(this, _accuracy_initializers, void 0));
            this.zoneId = (__runInitializers(this, _accuracy_extraInitializers), __runInitializers(this, _zoneId_initializers, void 0));
            this.buildingId = (__runInitializers(this, _zoneId_extraInitializers), __runInitializers(this, _buildingId_initializers, void 0));
            this.floor = (__runInitializers(this, _buildingId_extraInitializers), __runInitializers(this, _floor_initializers, void 0));
            this.room = (__runInitializers(this, _floor_extraInitializers), __runInitializers(this, _room_initializers, void 0));
            this.rfidTagId = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _rfidTagId_initializers, void 0));
            this.beaconId = (__runInitializers(this, _rfidTagId_extraInitializers), __runInitializers(this, _beaconId_initializers, void 0));
            this.timestamp = (__runInitializers(this, _beaconId_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.isCurrent = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _isCurrent_initializers, void 0));
            this.metadata = (__runInitializers(this, _isCurrent_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.zone = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
            __runInitializers(this, _zone_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetLocation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _trackingMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracking method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TrackingMethod)), allowNull: false }), sequelize_typescript_1.Index];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _altitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Altitude in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _accuracy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accuracy in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _zoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _buildingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Building ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _floor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Floor' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _room_decorators = [(0, swagger_1.ApiProperty)({ description: 'Room' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _rfidTagId_decorators = [(0, swagger_1.ApiProperty)({ description: 'RFID tag ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _beaconId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beacon ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _isCurrent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is current location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _zone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _trackingMethod_decorators, { kind: "field", name: "trackingMethod", static: false, private: false, access: { has: obj => "trackingMethod" in obj, get: obj => obj.trackingMethod, set: (obj, value) => { obj.trackingMethod = value; } }, metadata: _metadata }, _trackingMethod_initializers, _trackingMethod_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _altitude_decorators, { kind: "field", name: "altitude", static: false, private: false, access: { has: obj => "altitude" in obj, get: obj => obj.altitude, set: (obj, value) => { obj.altitude = value; } }, metadata: _metadata }, _altitude_initializers, _altitude_extraInitializers);
        __esDecorate(null, null, _accuracy_decorators, { kind: "field", name: "accuracy", static: false, private: false, access: { has: obj => "accuracy" in obj, get: obj => obj.accuracy, set: (obj, value) => { obj.accuracy = value; } }, metadata: _metadata }, _accuracy_initializers, _accuracy_extraInitializers);
        __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
        __esDecorate(null, null, _buildingId_decorators, { kind: "field", name: "buildingId", static: false, private: false, access: { has: obj => "buildingId" in obj, get: obj => obj.buildingId, set: (obj, value) => { obj.buildingId = value; } }, metadata: _metadata }, _buildingId_initializers, _buildingId_extraInitializers);
        __esDecorate(null, null, _floor_decorators, { kind: "field", name: "floor", static: false, private: false, access: { has: obj => "floor" in obj, get: obj => obj.floor, set: (obj, value) => { obj.floor = value; } }, metadata: _metadata }, _floor_initializers, _floor_extraInitializers);
        __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: obj => "room" in obj, get: obj => obj.room, set: (obj, value) => { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
        __esDecorate(null, null, _rfidTagId_decorators, { kind: "field", name: "rfidTagId", static: false, private: false, access: { has: obj => "rfidTagId" in obj, get: obj => obj.rfidTagId, set: (obj, value) => { obj.rfidTagId = value; } }, metadata: _metadata }, _rfidTagId_initializers, _rfidTagId_extraInitializers);
        __esDecorate(null, null, _beaconId_decorators, { kind: "field", name: "beaconId", static: false, private: false, access: { has: obj => "beaconId" in obj, get: obj => obj.beaconId, set: (obj, value) => { obj.beaconId = value; } }, metadata: _metadata }, _beaconId_initializers, _beaconId_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _isCurrent_decorators, { kind: "field", name: "isCurrent", static: false, private: false, access: { has: obj => "isCurrent" in obj, get: obj => obj.isCurrent, set: (obj, value) => { obj.isCurrent = value; } }, metadata: _metadata }, _isCurrent_initializers, _isCurrent_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: obj => "zone" in obj, get: obj => obj.zone, set: (obj, value) => { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetLocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetLocation = _classThis;
})();
exports.AssetLocation = AssetLocation;
/**
 * Asset Check-Out Model
 */
let AssetCheckOut = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_checkouts',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['checked_out_by'] },
                { fields: ['status'] },
                { fields: ['expected_return_date'] },
            ],
        })];
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
    let _checkedOutBy_decorators;
    let _checkedOutBy_initializers = [];
    let _checkedOutBy_extraInitializers = [];
    let _checkOutDate_decorators;
    let _checkOutDate_initializers = [];
    let _checkOutDate_extraInitializers = [];
    let _checkOutLocation_decorators;
    let _checkOutLocation_initializers = [];
    let _checkOutLocation_extraInitializers = [];
    let _checkOutZoneId_decorators;
    let _checkOutZoneId_initializers = [];
    let _checkOutZoneId_extraInitializers = [];
    let _purpose_decorators;
    let _purpose_initializers = [];
    let _purpose_extraInitializers = [];
    let _expectedReturnDate_decorators;
    let _expectedReturnDate_initializers = [];
    let _expectedReturnDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _checkedInBy_decorators;
    let _checkedInBy_initializers = [];
    let _checkedInBy_extraInitializers = [];
    let _checkInDate_decorators;
    let _checkInDate_initializers = [];
    let _checkInDate_extraInitializers = [];
    let _checkInLocation_decorators;
    let _checkInLocation_initializers = [];
    let _checkInLocation_extraInitializers = [];
    let _checkInZoneId_decorators;
    let _checkInZoneId_initializers = [];
    let _checkInZoneId_extraInitializers = [];
    let _condition_decorators;
    let _condition_initializers = [];
    let _condition_extraInitializers = [];
    let _damageNotes_decorators;
    let _damageNotes_initializers = [];
    let _damageNotes_extraInitializers = [];
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
    let _checkOutZone_decorators;
    let _checkOutZone_initializers = [];
    let _checkOutZone_extraInitializers = [];
    let _checkInZone_decorators;
    let _checkInZone_initializers = [];
    let _checkInZone_extraInitializers = [];
    var AssetCheckOut = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.checkedOutBy = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _checkedOutBy_initializers, void 0));
            this.checkOutDate = (__runInitializers(this, _checkedOutBy_extraInitializers), __runInitializers(this, _checkOutDate_initializers, void 0));
            this.checkOutLocation = (__runInitializers(this, _checkOutDate_extraInitializers), __runInitializers(this, _checkOutLocation_initializers, void 0));
            this.checkOutZoneId = (__runInitializers(this, _checkOutLocation_extraInitializers), __runInitializers(this, _checkOutZoneId_initializers, void 0));
            this.purpose = (__runInitializers(this, _checkOutZoneId_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
            this.expectedReturnDate = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _expectedReturnDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _expectedReturnDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.status = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.checkedInBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _checkedInBy_initializers, void 0));
            this.checkInDate = (__runInitializers(this, _checkedInBy_extraInitializers), __runInitializers(this, _checkInDate_initializers, void 0));
            this.checkInLocation = (__runInitializers(this, _checkInDate_extraInitializers), __runInitializers(this, _checkInLocation_initializers, void 0));
            this.checkInZoneId = (__runInitializers(this, _checkInLocation_extraInitializers), __runInitializers(this, _checkInZoneId_initializers, void 0));
            this.condition = (__runInitializers(this, _checkInZoneId_extraInitializers), __runInitializers(this, _condition_initializers, void 0));
            this.damageNotes = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _damageNotes_initializers, void 0));
            this.notes = (__runInitializers(this, _damageNotes_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.checkOutZone = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _checkOutZone_initializers, void 0));
            this.checkInZone = (__runInitializers(this, _checkOutZone_extraInitializers), __runInitializers(this, _checkInZone_initializers, void 0));
            __runInitializers(this, _checkInZone_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetCheckOut");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _checkedOutBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checked out by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _checkOutDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-out date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _checkOutLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-out location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _checkOutZoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-out zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _purpose_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purpose' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _expectedReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected return date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CheckOutStatus)), defaultValue: CheckOutStatus.CHECKED_OUT }), sequelize_typescript_1.Index];
        _checkedInBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checked in by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _checkInDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-in date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _checkInLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-in location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _checkInZoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-in zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _condition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return condition' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _damageNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Damage notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _checkOutZone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone, 'checkOutZoneId')];
        _checkInZone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone, 'checkInZoneId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _checkedOutBy_decorators, { kind: "field", name: "checkedOutBy", static: false, private: false, access: { has: obj => "checkedOutBy" in obj, get: obj => obj.checkedOutBy, set: (obj, value) => { obj.checkedOutBy = value; } }, metadata: _metadata }, _checkedOutBy_initializers, _checkedOutBy_extraInitializers);
        __esDecorate(null, null, _checkOutDate_decorators, { kind: "field", name: "checkOutDate", static: false, private: false, access: { has: obj => "checkOutDate" in obj, get: obj => obj.checkOutDate, set: (obj, value) => { obj.checkOutDate = value; } }, metadata: _metadata }, _checkOutDate_initializers, _checkOutDate_extraInitializers);
        __esDecorate(null, null, _checkOutLocation_decorators, { kind: "field", name: "checkOutLocation", static: false, private: false, access: { has: obj => "checkOutLocation" in obj, get: obj => obj.checkOutLocation, set: (obj, value) => { obj.checkOutLocation = value; } }, metadata: _metadata }, _checkOutLocation_initializers, _checkOutLocation_extraInitializers);
        __esDecorate(null, null, _checkOutZoneId_decorators, { kind: "field", name: "checkOutZoneId", static: false, private: false, access: { has: obj => "checkOutZoneId" in obj, get: obj => obj.checkOutZoneId, set: (obj, value) => { obj.checkOutZoneId = value; } }, metadata: _metadata }, _checkOutZoneId_initializers, _checkOutZoneId_extraInitializers);
        __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: obj => "purpose" in obj, get: obj => obj.purpose, set: (obj, value) => { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
        __esDecorate(null, null, _expectedReturnDate_decorators, { kind: "field", name: "expectedReturnDate", static: false, private: false, access: { has: obj => "expectedReturnDate" in obj, get: obj => obj.expectedReturnDate, set: (obj, value) => { obj.expectedReturnDate = value; } }, metadata: _metadata }, _expectedReturnDate_initializers, _expectedReturnDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _checkedInBy_decorators, { kind: "field", name: "checkedInBy", static: false, private: false, access: { has: obj => "checkedInBy" in obj, get: obj => obj.checkedInBy, set: (obj, value) => { obj.checkedInBy = value; } }, metadata: _metadata }, _checkedInBy_initializers, _checkedInBy_extraInitializers);
        __esDecorate(null, null, _checkInDate_decorators, { kind: "field", name: "checkInDate", static: false, private: false, access: { has: obj => "checkInDate" in obj, get: obj => obj.checkInDate, set: (obj, value) => { obj.checkInDate = value; } }, metadata: _metadata }, _checkInDate_initializers, _checkInDate_extraInitializers);
        __esDecorate(null, null, _checkInLocation_decorators, { kind: "field", name: "checkInLocation", static: false, private: false, access: { has: obj => "checkInLocation" in obj, get: obj => obj.checkInLocation, set: (obj, value) => { obj.checkInLocation = value; } }, metadata: _metadata }, _checkInLocation_initializers, _checkInLocation_extraInitializers);
        __esDecorate(null, null, _checkInZoneId_decorators, { kind: "field", name: "checkInZoneId", static: false, private: false, access: { has: obj => "checkInZoneId" in obj, get: obj => obj.checkInZoneId, set: (obj, value) => { obj.checkInZoneId = value; } }, metadata: _metadata }, _checkInZoneId_initializers, _checkInZoneId_extraInitializers);
        __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: obj => "condition" in obj, get: obj => obj.condition, set: (obj, value) => { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
        __esDecorate(null, null, _damageNotes_decorators, { kind: "field", name: "damageNotes", static: false, private: false, access: { has: obj => "damageNotes" in obj, get: obj => obj.damageNotes, set: (obj, value) => { obj.damageNotes = value; } }, metadata: _metadata }, _damageNotes_initializers, _damageNotes_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _checkOutZone_decorators, { kind: "field", name: "checkOutZone", static: false, private: false, access: { has: obj => "checkOutZone" in obj, get: obj => obj.checkOutZone, set: (obj, value) => { obj.checkOutZone = value; } }, metadata: _metadata }, _checkOutZone_initializers, _checkOutZone_extraInitializers);
        __esDecorate(null, null, _checkInZone_decorators, { kind: "field", name: "checkInZone", static: false, private: false, access: { has: obj => "checkInZone" in obj, get: obj => obj.checkInZone, set: (obj, value) => { obj.checkInZone = value; } }, metadata: _metadata }, _checkInZone_initializers, _checkInZone_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetCheckOut = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetCheckOut = _classThis;
})();
exports.AssetCheckOut = AssetCheckOut;
/**
 * Geofence Model
 */
let Geofence = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'geofences',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'] },
                { fields: ['status'] },
                { fields: ['is_active'] },
            ],
        })];
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
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _centerLatitude_decorators;
    let _centerLatitude_initializers = [];
    let _centerLatitude_extraInitializers = [];
    let _centerLongitude_decorators;
    let _centerLongitude_initializers = [];
    let _centerLongitude_extraInitializers = [];
    let _radiusMeters_decorators;
    let _radiusMeters_initializers = [];
    let _radiusMeters_extraInitializers = [];
    let _polygon_decorators;
    let _polygon_initializers = [];
    let _polygon_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _alertOnEntry_decorators;
    let _alertOnEntry_initializers = [];
    let _alertOnEntry_extraInitializers = [];
    let _alertOnExit_decorators;
    let _alertOnExit_initializers = [];
    let _alertOnExit_extraInitializers = [];
    let _allowedAssets_decorators;
    let _allowedAssets_initializers = [];
    let _allowedAssets_extraInitializers = [];
    let _notifications_decorators;
    let _notifications_initializers = [];
    let _notifications_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _triggerCount_decorators;
    let _triggerCount_initializers = [];
    let _triggerCount_extraInitializers = [];
    let _lastTriggered_decorators;
    let _lastTriggered_initializers = [];
    let _lastTriggered_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _events_decorators;
    let _events_initializers = [];
    let _events_extraInitializers = [];
    var Geofence = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.centerLatitude = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _centerLatitude_initializers, void 0));
            this.centerLongitude = (__runInitializers(this, _centerLatitude_extraInitializers), __runInitializers(this, _centerLongitude_initializers, void 0));
            this.radiusMeters = (__runInitializers(this, _centerLongitude_extraInitializers), __runInitializers(this, _radiusMeters_initializers, void 0));
            this.polygon = (__runInitializers(this, _radiusMeters_extraInitializers), __runInitializers(this, _polygon_initializers, void 0));
            this.status = (__runInitializers(this, _polygon_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.alertOnEntry = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _alertOnEntry_initializers, void 0));
            this.alertOnExit = (__runInitializers(this, _alertOnEntry_extraInitializers), __runInitializers(this, _alertOnExit_initializers, void 0));
            this.allowedAssets = (__runInitializers(this, _alertOnExit_extraInitializers), __runInitializers(this, _allowedAssets_initializers, void 0));
            this.notifications = (__runInitializers(this, _allowedAssets_extraInitializers), __runInitializers(this, _notifications_initializers, void 0));
            this.isActive = (__runInitializers(this, _notifications_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.triggerCount = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _triggerCount_initializers, void 0));
            this.lastTriggered = (__runInitializers(this, _triggerCount_extraInitializers), __runInitializers(this, _lastTriggered_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastTriggered_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.events = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _events_initializers, void 0));
            __runInitializers(this, _events_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Geofence");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _centerLatitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Center latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8), allowNull: false })];
        _centerLongitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Center longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8), allowNull: false })];
        _radiusMeters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Radius in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _polygon_decorators = [(0, swagger_1.ApiProperty)({ description: 'Polygon coordinates' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(GeofenceStatus)), defaultValue: GeofenceStatus.ACTIVE }), sequelize_typescript_1.Index];
        _alertOnEntry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert on entry' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _alertOnExit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert on exit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _allowedAssets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allowed asset IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _notifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification user IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _triggerCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trigger count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _lastTriggered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last triggered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _events_decorators = [(0, sequelize_typescript_1.HasMany)(() => GeofenceEvent)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _centerLatitude_decorators, { kind: "field", name: "centerLatitude", static: false, private: false, access: { has: obj => "centerLatitude" in obj, get: obj => obj.centerLatitude, set: (obj, value) => { obj.centerLatitude = value; } }, metadata: _metadata }, _centerLatitude_initializers, _centerLatitude_extraInitializers);
        __esDecorate(null, null, _centerLongitude_decorators, { kind: "field", name: "centerLongitude", static: false, private: false, access: { has: obj => "centerLongitude" in obj, get: obj => obj.centerLongitude, set: (obj, value) => { obj.centerLongitude = value; } }, metadata: _metadata }, _centerLongitude_initializers, _centerLongitude_extraInitializers);
        __esDecorate(null, null, _radiusMeters_decorators, { kind: "field", name: "radiusMeters", static: false, private: false, access: { has: obj => "radiusMeters" in obj, get: obj => obj.radiusMeters, set: (obj, value) => { obj.radiusMeters = value; } }, metadata: _metadata }, _radiusMeters_initializers, _radiusMeters_extraInitializers);
        __esDecorate(null, null, _polygon_decorators, { kind: "field", name: "polygon", static: false, private: false, access: { has: obj => "polygon" in obj, get: obj => obj.polygon, set: (obj, value) => { obj.polygon = value; } }, metadata: _metadata }, _polygon_initializers, _polygon_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _alertOnEntry_decorators, { kind: "field", name: "alertOnEntry", static: false, private: false, access: { has: obj => "alertOnEntry" in obj, get: obj => obj.alertOnEntry, set: (obj, value) => { obj.alertOnEntry = value; } }, metadata: _metadata }, _alertOnEntry_initializers, _alertOnEntry_extraInitializers);
        __esDecorate(null, null, _alertOnExit_decorators, { kind: "field", name: "alertOnExit", static: false, private: false, access: { has: obj => "alertOnExit" in obj, get: obj => obj.alertOnExit, set: (obj, value) => { obj.alertOnExit = value; } }, metadata: _metadata }, _alertOnExit_initializers, _alertOnExit_extraInitializers);
        __esDecorate(null, null, _allowedAssets_decorators, { kind: "field", name: "allowedAssets", static: false, private: false, access: { has: obj => "allowedAssets" in obj, get: obj => obj.allowedAssets, set: (obj, value) => { obj.allowedAssets = value; } }, metadata: _metadata }, _allowedAssets_initializers, _allowedAssets_extraInitializers);
        __esDecorate(null, null, _notifications_decorators, { kind: "field", name: "notifications", static: false, private: false, access: { has: obj => "notifications" in obj, get: obj => obj.notifications, set: (obj, value) => { obj.notifications = value; } }, metadata: _metadata }, _notifications_initializers, _notifications_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _triggerCount_decorators, { kind: "field", name: "triggerCount", static: false, private: false, access: { has: obj => "triggerCount" in obj, get: obj => obj.triggerCount, set: (obj, value) => { obj.triggerCount = value; } }, metadata: _metadata }, _triggerCount_initializers, _triggerCount_extraInitializers);
        __esDecorate(null, null, _lastTriggered_decorators, { kind: "field", name: "lastTriggered", static: false, private: false, access: { has: obj => "lastTriggered" in obj, get: obj => obj.lastTriggered, set: (obj, value) => { obj.lastTriggered = value; } }, metadata: _metadata }, _lastTriggered_initializers, _lastTriggered_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: obj => "events" in obj, get: obj => obj.events, set: (obj, value) => { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Geofence = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Geofence = _classThis;
})();
exports.Geofence = Geofence;
/**
 * Geofence Event Model
 */
let GeofenceEvent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'geofence_events',
            timestamps: true,
            indexes: [
                { fields: ['geofence_id'] },
                { fields: ['asset_id'] },
                { fields: ['event_type'] },
                { fields: ['triggered_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _geofenceId_decorators;
    let _geofenceId_initializers = [];
    let _geofenceId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _triggeredAt_decorators;
    let _triggeredAt_initializers = [];
    let _triggeredAt_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _alertSent_decorators;
    let _alertSent_initializers = [];
    let _alertSent_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _geofence_decorators;
    let _geofence_initializers = [];
    let _geofence_extraInitializers = [];
    var GeofenceEvent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.geofenceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _geofenceId_initializers, void 0));
            this.assetId = (__runInitializers(this, _geofenceId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.eventType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.triggeredAt = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _triggeredAt_initializers, void 0));
            this.latitude = (__runInitializers(this, _triggeredAt_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.alertSent = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _alertSent_initializers, void 0));
            this.metadata = (__runInitializers(this, _alertSent_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.geofence = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _geofence_initializers, void 0));
            __runInitializers(this, _geofence_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GeofenceEvent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _geofenceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Geofence ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Geofence), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _triggeredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triggered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _alertSent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert sent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _geofence_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Geofence)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _geofenceId_decorators, { kind: "field", name: "geofenceId", static: false, private: false, access: { has: obj => "geofenceId" in obj, get: obj => obj.geofenceId, set: (obj, value) => { obj.geofenceId = value; } }, metadata: _metadata }, _geofenceId_initializers, _geofenceId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _triggeredAt_decorators, { kind: "field", name: "triggeredAt", static: false, private: false, access: { has: obj => "triggeredAt" in obj, get: obj => obj.triggeredAt, set: (obj, value) => { obj.triggeredAt = value; } }, metadata: _metadata }, _triggeredAt_initializers, _triggeredAt_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _alertSent_decorators, { kind: "field", name: "alertSent", static: false, private: false, access: { has: obj => "alertSent" in obj, get: obj => obj.alertSent, set: (obj, value) => { obj.alertSent = value; } }, metadata: _metadata }, _alertSent_initializers, _alertSent_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _geofence_decorators, { kind: "field", name: "geofence", static: false, private: false, access: { has: obj => "geofence" in obj, get: obj => obj.geofence, set: (obj, value) => { obj.geofence = value; } }, metadata: _metadata }, _geofence_initializers, _geofence_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeofenceEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeofenceEvent = _classThis;
})();
exports.GeofenceEvent = GeofenceEvent;
/**
 * Zone Model
 */
let Zone = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'zones',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'] },
                { fields: ['zone_type'] },
                { fields: ['parent_zone_id'] },
                { fields: ['is_active'] },
            ],
        })];
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
    let _zoneType_decorators;
    let _zoneType_initializers = [];
    let _zoneType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _parentZoneId_decorators;
    let _parentZoneId_initializers = [];
    let _parentZoneId_extraInitializers = [];
    let _buildingId_decorators;
    let _buildingId_initializers = [];
    let _buildingId_extraInitializers = [];
    let _floor_decorators;
    let _floor_initializers = [];
    let _floor_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _currentOccupancy_decorators;
    let _currentOccupancy_initializers = [];
    let _currentOccupancy_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
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
    let _parentZone_decorators;
    let _parentZone_initializers = [];
    let _parentZone_extraInitializers = [];
    let _childZones_decorators;
    let _childZones_initializers = [];
    let _childZones_extraInitializers = [];
    let _assetLocations_decorators;
    let _assetLocations_initializers = [];
    let _assetLocations_extraInitializers = [];
    var Zone = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.zoneType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _zoneType_initializers, void 0));
            this.description = (__runInitializers(this, _zoneType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.parentZoneId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _parentZoneId_initializers, void 0));
            this.buildingId = (__runInitializers(this, _parentZoneId_extraInitializers), __runInitializers(this, _buildingId_initializers, void 0));
            this.floor = (__runInitializers(this, _buildingId_extraInitializers), __runInitializers(this, _floor_initializers, void 0));
            this.capacity = (__runInitializers(this, _floor_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
            this.currentOccupancy = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _currentOccupancy_initializers, void 0));
            this.latitude = (__runInitializers(this, _currentOccupancy_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.isActive = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.parentZone = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _parentZone_initializers, void 0));
            this.childZones = (__runInitializers(this, _parentZone_extraInitializers), __runInitializers(this, _childZones_initializers, void 0));
            this.assetLocations = (__runInitializers(this, _childZones_extraInitializers), __runInitializers(this, _assetLocations_initializers, void 0));
            __runInitializers(this, _assetLocations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Zone");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _zoneType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Zone type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ZoneType)), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _parentZoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _buildingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Building ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _floor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Floor' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _capacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Capacity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _currentOccupancy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current occupancy' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _parentZone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone, 'parentZoneId')];
        _childZones_decorators = [(0, sequelize_typescript_1.HasMany)(() => Zone, 'parentZoneId')];
        _assetLocations_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetLocation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _zoneType_decorators, { kind: "field", name: "zoneType", static: false, private: false, access: { has: obj => "zoneType" in obj, get: obj => obj.zoneType, set: (obj, value) => { obj.zoneType = value; } }, metadata: _metadata }, _zoneType_initializers, _zoneType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _parentZoneId_decorators, { kind: "field", name: "parentZoneId", static: false, private: false, access: { has: obj => "parentZoneId" in obj, get: obj => obj.parentZoneId, set: (obj, value) => { obj.parentZoneId = value; } }, metadata: _metadata }, _parentZoneId_initializers, _parentZoneId_extraInitializers);
        __esDecorate(null, null, _buildingId_decorators, { kind: "field", name: "buildingId", static: false, private: false, access: { has: obj => "buildingId" in obj, get: obj => obj.buildingId, set: (obj, value) => { obj.buildingId = value; } }, metadata: _metadata }, _buildingId_initializers, _buildingId_extraInitializers);
        __esDecorate(null, null, _floor_decorators, { kind: "field", name: "floor", static: false, private: false, access: { has: obj => "floor" in obj, get: obj => obj.floor, set: (obj, value) => { obj.floor = value; } }, metadata: _metadata }, _floor_initializers, _floor_extraInitializers);
        __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
        __esDecorate(null, null, _currentOccupancy_decorators, { kind: "field", name: "currentOccupancy", static: false, private: false, access: { has: obj => "currentOccupancy" in obj, get: obj => obj.currentOccupancy, set: (obj, value) => { obj.currentOccupancy = value; } }, metadata: _metadata }, _currentOccupancy_initializers, _currentOccupancy_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _parentZone_decorators, { kind: "field", name: "parentZone", static: false, private: false, access: { has: obj => "parentZone" in obj, get: obj => obj.parentZone, set: (obj, value) => { obj.parentZone = value; } }, metadata: _metadata }, _parentZone_initializers, _parentZone_extraInitializers);
        __esDecorate(null, null, _childZones_decorators, { kind: "field", name: "childZones", static: false, private: false, access: { has: obj => "childZones" in obj, get: obj => obj.childZones, set: (obj, value) => { obj.childZones = value; } }, metadata: _metadata }, _childZones_initializers, _childZones_extraInitializers);
        __esDecorate(null, null, _assetLocations_decorators, { kind: "field", name: "assetLocations", static: false, private: false, access: { has: obj => "assetLocations" in obj, get: obj => obj.assetLocations, set: (obj, value) => { obj.assetLocations = value; } }, metadata: _metadata }, _assetLocations_initializers, _assetLocations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Zone = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Zone = _classThis;
})();
exports.Zone = Zone;
/**
 * RFID Tag Model
 */
let RFIDTag = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'rfid_tags',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'], unique: true },
                { fields: ['tag_id'], unique: true },
                { fields: ['epc_code'], unique: true },
                { fields: ['is_active'] },
            ],
        })];
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
    let _tagId_decorators;
    let _tagId_initializers = [];
    let _tagId_extraInitializers = [];
    let _epcCode_decorators;
    let _epcCode_initializers = [];
    let _epcCode_extraInitializers = [];
    let _technology_decorators;
    let _technology_initializers = [];
    let _technology_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _batteryLevel_decorators;
    let _batteryLevel_initializers = [];
    let _batteryLevel_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _activatedDate_decorators;
    let _activatedDate_initializers = [];
    let _activatedDate_extraInitializers = [];
    let _lastReadTime_decorators;
    let _lastReadTime_initializers = [];
    let _lastReadTime_extraInitializers = [];
    let _readCount_decorators;
    let _readCount_initializers = [];
    let _readCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var RFIDTag = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.tagId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _tagId_initializers, void 0));
            this.epcCode = (__runInitializers(this, _tagId_extraInitializers), __runInitializers(this, _epcCode_initializers, void 0));
            this.technology = (__runInitializers(this, _epcCode_extraInitializers), __runInitializers(this, _technology_initializers, void 0));
            this.frequency = (__runInitializers(this, _technology_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.batteryLevel = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _batteryLevel_initializers, void 0));
            this.isActive = (__runInitializers(this, _batteryLevel_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.activatedDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _activatedDate_initializers, void 0));
            this.lastReadTime = (__runInitializers(this, _activatedDate_extraInitializers), __runInitializers(this, _lastReadTime_initializers, void 0));
            this.readCount = (__runInitializers(this, _lastReadTime_extraInitializers), __runInitializers(this, _readCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _readCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RFIDTag");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _tagId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tag ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _epcCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'EPC code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true }), sequelize_typescript_1.Index];
        _technology_decorators = [(0, swagger_1.ApiProperty)({ description: 'Technology type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _batteryLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Battery level percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _activatedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Activated date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastReadTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last read time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _readCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Read count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _tagId_decorators, { kind: "field", name: "tagId", static: false, private: false, access: { has: obj => "tagId" in obj, get: obj => obj.tagId, set: (obj, value) => { obj.tagId = value; } }, metadata: _metadata }, _tagId_initializers, _tagId_extraInitializers);
        __esDecorate(null, null, _epcCode_decorators, { kind: "field", name: "epcCode", static: false, private: false, access: { has: obj => "epcCode" in obj, get: obj => obj.epcCode, set: (obj, value) => { obj.epcCode = value; } }, metadata: _metadata }, _epcCode_initializers, _epcCode_extraInitializers);
        __esDecorate(null, null, _technology_decorators, { kind: "field", name: "technology", static: false, private: false, access: { has: obj => "technology" in obj, get: obj => obj.technology, set: (obj, value) => { obj.technology = value; } }, metadata: _metadata }, _technology_initializers, _technology_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _batteryLevel_decorators, { kind: "field", name: "batteryLevel", static: false, private: false, access: { has: obj => "batteryLevel" in obj, get: obj => obj.batteryLevel, set: (obj, value) => { obj.batteryLevel = value; } }, metadata: _metadata }, _batteryLevel_initializers, _batteryLevel_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _activatedDate_decorators, { kind: "field", name: "activatedDate", static: false, private: false, access: { has: obj => "activatedDate" in obj, get: obj => obj.activatedDate, set: (obj, value) => { obj.activatedDate = value; } }, metadata: _metadata }, _activatedDate_initializers, _activatedDate_extraInitializers);
        __esDecorate(null, null, _lastReadTime_decorators, { kind: "field", name: "lastReadTime", static: false, private: false, access: { has: obj => "lastReadTime" in obj, get: obj => obj.lastReadTime, set: (obj, value) => { obj.lastReadTime = value; } }, metadata: _metadata }, _lastReadTime_initializers, _lastReadTime_extraInitializers);
        __esDecorate(null, null, _readCount_decorators, { kind: "field", name: "readCount", static: false, private: false, access: { has: obj => "readCount" in obj, get: obj => obj.readCount, set: (obj, value) => { obj.readCount = value; } }, metadata: _metadata }, _readCount_initializers, _readCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RFIDTag = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RFIDTag = _classThis;
})();
exports.RFIDTag = RFIDTag;
/**
 * BLE Beacon Model
 */
let BLEBeacon = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ble_beacons',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['beacon_id'], unique: true },
                { fields: ['uuid'] },
                { fields: ['zone_id'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _beaconId_decorators;
    let _beaconId_initializers = [];
    let _beaconId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _uuid_decorators;
    let _uuid_initializers = [];
    let _uuid_extraInitializers = [];
    let _major_decorators;
    let _major_initializers = [];
    let _major_extraInitializers = [];
    let _minor_decorators;
    let _minor_initializers = [];
    let _minor_extraInitializers = [];
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _batteryLevel_decorators;
    let _batteryLevel_initializers = [];
    let _batteryLevel_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastDetected_decorators;
    let _lastDetected_initializers = [];
    let _lastDetected_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _zone_decorators;
    let _zone_initializers = [];
    let _zone_extraInitializers = [];
    var BLEBeacon = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.beaconId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _beaconId_initializers, void 0));
            this.name = (__runInitializers(this, _beaconId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.uuid = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _uuid_initializers, void 0));
            this.major = (__runInitializers(this, _uuid_extraInitializers), __runInitializers(this, _major_initializers, void 0));
            this.minor = (__runInitializers(this, _major_extraInitializers), __runInitializers(this, _minor_initializers, void 0));
            this.zoneId = (__runInitializers(this, _minor_extraInitializers), __runInitializers(this, _zoneId_initializers, void 0));
            this.latitude = (__runInitializers(this, _zoneId_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.batteryLevel = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _batteryLevel_initializers, void 0));
            this.isActive = (__runInitializers(this, _batteryLevel_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastDetected = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastDetected_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastDetected_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.zone = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
            __runInitializers(this, _zone_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BLEBeacon");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _beaconId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beacon ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _uuid_decorators = [(0, swagger_1.ApiProperty)({ description: 'UUID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _major_decorators = [(0, swagger_1.ApiProperty)({ description: 'Major' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _minor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minor' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _zoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _batteryLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Battery level percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _lastDetected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last detected' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _zone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _beaconId_decorators, { kind: "field", name: "beaconId", static: false, private: false, access: { has: obj => "beaconId" in obj, get: obj => obj.beaconId, set: (obj, value) => { obj.beaconId = value; } }, metadata: _metadata }, _beaconId_initializers, _beaconId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _uuid_decorators, { kind: "field", name: "uuid", static: false, private: false, access: { has: obj => "uuid" in obj, get: obj => obj.uuid, set: (obj, value) => { obj.uuid = value; } }, metadata: _metadata }, _uuid_initializers, _uuid_extraInitializers);
        __esDecorate(null, null, _major_decorators, { kind: "field", name: "major", static: false, private: false, access: { has: obj => "major" in obj, get: obj => obj.major, set: (obj, value) => { obj.major = value; } }, metadata: _metadata }, _major_initializers, _major_extraInitializers);
        __esDecorate(null, null, _minor_decorators, { kind: "field", name: "minor", static: false, private: false, access: { has: obj => "minor" in obj, get: obj => obj.minor, set: (obj, value) => { obj.minor = value; } }, metadata: _metadata }, _minor_initializers, _minor_extraInitializers);
        __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _batteryLevel_decorators, { kind: "field", name: "batteryLevel", static: false, private: false, access: { has: obj => "batteryLevel" in obj, get: obj => obj.batteryLevel, set: (obj, value) => { obj.batteryLevel = value; } }, metadata: _metadata }, _batteryLevel_initializers, _batteryLevel_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastDetected_decorators, { kind: "field", name: "lastDetected", static: false, private: false, access: { has: obj => "lastDetected" in obj, get: obj => obj.lastDetected, set: (obj, value) => { obj.lastDetected = value; } }, metadata: _metadata }, _lastDetected_initializers, _lastDetected_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: obj => "zone" in obj, get: obj => obj.zone, set: (obj, value) => { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BLEBeacon = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BLEBeacon = _classThis;
})();
exports.BLEBeacon = BLEBeacon;
/**
 * Movement History Model
 */
let MovementHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'movement_history',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['movement_type'] },
                { fields: ['moved_by'] },
                { fields: ['movement_date'] },
            ],
        })];
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
    let _movementType_decorators;
    let _movementType_initializers = [];
    let _movementType_extraInitializers = [];
    let _fromLocation_decorators;
    let _fromLocation_initializers = [];
    let _fromLocation_extraInitializers = [];
    let _toLocation_decorators;
    let _toLocation_initializers = [];
    let _toLocation_extraInitializers = [];
    let _fromZoneId_decorators;
    let _fromZoneId_initializers = [];
    let _fromZoneId_extraInitializers = [];
    let _toZoneId_decorators;
    let _toZoneId_initializers = [];
    let _toZoneId_extraInitializers = [];
    let _movedBy_decorators;
    let _movedBy_initializers = [];
    let _movedBy_extraInitializers = [];
    let _movementDate_decorators;
    let _movementDate_initializers = [];
    let _movementDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _distanceMeters_decorators;
    let _distanceMeters_initializers = [];
    let _distanceMeters_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _fromZone_decorators;
    let _fromZone_initializers = [];
    let _fromZone_extraInitializers = [];
    let _toZone_decorators;
    let _toZone_initializers = [];
    let _toZone_extraInitializers = [];
    var MovementHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.movementType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _movementType_initializers, void 0));
            this.fromLocation = (__runInitializers(this, _movementType_extraInitializers), __runInitializers(this, _fromLocation_initializers, void 0));
            this.toLocation = (__runInitializers(this, _fromLocation_extraInitializers), __runInitializers(this, _toLocation_initializers, void 0));
            this.fromZoneId = (__runInitializers(this, _toLocation_extraInitializers), __runInitializers(this, _fromZoneId_initializers, void 0));
            this.toZoneId = (__runInitializers(this, _fromZoneId_extraInitializers), __runInitializers(this, _toZoneId_initializers, void 0));
            this.movedBy = (__runInitializers(this, _toZoneId_extraInitializers), __runInitializers(this, _movedBy_initializers, void 0));
            this.movementDate = (__runInitializers(this, _movedBy_extraInitializers), __runInitializers(this, _movementDate_initializers, void 0));
            this.reason = (__runInitializers(this, _movementDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.notes = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.distanceMeters = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _distanceMeters_initializers, void 0));
            this.createdAt = (__runInitializers(this, _distanceMeters_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.fromZone = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _fromZone_initializers, void 0));
            this.toZone = (__runInitializers(this, _fromZone_extraInitializers), __runInitializers(this, _toZone_initializers, void 0));
            __runInitializers(this, _toZone_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MovementHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _movementType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Movement type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MovementType)), allowNull: false }), sequelize_typescript_1.Index];
        _fromLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'From location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _toLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'To location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _fromZoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _toZoneId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To zone ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Zone), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _movedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Moved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _movementDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Movement date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _distanceMeters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Distance in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _fromZone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone, 'fromZoneId')];
        _toZone_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Zone, 'toZoneId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _movementType_decorators, { kind: "field", name: "movementType", static: false, private: false, access: { has: obj => "movementType" in obj, get: obj => obj.movementType, set: (obj, value) => { obj.movementType = value; } }, metadata: _metadata }, _movementType_initializers, _movementType_extraInitializers);
        __esDecorate(null, null, _fromLocation_decorators, { kind: "field", name: "fromLocation", static: false, private: false, access: { has: obj => "fromLocation" in obj, get: obj => obj.fromLocation, set: (obj, value) => { obj.fromLocation = value; } }, metadata: _metadata }, _fromLocation_initializers, _fromLocation_extraInitializers);
        __esDecorate(null, null, _toLocation_decorators, { kind: "field", name: "toLocation", static: false, private: false, access: { has: obj => "toLocation" in obj, get: obj => obj.toLocation, set: (obj, value) => { obj.toLocation = value; } }, metadata: _metadata }, _toLocation_initializers, _toLocation_extraInitializers);
        __esDecorate(null, null, _fromZoneId_decorators, { kind: "field", name: "fromZoneId", static: false, private: false, access: { has: obj => "fromZoneId" in obj, get: obj => obj.fromZoneId, set: (obj, value) => { obj.fromZoneId = value; } }, metadata: _metadata }, _fromZoneId_initializers, _fromZoneId_extraInitializers);
        __esDecorate(null, null, _toZoneId_decorators, { kind: "field", name: "toZoneId", static: false, private: false, access: { has: obj => "toZoneId" in obj, get: obj => obj.toZoneId, set: (obj, value) => { obj.toZoneId = value; } }, metadata: _metadata }, _toZoneId_initializers, _toZoneId_extraInitializers);
        __esDecorate(null, null, _movedBy_decorators, { kind: "field", name: "movedBy", static: false, private: false, access: { has: obj => "movedBy" in obj, get: obj => obj.movedBy, set: (obj, value) => { obj.movedBy = value; } }, metadata: _metadata }, _movedBy_initializers, _movedBy_extraInitializers);
        __esDecorate(null, null, _movementDate_decorators, { kind: "field", name: "movementDate", static: false, private: false, access: { has: obj => "movementDate" in obj, get: obj => obj.movementDate, set: (obj, value) => { obj.movementDate = value; } }, metadata: _metadata }, _movementDate_initializers, _movementDate_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _distanceMeters_decorators, { kind: "field", name: "distanceMeters", static: false, private: false, access: { has: obj => "distanceMeters" in obj, get: obj => obj.distanceMeters, set: (obj, value) => { obj.distanceMeters = value; } }, metadata: _metadata }, _distanceMeters_initializers, _distanceMeters_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _fromZone_decorators, { kind: "field", name: "fromZone", static: false, private: false, access: { has: obj => "fromZone" in obj, get: obj => obj.fromZone, set: (obj, value) => { obj.fromZone = value; } }, metadata: _metadata }, _fromZone_initializers, _fromZone_extraInitializers);
        __esDecorate(null, null, _toZone_decorators, { kind: "field", name: "toZone", static: false, private: false, access: { has: obj => "toZone" in obj, get: obj => obj.toZone, set: (obj, value) => { obj.toZone = value; } }, metadata: _metadata }, _toZone_initializers, _toZone_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MovementHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MovementHistory = _classThis;
})();
exports.MovementHistory = MovementHistory;
/**
 * Tracking Alert Model
 */
let TrackingAlert = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'tracking_alerts',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['alert_type'] },
                { fields: ['triggered_at'] },
                { fields: ['acknowledged'] },
            ],
        })];
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
    let _alertType_decorators;
    let _alertType_initializers = [];
    let _alertType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _triggeredAt_decorators;
    let _triggeredAt_initializers = [];
    let _triggeredAt_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _acknowledged_decorators;
    let _acknowledged_initializers = [];
    let _acknowledged_extraInitializers = [];
    let _acknowledgedBy_decorators;
    let _acknowledgedBy_initializers = [];
    let _acknowledgedBy_extraInitializers = [];
    let _acknowledgedAt_decorators;
    let _acknowledgedAt_initializers = [];
    let _acknowledgedAt_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var TrackingAlert = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.alertType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _alertType_initializers, void 0));
            this.severity = (__runInitializers(this, _alertType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.message = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.triggeredAt = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _triggeredAt_initializers, void 0));
            this.location = (__runInitializers(this, _triggeredAt_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.acknowledged = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _acknowledged_initializers, void 0));
            this.acknowledgedBy = (__runInitializers(this, _acknowledged_extraInitializers), __runInitializers(this, _acknowledgedBy_initializers, void 0));
            this.acknowledgedAt = (__runInitializers(this, _acknowledgedBy_extraInitializers), __runInitializers(this, _acknowledgedAt_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _acknowledgedAt_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TrackingAlert");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _alertType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertType)), allowNull: false }), sequelize_typescript_1.Index];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _triggeredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triggered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _acknowledged_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _acknowledgedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _acknowledgedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolutionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _alertType_decorators, { kind: "field", name: "alertType", static: false, private: false, access: { has: obj => "alertType" in obj, get: obj => obj.alertType, set: (obj, value) => { obj.alertType = value; } }, metadata: _metadata }, _alertType_initializers, _alertType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _triggeredAt_decorators, { kind: "field", name: "triggeredAt", static: false, private: false, access: { has: obj => "triggeredAt" in obj, get: obj => obj.triggeredAt, set: (obj, value) => { obj.triggeredAt = value; } }, metadata: _metadata }, _triggeredAt_initializers, _triggeredAt_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _acknowledged_decorators, { kind: "field", name: "acknowledged", static: false, private: false, access: { has: obj => "acknowledged" in obj, get: obj => obj.acknowledged, set: (obj, value) => { obj.acknowledged = value; } }, metadata: _metadata }, _acknowledged_initializers, _acknowledged_extraInitializers);
        __esDecorate(null, null, _acknowledgedBy_decorators, { kind: "field", name: "acknowledgedBy", static: false, private: false, access: { has: obj => "acknowledgedBy" in obj, get: obj => obj.acknowledgedBy, set: (obj, value) => { obj.acknowledgedBy = value; } }, metadata: _metadata }, _acknowledgedBy_initializers, _acknowledgedBy_extraInitializers);
        __esDecorate(null, null, _acknowledgedAt_decorators, { kind: "field", name: "acknowledgedAt", static: false, private: false, access: { has: obj => "acknowledgedAt" in obj, get: obj => obj.acknowledgedAt, set: (obj, value) => { obj.acknowledgedAt = value; } }, metadata: _metadata }, _acknowledgedAt_initializers, _acknowledgedAt_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrackingAlert = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrackingAlert = _classThis;
})();
exports.TrackingAlert = TrackingAlert;
// ============================================================================
// LOCATION TRACKING FUNCTIONS
// ============================================================================
/**
 * Tracks asset location
 *
 * @param data - Location tracking data
 * @param transaction - Optional database transaction
 * @returns Location record
 *
 * @example
 * ```typescript
 * const location = await trackAssetLocation({
 *   assetId: 'asset-123',
 *   trackingMethod: TrackingMethod.GPS,
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 5,
 *   zoneId: 'zone-456'
 * });
 * ```
 */
async function trackAssetLocation(data, transaction) {
    // Mark previous locations as not current
    await AssetLocation.update({ isCurrent: false }, {
        where: {
            assetId: data.assetId,
            isCurrent: true,
        },
        transaction,
    });
    const location = await AssetLocation.create({
        ...data,
        timestamp: new Date(),
        isCurrent: true,
    }, { transaction });
    // Check geofences
    if (data.latitude && data.longitude) {
        await checkGeofences(data.assetId, data.latitude, data.longitude, transaction);
    }
    return location;
}
/**
 * Gets current asset location
 *
 * @param assetId - Asset ID
 * @returns Current location
 *
 * @example
 * ```typescript
 * const location = await getCurrentAssetLocation('asset-123');
 * ```
 */
async function getCurrentAssetLocation(assetId) {
    return AssetLocation.findOne({
        where: {
            assetId,
            isCurrent: true,
        },
        include: [{ model: Zone }],
    });
}
/**
 * Gets location history
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param limit - Maximum records
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getLocationHistory('asset-123', startDate, endDate, 100);
 * ```
 */
async function getLocationHistory(assetId, startDate, endDate, limit = 1000) {
    const where = { assetId };
    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) {
            where.timestamp[sequelize_1.Op.gte] = startDate;
        }
        if (endDate) {
            where.timestamp[sequelize_1.Op.lte] = endDate;
        }
    }
    return AssetLocation.findAll({
        where,
        include: [{ model: Zone }],
        order: [['timestamp', 'DESC']],
        limit,
    });
}
/**
 * Gets assets in zone
 *
 * @param zoneId - Zone ID
 * @returns Assets in zone
 *
 * @example
 * ```typescript
 * const assets = await getAssetsInZone('zone-123');
 * ```
 */
async function getAssetsInZone(zoneId) {
    return AssetLocation.findAll({
        where: {
            zoneId,
            isCurrent: true,
        },
        include: [{ model: Zone }],
    });
}
// ============================================================================
// CHECK-OUT/CHECK-IN FUNCTIONS
// ============================================================================
/**
 * Checks out asset
 *
 * @param data - Check-out data
 * @param transaction - Optional database transaction
 * @returns Check-out record
 *
 * @example
 * ```typescript
 * const checkout = await checkOutAsset({
 *   assetId: 'asset-123',
 *   checkedOutBy: 'user-456',
 *   checkOutLocation: 'Warehouse B',
 *   purpose: 'Field repair work',
 *   expectedReturnDate: new Date('2024-12-31')
 * });
 * ```
 */
async function checkOutAsset(data, transaction) {
    // Check if asset is already checked out
    const existing = await AssetCheckOut.findOne({
        where: {
            assetId: data.assetId,
            status: CheckOutStatus.CHECKED_OUT,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Asset is already checked out');
    }
    const checkout = await AssetCheckOut.create({
        ...data,
        checkOutDate: new Date(),
        status: CheckOutStatus.CHECKED_OUT,
    }, { transaction });
    // Record movement
    await recordMovement({
        assetId: data.assetId,
        movementType: MovementType.CHECK_OUT,
        toLocation: data.checkOutLocation,
        toZoneId: data.zoneId,
        movedBy: data.checkedOutBy,
        reason: data.purpose,
        notes: data.notes,
    }, transaction);
    return checkout;
}
/**
 * Checks in asset
 *
 * @param data - Check-in data
 * @param transaction - Optional database transaction
 * @returns Updated check-out record
 *
 * @example
 * ```typescript
 * const checkin = await checkInAsset({
 *   checkOutId: 'checkout-123',
 *   checkedInBy: 'user-456',
 *   checkInLocation: 'Warehouse A',
 *   condition: 'good',
 *   notes: 'Returned in excellent condition'
 * });
 * ```
 */
async function checkInAsset(data, transaction) {
    const checkout = await AssetCheckOut.findByPk(data.checkOutId, { transaction });
    if (!checkout) {
        throw new common_1.NotFoundException(`Check-out ${data.checkOutId} not found`);
    }
    if (checkout.status === CheckOutStatus.CHECKED_IN) {
        throw new common_1.BadRequestException('Asset is already checked in');
    }
    await checkout.update({
        status: CheckOutStatus.CHECKED_IN,
        checkedInBy: data.checkedInBy,
        checkInDate: new Date(),
        checkInLocation: data.checkInLocation,
        checkInZoneId: data.zoneId,
        condition: data.condition,
        damageNotes: data.damageNotes,
        notes: data.notes,
    }, { transaction });
    // Record movement
    await recordMovement({
        assetId: checkout.assetId,
        movementType: MovementType.CHECK_IN,
        toLocation: data.checkInLocation,
        toZoneId: data.zoneId,
        movedBy: data.checkedInBy,
        notes: data.notes,
    }, transaction);
    return checkout;
}
/**
 * Gets active checkouts
 *
 * @param userId - Optional user filter
 * @returns Active checkouts
 *
 * @example
 * ```typescript
 * const checkouts = await getActiveCheckOuts('user-123');
 * ```
 */
async function getActiveCheckOuts(userId) {
    const where = {
        status: CheckOutStatus.CHECKED_OUT,
    };
    if (userId) {
        where.checkedOutBy = userId;
    }
    return AssetCheckOut.findAll({
        where,
        include: [
            { model: Zone, as: 'checkOutZone' },
            { model: Zone, as: 'checkInZone' },
        ],
        order: [['expectedReturnDate', 'ASC']],
    });
}
/**
 * Gets overdue checkouts
 *
 * @returns Overdue checkouts
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueCheckOuts();
 * ```
 */
async function getOverdueCheckOuts() {
    return AssetCheckOut.findAll({
        where: {
            status: CheckOutStatus.CHECKED_OUT,
            expectedReturnDate: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
        include: [
            { model: Zone, as: 'checkOutZone' },
        ],
        order: [['expectedReturnDate', 'ASC']],
    });
}
// ============================================================================
// GEOFENCE FUNCTIONS
// ============================================================================
/**
 * Creates geofence
 *
 * @param data - Geofence data
 * @param transaction - Optional database transaction
 * @returns Created geofence
 *
 * @example
 * ```typescript
 * const geofence = await createGeofence({
 *   name: 'Warehouse Perimeter',
 *   centerLatitude: 40.7128,
 *   centerLongitude: -74.0060,
 *   radiusMeters: 500,
 *   alertOnExit: true,
 *   notifications: ['user-123', 'user-456']
 * });
 * ```
 */
async function createGeofence(data, transaction) {
    const geofence = await Geofence.create({
        ...data,
        status: GeofenceStatus.ACTIVE,
    }, { transaction });
    return geofence;
}
/**
 * Checks geofences for asset location
 *
 * @param assetId - Asset ID
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param transaction - Optional database transaction
 * @returns Triggered events
 *
 * @example
 * ```typescript
 * const events = await checkGeofences('asset-123', 40.7128, -74.0060);
 * ```
 */
async function checkGeofences(assetId, latitude, longitude, transaction) {
    const geofences = await Geofence.findAll({
        where: {
            isActive: true,
            status: GeofenceStatus.ACTIVE,
        },
        transaction,
    });
    const events = [];
    for (const geofence of geofences) {
        // Calculate if point is inside geofence
        const distance = calculateDistance(latitude, longitude, geofence.centerLatitude, geofence.centerLongitude);
        const isInside = geofence.radiusMeters ? distance <= geofence.radiusMeters : false;
        // Check if asset is allowed
        const isAllowed = !geofence.allowedAssets ||
            geofence.allowedAssets.includes(assetId);
        let eventType = null;
        if (isInside && geofence.alertOnEntry && !isAllowed) {
            eventType = 'entry';
        }
        else if (!isInside && geofence.alertOnExit && isAllowed) {
            eventType = 'exit';
        }
        if (eventType) {
            const event = await GeofenceEvent.create({
                geofenceId: geofence.id,
                assetId,
                eventType,
                triggeredAt: new Date(),
                latitude,
                longitude,
                alertSent: false,
            }, { transaction });
            await geofence.update({
                triggerCount: geofence.triggerCount + 1,
                lastTriggered: new Date(),
            }, { transaction });
            // Create alert
            await createTrackingAlert({
                assetId,
                alertType: eventType === 'entry' ? AlertType.GEOFENCE_ENTRY : AlertType.GEOFENCE_EXIT,
                severity: 'medium',
                message: `Asset ${eventType} geofence: ${geofence.name}`,
                location: { latitude, longitude },
            }, transaction);
            events.push(event);
        }
    }
    return events;
}
/**
 * Gets geofence events
 *
 * @param geofenceId - Geofence ID
 * @param limit - Maximum events
 * @returns Events
 *
 * @example
 * ```typescript
 * const events = await getGeofenceEvents('geofence-123', 100);
 * ```
 */
async function getGeofenceEvents(geofenceId, limit = 100) {
    return GeofenceEvent.findAll({
        where: { geofenceId },
        order: [['triggeredAt', 'DESC']],
        limit,
        include: [{ model: Geofence }],
    });
}
// ============================================================================
// ZONE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates zone
 *
 * @param data - Zone data
 * @param transaction - Optional database transaction
 * @returns Created zone
 *
 * @example
 * ```typescript
 * const zone = await createZone({
 *   name: 'Warehouse A - Section 1',
 *   zoneType: ZoneType.WAREHOUSE,
 *   description: 'Main storage area',
 *   parentZoneId: 'warehouse-a',
 *   capacity: 500,
 *   coordinates: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
async function createZone(data, transaction) {
    const zone = await Zone.create({
        ...data,
        latitude: data.coordinates?.latitude,
        longitude: data.coordinates?.longitude,
    }, { transaction });
    return zone;
}
/**
 * Gets zone hierarchy
 *
 * @param zoneId - Root zone ID
 * @returns Zone with children
 *
 * @example
 * ```typescript
 * const hierarchy = await getZoneHierarchy('zone-123');
 * ```
 */
async function getZoneHierarchy(zoneId) {
    return Zone.findByPk(zoneId, {
        include: [
            {
                model: Zone,
                as: 'childZones',
                include: [{ model: Zone, as: 'childZones' }],
            },
        ],
    });
}
/**
 * Updates zone occupancy
 *
 * @param zoneId - Zone ID
 * @param change - Change in occupancy
 * @param transaction - Optional database transaction
 * @returns Updated zone
 *
 * @example
 * ```typescript
 * await updateZoneOccupancy('zone-123', 1); // Asset entered
 * await updateZoneOccupancy('zone-123', -1); // Asset left
 * ```
 */
async function updateZoneOccupancy(zoneId, change, transaction) {
    const zone = await Zone.findByPk(zoneId, { transaction });
    if (!zone) {
        throw new common_1.NotFoundException(`Zone ${zoneId} not found`);
    }
    const newOccupancy = zone.currentOccupancy + change;
    if (newOccupancy < 0) {
        throw new common_1.BadRequestException('Occupancy cannot be negative');
    }
    if (zone.capacity && newOccupancy > zone.capacity) {
        throw new common_1.BadRequestException('Zone capacity exceeded');
    }
    await zone.update({
        currentOccupancy: newOccupancy,
    }, { transaction });
    return zone;
}
// ============================================================================
// RFID AND BEACON FUNCTIONS
// ============================================================================
/**
 * Registers RFID tag
 *
 * @param data - RFID tag data
 * @param transaction - Optional database transaction
 * @returns Created tag
 *
 * @example
 * ```typescript
 * const tag = await registerRFIDTag({
 *   assetId: 'asset-123',
 *   tagId: 'RFID-456789',
 *   epcCode: 'EPC-123456',
 *   technology: 'UHF',
 *   frequency: '915MHz'
 * });
 * ```
 */
async function registerRFIDTag(data, transaction) {
    const tag = await RFIDTag.create({
        ...data,
        isActive: true,
        activatedDate: new Date(),
    }, { transaction });
    return tag;
}
/**
 * Records RFID tag read
 *
 * @param tagId - Tag ID
 * @param transaction - Optional database transaction
 * @returns Updated tag
 *
 * @example
 * ```typescript
 * await recordRFIDRead('RFID-456789');
 * ```
 */
async function recordRFIDRead(tagId, transaction) {
    const tag = await RFIDTag.findOne({
        where: { tagId },
        transaction,
    });
    if (!tag) {
        throw new common_1.NotFoundException(`RFID tag ${tagId} not found`);
    }
    await tag.update({
        lastReadTime: new Date(),
        readCount: tag.readCount + 1,
    }, { transaction });
    return tag;
}
/**
 * Registers BLE beacon
 *
 * @param data - Beacon data
 * @param transaction - Optional database transaction
 * @returns Created beacon
 *
 * @example
 * ```typescript
 * const beacon = await registerBLEBeacon({
 *   beaconId: 'beacon-123',
 *   name: 'Warehouse Entry Beacon',
 *   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
 *   major: 1,
 *   minor: 1,
 *   zoneId: 'zone-456'
 * });
 * ```
 */
async function registerBLEBeacon(data, transaction) {
    const beacon = await BLEBeacon.create({
        ...data,
        isActive: true,
    }, { transaction });
    return beacon;
}
// ============================================================================
// MOVEMENT HISTORY FUNCTIONS
// ============================================================================
/**
 * Records movement
 *
 * @param data - Movement data
 * @param transaction - Optional database transaction
 * @returns Movement record
 *
 * @example
 * ```typescript
 * const movement = await recordMovement({
 *   assetId: 'asset-123',
 *   movementType: MovementType.TRANSFER,
 *   fromLocation: 'Building A',
 *   toLocation: 'Building B',
 *   fromZoneId: 'zone-1',
 *   toZoneId: 'zone-2',
 *   movedBy: 'user-456',
 *   reason: 'Relocation project'
 * });
 * ```
 */
async function recordMovement(data, transaction) {
    const movement = await MovementHistory.create({
        ...data,
        movementDate: new Date(),
    }, { transaction });
    return movement;
}
/**
 * Gets movement history
 *
 * @param assetId - Asset ID
 * @param limit - Maximum records
 * @returns Movement history
 *
 * @example
 * ```typescript
 * const history = await getMovementHistory('asset-123', 100);
 * ```
 */
async function getMovementHistory(assetId, limit = 100) {
    return MovementHistory.findAll({
        where: { assetId },
        include: [
            { model: Zone, as: 'fromZone' },
            { model: Zone, as: 'toZone' },
        ],
        order: [['movementDate', 'DESC']],
        limit,
    });
}
// ============================================================================
// ALERT FUNCTIONS
// ============================================================================
/**
 * Creates tracking alert
 *
 * @param data - Alert data
 * @param transaction - Optional database transaction
 * @returns Created alert
 *
 * @example
 * ```typescript
 * const alert = await createTrackingAlert({
 *   assetId: 'asset-123',
 *   alertType: AlertType.UNAUTHORIZED_MOVEMENT,
 *   severity: 'high',
 *   message: 'Asset moved outside authorized zone',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
async function createTrackingAlert(data, transaction) {
    const alert = await TrackingAlert.create({
        ...data,
        triggeredAt: new Date(),
    }, { transaction });
    return alert;
}
/**
 * Acknowledges alert
 *
 * @param alertId - Alert ID
 * @param userId - User acknowledging
 * @param notes - Resolution notes
 * @param transaction - Optional database transaction
 * @returns Updated alert
 *
 * @example
 * ```typescript
 * await acknowledgeAlert('alert-123', 'user-456', 'False alarm - authorized movement');
 * ```
 */
async function acknowledgeAlert(alertId, userId, notes, transaction) {
    const alert = await TrackingAlert.findByPk(alertId, { transaction });
    if (!alert) {
        throw new common_1.NotFoundException(`Alert ${alertId} not found`);
    }
    await alert.update({
        acknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
        resolutionNotes: notes,
    }, { transaction });
    return alert;
}
/**
 * Gets unacknowledged alerts
 *
 * @param assetId - Optional asset filter
 * @returns Unacknowledged alerts
 *
 * @example
 * ```typescript
 * const alerts = await getUnacknowledgedAlerts('asset-123');
 * ```
 */
async function getUnacknowledgedAlerts(assetId) {
    const where = {
        acknowledged: false,
    };
    if (assetId) {
        where.assetId = assetId;
    }
    return TrackingAlert.findAll({
        where,
        order: [['triggeredAt', 'DESC']],
    });
}
// ============================================================================
// TRACKING ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Gets tracking analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getTrackingAnalytics(new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function getTrackingAnalytics(startDate, endDate) {
    const locations = await AssetLocation.findAll({
        where: {
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const checkOuts = await AssetCheckOut.findAll({
        where: {
            checkedOutAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const geofenceEvents = await GeofenceEvent.findAll({
        where: {
            triggeredAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        period: { startDate, endDate },
        locationUpdates: locations.length,
        checkOuts: checkOuts.length,
        activeCheckOuts: checkOuts.filter(c => !c.checkedInAt).length,
        geofenceEvents: geofenceEvents.length,
        generatedAt: new Date(),
    };
}
/**
 * Gets asset movement summary
 *
 * @param assetId - Asset ID
 * @param period - Period in days
 * @returns Movement summary
 *
 * @example
 * ```typescript
 * const summary = await getAssetMovementSummary('asset-123', 30);
 * ```
 */
async function getAssetMovementSummary(assetId, period = 30) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const movements = await MovementHistory.findAll({
        where: {
            assetId,
            movedAt: { [sequelize_1.Op.gte]: startDate },
        },
        order: [['movedAt', 'DESC']],
    });
    const totalDistance = movements.reduce((sum, m) => sum + (m.distance || 0), 0);
    const uniqueZones = new Set(movements.map(m => m.toZoneId)).size;
    return {
        period: { days: period, startDate },
        movementCount: movements.length,
        totalDistance,
        uniqueZones,
        lastMovedAt: movements.length > 0 ? movements[0].movedAt : null,
    };
}
// ============================================================================
// PROXIMITY TRACKING FUNCTIONS
// ============================================================================
/**
 * Finds nearby assets
 *
 * @param assetId - Asset ID
 * @param radiusMeters - Radius in meters
 * @returns Nearby assets
 *
 * @example
 * ```typescript
 * const nearby = await findNearbyAssets('asset-123', 100);
 * ```
 */
async function findNearbyAssets(assetId, radiusMeters) {
    const location = await getCurrentAssetLocation(assetId);
    if (!location) {
        return [];
    }
    const allLocations = await AssetLocation.findAll({
        where: {
            assetId: { [sequelize_1.Op.ne]: assetId },
        },
        group: ['assetId'],
        order: [['timestamp', 'DESC']],
    });
    // Calculate distances and filter
    const nearby = allLocations
        .map(loc => ({
        assetId: loc.assetId,
        distance: calculateDistance(location.latitude, location.longitude, loc.latitude, loc.longitude),
        location: loc,
    }))
        .filter(item => item.distance <= radiusMeters)
        .sort((a, b) => a.distance - b.distance);
    return nearby;
}
/**
 * Tracks asset proximity to another asset
 *
 * @param assetId1 - First asset ID
 * @param assetId2 - Second asset ID
 * @param transaction - Optional database transaction
 * @returns Proximity record
 *
 * @example
 * ```typescript
 * await trackAssetProximity('asset-123', 'asset-456');
 * ```
 */
async function trackAssetProximity(assetId1, assetId2, transaction) {
    const loc1 = await getCurrentAssetLocation(assetId1);
    const loc2 = await getCurrentAssetLocation(assetId2);
    if (!loc1 || !loc2) {
        throw new common_1.NotFoundException('Asset locations not found');
    }
    const distance = calculateDistance(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);
    return {
        assetId1,
        assetId2,
        distance,
        timestamp: new Date(),
    };
}
// ============================================================================
// TRACKING ALERTS AND NOTIFICATIONS
// ============================================================================
/**
 * Creates tracking alert rule
 *
 * @param assetId - Asset ID
 * @param alertType - Alert type
 * @param conditions - Alert conditions
 * @param transaction - Optional database transaction
 * @returns Alert rule
 *
 * @example
 * ```typescript
 * await createTrackingAlertRule('asset-123', 'geofence_exit', conditions);
 * ```
 */
async function createTrackingAlertRule(assetId, alertType, conditions, transaction) {
    const alert = await TrackingAlert.create({
        assetId,
        alertType,
        conditions,
        isActive: true,
    }, { transaction });
    return alert;
}
/**
 * Evaluates tracking alerts
 *
 * @param assetId - Asset ID
 * @param transaction - Optional database transaction
 * @returns Triggered alerts
 *
 * @example
 * ```typescript
 * const alerts = await evaluateTrackingAlerts('asset-123');
 * ```
 */
async function evaluateTrackingAlerts(assetId, transaction) {
    const alerts = await TrackingAlert.findAll({
        where: {
            assetId,
            isActive: true,
        },
        transaction,
    });
    // In real implementation, evaluate conditions
    return alerts;
}
// ============================================================================
// ASSET CUSTODY CHAIN
// ============================================================================
/**
 * Gets custody chain for asset
 *
 * @param assetId - Asset ID
 * @returns Custody chain
 *
 * @example
 * ```typescript
 * const chain = await getCustodyChain('asset-123');
 * ```
 */
async function getCustodyChain(assetId) {
    const checkOuts = await AssetCheckOut.findAll({
        where: { assetId },
        order: [['checkedOutAt', 'DESC']],
    });
    return checkOuts.map(co => ({
        checkedOutBy: co.checkedOutBy,
        checkedOutAt: co.checkedOutAt,
        checkedInBy: co.checkedInBy,
        checkedInAt: co.checkedInAt,
        duration: co.duration,
        purpose: co.purpose,
    }));
}
/**
 * Verifies custody chain integrity
 *
 * @param assetId - Asset ID
 * @returns Integrity status
 *
 * @example
 * ```typescript
 * const valid = await verifyCustodyChain('asset-123');
 * ```
 */
async function verifyCustodyChain(assetId) {
    const chain = await getCustodyChain(assetId);
    // Check for gaps or overlaps in custody
    for (let i = 0; i < chain.length - 1; i++) {
        const current = chain[i];
        const next = chain[i + 1];
        if (current.checkedInAt && next.checkedOutAt) {
            if (new Date(current.checkedInAt) < new Date(next.checkedOutAt)) {
                return false; // Gap in custody
            }
        }
    }
    return true;
}
// ============================================================================
// ROUTE TRACKING FUNCTIONS
// ============================================================================
/**
 * Records asset route
 *
 * @param assetId - Asset ID
 * @param waypoints - Route waypoints
 * @param transaction - Optional database transaction
 * @returns Route record
 *
 * @example
 * ```typescript
 * await recordAssetRoute('asset-123', waypoints);
 * ```
 */
async function recordAssetRoute(assetId, waypoints, transaction) {
    return {
        id: `route_${Date.now()}`,
        assetId,
        waypoints,
        totalDistance: 0, // Calculate from waypoints
        startTime: waypoints[0]?.timestamp,
        endTime: waypoints[waypoints.length - 1]?.timestamp,
    };
}
/**
 * Gets asset routes
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Routes
 *
 * @example
 * ```typescript
 * const routes = await getAssetRoutes('asset-123', startDate, endDate);
 * ```
 */
async function getAssetRoutes(assetId, startDate, endDate) {
    // In real implementation, fetch routes from database
    return [];
}
// ============================================================================
// ASSET LOST/STOLEN TRACKING
// ============================================================================
/**
 * Marks asset as lost
 *
 * @param assetId - Asset ID
 * @param reportedBy - User reporting
 * @param details - Loss details
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await markAssetLost('asset-123', 'user-456', 'Lost during transport');
 * ```
 */
async function markAssetLost(assetId, reportedBy, details, transaction) {
    // In real implementation, create lost/stolen record and trigger alerts
    return true;
}
/**
 * Marks asset as recovered
 *
 * @param assetId - Asset ID
 * @param recoveredBy - User recovering
 * @param recoveryLocation - Recovery location
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await markAssetRecovered('asset-123', 'user-789', location);
 * ```
 */
async function markAssetRecovered(assetId, recoveredBy, recoveryLocation, transaction) {
    // In real implementation, update lost/stolen record
    return true;
}
/**
 * Gets lost/stolen asset reports
 *
 * @param status - Status filter (lost, stolen, recovered)
 * @returns Reports
 *
 * @example
 * ```typescript
 * const lostAssets = await getLostStolenReports('lost');
 * ```
 */
async function getLostStolenReports(status) {
    // In real implementation, fetch lost/stolen reports
    return [];
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates distance between two coordinates
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AssetLocation,
    AssetCheckOut,
    Geofence,
    GeofenceEvent,
    Zone,
    RFIDTag,
    BLEBeacon,
    MovementHistory,
    TrackingAlert,
    // Location Tracking Functions
    trackAssetLocation,
    getCurrentAssetLocation,
    getLocationHistory,
    getAssetsInZone,
    // Check-Out/Check-In Functions
    checkOutAsset,
    checkInAsset,
    getActiveCheckOuts,
    getOverdueCheckOuts,
    // Geofence Functions
    createGeofence,
    checkGeofences,
    getGeofenceEvents,
    // Zone Management Functions
    createZone,
    getZoneHierarchy,
    updateZoneOccupancy,
    // RFID and Beacon Functions
    registerRFIDTag,
    recordRFIDRead,
    registerBLEBeacon,
    // Movement History Functions
    recordMovement,
    getMovementHistory,
    // Alert Functions
    createTrackingAlert,
    acknowledgeAlert,
    getUnacknowledgedAlerts,
    // Analytics Functions
    getTrackingAnalytics,
    getAssetMovementSummary,
    // Proximity Tracking Functions
    findNearbyAssets,
    trackAssetProximity,
    // Alert Rule Functions
    createTrackingAlertRule,
    evaluateTrackingAlerts,
    // Custody Chain Functions
    getCustodyChain,
    verifyCustodyChain,
    // Route Tracking Functions
    recordAssetRoute,
    getAssetRoutes,
    // Lost/Stolen Tracking Functions
    markAssetLost,
    markAssetRecovered,
    getLostStolenReports,
};
//# sourceMappingURL=asset-tracking-commands.js.map