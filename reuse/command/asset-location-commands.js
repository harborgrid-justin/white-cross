"use strict";
/**
 * ASSET LOCATION MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset location management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive location tracking including:
 * - Location hierarchy management (facilities, buildings, floors, rooms, zones)
 * - Location assignment and real-time tracking
 * - Location capacity tracking and optimization
 * - Location-based asset searching and filtering
 * - Geofencing and boundary management
 * - GPS tracking and coordinate management
 * - Complete location history and audit trails
 * - Sublocation management and nesting
 * - Location tree structures and navigation
 * - Space utilization analytics
 * - Location-based access control
 * - Environmental conditions monitoring
 *
 * @module AssetLocationCommands
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
 *   createLocation,
 *   assignAssetToLocation,
 *   trackAssetLocation,
 *   getLocationHierarchy,
 *   LocationType
 * } from './asset-location-commands';
 *
 * // Create location
 * const location = await createLocation({
 *   locationCode: 'BLD-A-FL3-RM301',
 *   locationName: 'Building A - Floor 3 - Room 301',
 *   locationType: LocationType.ROOM,
 *   parentLocationId: 'floor-3-id',
 *   capacity: 50,
 *   gpsCoordinates: { latitude: 40.7128, longitude: -74.0060 }
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
exports.GPSTrackingLog = exports.LocationGeofence = exports.AssetLocationHistory = exports.AssetLocation = exports.AccessLevel = exports.LocationStatus = exports.LocationType = void 0;
exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.getLocationById = getLocationById;
exports.getLocationHierarchy = getLocationHierarchy;
exports.getAllChildLocations = getAllChildLocations;
exports.searchLocations = searchLocations;
exports.assignAssetToLocation = assignAssetToLocation;
exports.removeAssetFromLocation = removeAssetFromLocation;
exports.getCurrentAssetLocation = getCurrentAssetLocation;
exports.getAssetLocationHistory = getAssetLocationHistory;
exports.getAssetsInLocation = getAssetsInLocation;
exports.calculateLocationUtilization = calculateLocationUtilization;
exports.findAvailableLocations = findAvailableLocations;
exports.optimizeLocationUtilization = optimizeLocationUtilization;
exports.recordGPSTracking = recordGPSTracking;
exports.getGPSTrackingHistory = getGPSTrackingHistory;
exports.createLocationGeofence = createLocationGeofence;
exports.isWithinGeofence = isWithinGeofence;
exports.getGeofenceViolations = getGeofenceViolations;
exports.generateLocationUtilizationReport = generateLocationUtilizationReport;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Location types
 */
var LocationType;
(function (LocationType) {
    LocationType["FACILITY"] = "facility";
    LocationType["BUILDING"] = "building";
    LocationType["FLOOR"] = "floor";
    LocationType["WING"] = "wing";
    LocationType["DEPARTMENT"] = "department";
    LocationType["ROOM"] = "room";
    LocationType["ZONE"] = "zone";
    LocationType["STORAGE_AREA"] = "storage_area";
    LocationType["WAREHOUSE"] = "warehouse";
    LocationType["SHELF"] = "shelf";
    LocationType["BIN"] = "bin";
    LocationType["LOCKER"] = "locker";
    LocationType["OUTDOOR_AREA"] = "outdoor_area";
    LocationType["VEHICLE"] = "vehicle";
    LocationType["MOBILE_UNIT"] = "mobile_unit";
})(LocationType || (exports.LocationType = LocationType = {}));
/**
 * Location status
 */
var LocationStatus;
(function (LocationStatus) {
    LocationStatus["ACTIVE"] = "active";
    LocationStatus["INACTIVE"] = "inactive";
    LocationStatus["UNDER_CONSTRUCTION"] = "under_construction";
    LocationStatus["UNDER_MAINTENANCE"] = "under_maintenance";
    LocationStatus["DECOMMISSIONED"] = "decommissioned";
    LocationStatus["TEMPORARY"] = "temporary";
})(LocationStatus || (exports.LocationStatus = LocationStatus = {}));
/**
 * Access level
 */
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["PUBLIC"] = "public";
    AccessLevel["RESTRICTED"] = "restricted";
    AccessLevel["CONFIDENTIAL"] = "confidential";
    AccessLevel["HIGHLY_RESTRICTED"] = "highly_restricted";
    AccessLevel["SECURE"] = "secure";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Location Model
 */
let AssetLocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_locations',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['location_code'], unique: true },
                { fields: ['location_type'] },
                { fields: ['parent_location_id'] },
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
    let _locationCode_decorators;
    let _locationCode_initializers = [];
    let _locationCode_extraInitializers = [];
    let _locationName_decorators;
    let _locationName_initializers = [];
    let _locationName_extraInitializers = [];
    let _locationType_decorators;
    let _locationType_initializers = [];
    let _locationType_extraInitializers = [];
    let _parentLocationId_decorators;
    let _parentLocationId_initializers = [];
    let _parentLocationId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _hierarchyPath_decorators;
    let _hierarchyPath_initializers = [];
    let _hierarchyPath_extraInitializers = [];
    let _hierarchyLevel_decorators;
    let _hierarchyLevel_initializers = [];
    let _hierarchyLevel_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _gpsCoordinates_decorators;
    let _gpsCoordinates_initializers = [];
    let _gpsCoordinates_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _currentOccupancy_decorators;
    let _currentOccupancy_initializers = [];
    let _currentOccupancy_extraInitializers = [];
    let _accessLevel_decorators;
    let _accessLevel_initializers = [];
    let _accessLevel_extraInitializers = [];
    let _environmentalConditions_decorators;
    let _environmentalConditions_initializers = [];
    let _environmentalConditions_extraInitializers = [];
    let _manager_decorators;
    let _manager_initializers = [];
    let _manager_extraInitializers = [];
    let _contactInfo_decorators;
    let _contactInfo_initializers = [];
    let _contactInfo_extraInitializers = [];
    let _operatingHours_decorators;
    let _operatingHours_initializers = [];
    let _operatingHours_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
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
    let _parentLocation_decorators;
    let _parentLocation_initializers = [];
    let _parentLocation_extraInitializers = [];
    let _childLocations_decorators;
    let _childLocations_initializers = [];
    let _childLocations_extraInitializers = [];
    let _locationHistory_decorators;
    let _locationHistory_initializers = [];
    let _locationHistory_extraInitializers = [];
    let _geofences_decorators;
    let _geofences_initializers = [];
    let _geofences_extraInitializers = [];
    var AssetLocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.locationCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _locationCode_initializers, void 0));
            this.locationName = (__runInitializers(this, _locationCode_extraInitializers), __runInitializers(this, _locationName_initializers, void 0));
            this.locationType = (__runInitializers(this, _locationName_extraInitializers), __runInitializers(this, _locationType_initializers, void 0));
            this.parentLocationId = (__runInitializers(this, _locationType_extraInitializers), __runInitializers(this, _parentLocationId_initializers, void 0));
            this.status = (__runInitializers(this, _parentLocationId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.description = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.hierarchyPath = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _hierarchyPath_initializers, void 0));
            this.hierarchyLevel = (__runInitializers(this, _hierarchyPath_extraInitializers), __runInitializers(this, _hierarchyLevel_initializers, void 0));
            this.address = (__runInitializers(this, _hierarchyLevel_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.gpsCoordinates = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _gpsCoordinates_initializers, void 0));
            this.dimensions = (__runInitializers(this, _gpsCoordinates_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
            this.capacity = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
            this.currentOccupancy = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _currentOccupancy_initializers, void 0));
            this.accessLevel = (__runInitializers(this, _currentOccupancy_extraInitializers), __runInitializers(this, _accessLevel_initializers, void 0));
            this.environmentalConditions = (__runInitializers(this, _accessLevel_extraInitializers), __runInitializers(this, _environmentalConditions_initializers, void 0));
            this.manager = (__runInitializers(this, _environmentalConditions_extraInitializers), __runInitializers(this, _manager_initializers, void 0));
            this.contactInfo = (__runInitializers(this, _manager_extraInitializers), __runInitializers(this, _contactInfo_initializers, void 0));
            this.operatingHours = (__runInitializers(this, _contactInfo_extraInitializers), __runInitializers(this, _operatingHours_initializers, void 0));
            this.isActive = (__runInitializers(this, _operatingHours_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.customFields = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.metadata = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.parentLocation = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _parentLocation_initializers, void 0));
            this.childLocations = (__runInitializers(this, _parentLocation_extraInitializers), __runInitializers(this, _childLocations_initializers, void 0));
            this.locationHistory = (__runInitializers(this, _childLocations_extraInitializers), __runInitializers(this, _locationHistory_initializers, void 0));
            this.geofences = (__runInitializers(this, _locationHistory_extraInitializers), __runInitializers(this, _geofences_initializers, void 0));
            __runInitializers(this, _geofences_extraInitializers);
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
        _locationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _locationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _locationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LocationType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _parentLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent location ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetLocation), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LocationStatus)),
                defaultValue: LocationStatus.ACTIVE,
            }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _hierarchyPath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Full hierarchical path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _hierarchyLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hierarchy level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _gpsCoordinates_decorators = [(0, swagger_1.ApiProperty)({ description: 'GPS coordinates' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimensions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _capacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Capacity (max assets)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _currentOccupancy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current occupancy' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _accessLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Access level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AccessLevel)) })];
        _environmentalConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environmental conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _manager_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location manager user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _contactInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact information' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _operatingHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Operating hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _parentLocation_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetLocation)];
        _childLocations_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetLocation)];
        _locationHistory_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetLocationHistory)];
        _geofences_decorators = [(0, sequelize_typescript_1.HasMany)(() => LocationGeofence)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _locationCode_decorators, { kind: "field", name: "locationCode", static: false, private: false, access: { has: obj => "locationCode" in obj, get: obj => obj.locationCode, set: (obj, value) => { obj.locationCode = value; } }, metadata: _metadata }, _locationCode_initializers, _locationCode_extraInitializers);
        __esDecorate(null, null, _locationName_decorators, { kind: "field", name: "locationName", static: false, private: false, access: { has: obj => "locationName" in obj, get: obj => obj.locationName, set: (obj, value) => { obj.locationName = value; } }, metadata: _metadata }, _locationName_initializers, _locationName_extraInitializers);
        __esDecorate(null, null, _locationType_decorators, { kind: "field", name: "locationType", static: false, private: false, access: { has: obj => "locationType" in obj, get: obj => obj.locationType, set: (obj, value) => { obj.locationType = value; } }, metadata: _metadata }, _locationType_initializers, _locationType_extraInitializers);
        __esDecorate(null, null, _parentLocationId_decorators, { kind: "field", name: "parentLocationId", static: false, private: false, access: { has: obj => "parentLocationId" in obj, get: obj => obj.parentLocationId, set: (obj, value) => { obj.parentLocationId = value; } }, metadata: _metadata }, _parentLocationId_initializers, _parentLocationId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _hierarchyPath_decorators, { kind: "field", name: "hierarchyPath", static: false, private: false, access: { has: obj => "hierarchyPath" in obj, get: obj => obj.hierarchyPath, set: (obj, value) => { obj.hierarchyPath = value; } }, metadata: _metadata }, _hierarchyPath_initializers, _hierarchyPath_extraInitializers);
        __esDecorate(null, null, _hierarchyLevel_decorators, { kind: "field", name: "hierarchyLevel", static: false, private: false, access: { has: obj => "hierarchyLevel" in obj, get: obj => obj.hierarchyLevel, set: (obj, value) => { obj.hierarchyLevel = value; } }, metadata: _metadata }, _hierarchyLevel_initializers, _hierarchyLevel_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _gpsCoordinates_decorators, { kind: "field", name: "gpsCoordinates", static: false, private: false, access: { has: obj => "gpsCoordinates" in obj, get: obj => obj.gpsCoordinates, set: (obj, value) => { obj.gpsCoordinates = value; } }, metadata: _metadata }, _gpsCoordinates_initializers, _gpsCoordinates_extraInitializers);
        __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
        __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
        __esDecorate(null, null, _currentOccupancy_decorators, { kind: "field", name: "currentOccupancy", static: false, private: false, access: { has: obj => "currentOccupancy" in obj, get: obj => obj.currentOccupancy, set: (obj, value) => { obj.currentOccupancy = value; } }, metadata: _metadata }, _currentOccupancy_initializers, _currentOccupancy_extraInitializers);
        __esDecorate(null, null, _accessLevel_decorators, { kind: "field", name: "accessLevel", static: false, private: false, access: { has: obj => "accessLevel" in obj, get: obj => obj.accessLevel, set: (obj, value) => { obj.accessLevel = value; } }, metadata: _metadata }, _accessLevel_initializers, _accessLevel_extraInitializers);
        __esDecorate(null, null, _environmentalConditions_decorators, { kind: "field", name: "environmentalConditions", static: false, private: false, access: { has: obj => "environmentalConditions" in obj, get: obj => obj.environmentalConditions, set: (obj, value) => { obj.environmentalConditions = value; } }, metadata: _metadata }, _environmentalConditions_initializers, _environmentalConditions_extraInitializers);
        __esDecorate(null, null, _manager_decorators, { kind: "field", name: "manager", static: false, private: false, access: { has: obj => "manager" in obj, get: obj => obj.manager, set: (obj, value) => { obj.manager = value; } }, metadata: _metadata }, _manager_initializers, _manager_extraInitializers);
        __esDecorate(null, null, _contactInfo_decorators, { kind: "field", name: "contactInfo", static: false, private: false, access: { has: obj => "contactInfo" in obj, get: obj => obj.contactInfo, set: (obj, value) => { obj.contactInfo = value; } }, metadata: _metadata }, _contactInfo_initializers, _contactInfo_extraInitializers);
        __esDecorate(null, null, _operatingHours_decorators, { kind: "field", name: "operatingHours", static: false, private: false, access: { has: obj => "operatingHours" in obj, get: obj => obj.operatingHours, set: (obj, value) => { obj.operatingHours = value; } }, metadata: _metadata }, _operatingHours_initializers, _operatingHours_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _parentLocation_decorators, { kind: "field", name: "parentLocation", static: false, private: false, access: { has: obj => "parentLocation" in obj, get: obj => obj.parentLocation, set: (obj, value) => { obj.parentLocation = value; } }, metadata: _metadata }, _parentLocation_initializers, _parentLocation_extraInitializers);
        __esDecorate(null, null, _childLocations_decorators, { kind: "field", name: "childLocations", static: false, private: false, access: { has: obj => "childLocations" in obj, get: obj => obj.childLocations, set: (obj, value) => { obj.childLocations = value; } }, metadata: _metadata }, _childLocations_initializers, _childLocations_extraInitializers);
        __esDecorate(null, null, _locationHistory_decorators, { kind: "field", name: "locationHistory", static: false, private: false, access: { has: obj => "locationHistory" in obj, get: obj => obj.locationHistory, set: (obj, value) => { obj.locationHistory = value; } }, metadata: _metadata }, _locationHistory_initializers, _locationHistory_extraInitializers);
        __esDecorate(null, null, _geofences_decorators, { kind: "field", name: "geofences", static: false, private: false, access: { has: obj => "geofences" in obj, get: obj => obj.geofences, set: (obj, value) => { obj.geofences = value; } }, metadata: _metadata }, _geofences_initializers, _geofences_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetLocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetLocation = _classThis;
})();
exports.AssetLocation = AssetLocation;
/**
 * Asset Location History Model
 */
let AssetLocationHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_location_history',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['location_id'] },
                { fields: ['assigned_date'] },
                { fields: ['removed_date'] },
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
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _subLocation_decorators;
    let _subLocation_initializers = [];
    let _subLocation_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _assignedBy_decorators;
    let _assignedBy_initializers = [];
    let _assignedBy_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _removedDate_decorators;
    let _removedDate_initializers = [];
    let _removedDate_extraInitializers = [];
    let _removalReason_decorators;
    let _removalReason_initializers = [];
    let _removalReason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _isCurrent_decorators;
    let _isCurrent_initializers = [];
    let _isCurrent_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    var AssetLocationHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.locationId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.subLocation = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _subLocation_initializers, void 0));
            this.position = (__runInitializers(this, _subLocation_extraInitializers), __runInitializers(this, _position_initializers, void 0));
            this.assignedBy = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _assignedBy_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _assignedBy_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.removedDate = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _removedDate_initializers, void 0));
            this.removalReason = (__runInitializers(this, _removedDate_extraInitializers), __runInitializers(this, _removalReason_initializers, void 0));
            this.notes = (__runInitializers(this, _removalReason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.isCurrent = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _isCurrent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isCurrent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.location = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            __runInitializers(this, _location_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetLocationHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetLocation), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _subLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sub-location detail' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _position_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position within location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _assignedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _assignedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _removedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Removed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _removalReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Removal reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _isCurrent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is current location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _location_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetLocation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _subLocation_decorators, { kind: "field", name: "subLocation", static: false, private: false, access: { has: obj => "subLocation" in obj, get: obj => obj.subLocation, set: (obj, value) => { obj.subLocation = value; } }, metadata: _metadata }, _subLocation_initializers, _subLocation_extraInitializers);
        __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
        __esDecorate(null, null, _assignedBy_decorators, { kind: "field", name: "assignedBy", static: false, private: false, access: { has: obj => "assignedBy" in obj, get: obj => obj.assignedBy, set: (obj, value) => { obj.assignedBy = value; } }, metadata: _metadata }, _assignedBy_initializers, _assignedBy_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _removedDate_decorators, { kind: "field", name: "removedDate", static: false, private: false, access: { has: obj => "removedDate" in obj, get: obj => obj.removedDate, set: (obj, value) => { obj.removedDate = value; } }, metadata: _metadata }, _removedDate_initializers, _removedDate_extraInitializers);
        __esDecorate(null, null, _removalReason_decorators, { kind: "field", name: "removalReason", static: false, private: false, access: { has: obj => "removalReason" in obj, get: obj => obj.removalReason, set: (obj, value) => { obj.removalReason = value; } }, metadata: _metadata }, _removalReason_initializers, _removalReason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _isCurrent_decorators, { kind: "field", name: "isCurrent", static: false, private: false, access: { has: obj => "isCurrent" in obj, get: obj => obj.isCurrent, set: (obj, value) => { obj.isCurrent = value; } }, metadata: _metadata }, _isCurrent_initializers, _isCurrent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetLocationHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetLocationHistory = _classThis;
})();
exports.AssetLocationHistory = AssetLocationHistory;
/**
 * Location Geofence Model
 */
let LocationGeofence = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'location_geofences',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['location_id'] },
                { fields: ['geofence_name'] },
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
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _geofenceName_decorators;
    let _geofenceName_initializers = [];
    let _geofenceName_extraInitializers = [];
    let _boundaryType_decorators;
    let _boundaryType_initializers = [];
    let _boundaryType_extraInitializers = [];
    let _centerPoint_decorators;
    let _centerPoint_initializers = [];
    let _centerPoint_extraInitializers = [];
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _radiusUnit_decorators;
    let _radiusUnit_initializers = [];
    let _radiusUnit_extraInitializers = [];
    let _polygonPoints_decorators;
    let _polygonPoints_initializers = [];
    let _polygonPoints_extraInitializers = [];
    let _rectangleBounds_decorators;
    let _rectangleBounds_initializers = [];
    let _rectangleBounds_extraInitializers = [];
    let _alertOnEntry_decorators;
    let _alertOnEntry_initializers = [];
    let _alertOnEntry_extraInitializers = [];
    let _alertOnExit_decorators;
    let _alertOnExit_initializers = [];
    let _alertOnExit_extraInitializers = [];
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
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    var LocationGeofence = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.locationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.geofenceName = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _geofenceName_initializers, void 0));
            this.boundaryType = (__runInitializers(this, _geofenceName_extraInitializers), __runInitializers(this, _boundaryType_initializers, void 0));
            this.centerPoint = (__runInitializers(this, _boundaryType_extraInitializers), __runInitializers(this, _centerPoint_initializers, void 0));
            this.radius = (__runInitializers(this, _centerPoint_extraInitializers), __runInitializers(this, _radius_initializers, void 0));
            this.radiusUnit = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _radiusUnit_initializers, void 0));
            this.polygonPoints = (__runInitializers(this, _radiusUnit_extraInitializers), __runInitializers(this, _polygonPoints_initializers, void 0));
            this.rectangleBounds = (__runInitializers(this, _polygonPoints_extraInitializers), __runInitializers(this, _rectangleBounds_initializers, void 0));
            this.alertOnEntry = (__runInitializers(this, _rectangleBounds_extraInitializers), __runInitializers(this, _alertOnEntry_initializers, void 0));
            this.alertOnExit = (__runInitializers(this, _alertOnEntry_extraInitializers), __runInitializers(this, _alertOnExit_initializers, void 0));
            this.isActive = (__runInitializers(this, _alertOnExit_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.location = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            __runInitializers(this, _location_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LocationGeofence");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetLocation), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _geofenceName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Geofence name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _boundaryType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Boundary type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('circle', 'polygon', 'rectangle'),
                allowNull: false,
            })];
        _centerPoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Center point (for circle)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _radius_decorators = [(0, swagger_1.ApiProperty)({ description: 'Radius (for circle)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _radiusUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Radius unit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('meters', 'feet', 'kilometers', 'miles') })];
        _polygonPoints_decorators = [(0, swagger_1.ApiProperty)({ description: 'Polygon points' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _rectangleBounds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rectangle bounds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _alertOnEntry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert on entry' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _alertOnExit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert on exit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _location_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetLocation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _geofenceName_decorators, { kind: "field", name: "geofenceName", static: false, private: false, access: { has: obj => "geofenceName" in obj, get: obj => obj.geofenceName, set: (obj, value) => { obj.geofenceName = value; } }, metadata: _metadata }, _geofenceName_initializers, _geofenceName_extraInitializers);
        __esDecorate(null, null, _boundaryType_decorators, { kind: "field", name: "boundaryType", static: false, private: false, access: { has: obj => "boundaryType" in obj, get: obj => obj.boundaryType, set: (obj, value) => { obj.boundaryType = value; } }, metadata: _metadata }, _boundaryType_initializers, _boundaryType_extraInitializers);
        __esDecorate(null, null, _centerPoint_decorators, { kind: "field", name: "centerPoint", static: false, private: false, access: { has: obj => "centerPoint" in obj, get: obj => obj.centerPoint, set: (obj, value) => { obj.centerPoint = value; } }, metadata: _metadata }, _centerPoint_initializers, _centerPoint_extraInitializers);
        __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
        __esDecorate(null, null, _radiusUnit_decorators, { kind: "field", name: "radiusUnit", static: false, private: false, access: { has: obj => "radiusUnit" in obj, get: obj => obj.radiusUnit, set: (obj, value) => { obj.radiusUnit = value; } }, metadata: _metadata }, _radiusUnit_initializers, _radiusUnit_extraInitializers);
        __esDecorate(null, null, _polygonPoints_decorators, { kind: "field", name: "polygonPoints", static: false, private: false, access: { has: obj => "polygonPoints" in obj, get: obj => obj.polygonPoints, set: (obj, value) => { obj.polygonPoints = value; } }, metadata: _metadata }, _polygonPoints_initializers, _polygonPoints_extraInitializers);
        __esDecorate(null, null, _rectangleBounds_decorators, { kind: "field", name: "rectangleBounds", static: false, private: false, access: { has: obj => "rectangleBounds" in obj, get: obj => obj.rectangleBounds, set: (obj, value) => { obj.rectangleBounds = value; } }, metadata: _metadata }, _rectangleBounds_initializers, _rectangleBounds_extraInitializers);
        __esDecorate(null, null, _alertOnEntry_decorators, { kind: "field", name: "alertOnEntry", static: false, private: false, access: { has: obj => "alertOnEntry" in obj, get: obj => obj.alertOnEntry, set: (obj, value) => { obj.alertOnEntry = value; } }, metadata: _metadata }, _alertOnEntry_initializers, _alertOnEntry_extraInitializers);
        __esDecorate(null, null, _alertOnExit_decorators, { kind: "field", name: "alertOnExit", static: false, private: false, access: { has: obj => "alertOnExit" in obj, get: obj => obj.alertOnExit, set: (obj, value) => { obj.alertOnExit = value; } }, metadata: _metadata }, _alertOnExit_initializers, _alertOnExit_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LocationGeofence = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LocationGeofence = _classThis;
})();
exports.LocationGeofence = LocationGeofence;
/**
 * GPS Tracking Log Model
 */
let GPSTrackingLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'gps_tracking_logs',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['tracked_at'] },
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
    let _coordinates_decorators;
    let _coordinates_initializers = [];
    let _coordinates_extraInitializers = [];
    let _trackedAt_decorators;
    let _trackedAt_initializers = [];
    let _trackedAt_extraInitializers = [];
    let _speed_decorators;
    let _speed_initializers = [];
    let _speed_extraInitializers = [];
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _batteryLevel_decorators;
    let _batteryLevel_initializers = [];
    let _batteryLevel_extraInitializers = [];
    let _signalStrength_decorators;
    let _signalStrength_initializers = [];
    let _signalStrength_extraInitializers = [];
    let _trackingSource_decorators;
    let _trackingSource_initializers = [];
    let _trackingSource_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var GPSTrackingLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.coordinates = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _coordinates_initializers, void 0));
            this.trackedAt = (__runInitializers(this, _coordinates_extraInitializers), __runInitializers(this, _trackedAt_initializers, void 0));
            this.speed = (__runInitializers(this, _trackedAt_extraInitializers), __runInitializers(this, _speed_initializers, void 0));
            this.heading = (__runInitializers(this, _speed_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
            this.batteryLevel = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _batteryLevel_initializers, void 0));
            this.signalStrength = (__runInitializers(this, _batteryLevel_extraInitializers), __runInitializers(this, _signalStrength_initializers, void 0));
            this.trackingSource = (__runInitializers(this, _signalStrength_extraInitializers), __runInitializers(this, _trackingSource_initializers, void 0));
            this.createdAt = (__runInitializers(this, _trackingSource_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GPSTrackingLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _coordinates_decorators = [(0, swagger_1.ApiProperty)({ description: 'GPS coordinates' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _trackedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracked at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _speed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Speed (if available)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _heading_decorators = [(0, swagger_1.ApiProperty)({ description: 'Heading/direction (degrees)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _batteryLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Battery level (percentage)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _signalStrength_decorators = [(0, swagger_1.ApiProperty)({ description: 'Signal strength' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _trackingSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracking source' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _coordinates_decorators, { kind: "field", name: "coordinates", static: false, private: false, access: { has: obj => "coordinates" in obj, get: obj => obj.coordinates, set: (obj, value) => { obj.coordinates = value; } }, metadata: _metadata }, _coordinates_initializers, _coordinates_extraInitializers);
        __esDecorate(null, null, _trackedAt_decorators, { kind: "field", name: "trackedAt", static: false, private: false, access: { has: obj => "trackedAt" in obj, get: obj => obj.trackedAt, set: (obj, value) => { obj.trackedAt = value; } }, metadata: _metadata }, _trackedAt_initializers, _trackedAt_extraInitializers);
        __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _batteryLevel_decorators, { kind: "field", name: "batteryLevel", static: false, private: false, access: { has: obj => "batteryLevel" in obj, get: obj => obj.batteryLevel, set: (obj, value) => { obj.batteryLevel = value; } }, metadata: _metadata }, _batteryLevel_initializers, _batteryLevel_extraInitializers);
        __esDecorate(null, null, _signalStrength_decorators, { kind: "field", name: "signalStrength", static: false, private: false, access: { has: obj => "signalStrength" in obj, get: obj => obj.signalStrength, set: (obj, value) => { obj.signalStrength = value; } }, metadata: _metadata }, _signalStrength_initializers, _signalStrength_extraInitializers);
        __esDecorate(null, null, _trackingSource_decorators, { kind: "field", name: "trackingSource", static: false, private: false, access: { has: obj => "trackingSource" in obj, get: obj => obj.trackingSource, set: (obj, value) => { obj.trackingSource = value; } }, metadata: _metadata }, _trackingSource_initializers, _trackingSource_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GPSTrackingLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GPSTrackingLog = _classThis;
})();
exports.GPSTrackingLog = GPSTrackingLog;
// ============================================================================
// LOCATION MANAGEMENT
// ============================================================================
/**
 * Creates a new location
 *
 * @param data - Location data
 * @param transaction - Optional database transaction
 * @returns Created location
 *
 * @example
 * ```typescript
 * const location = await createLocation({
 *   locationCode: 'BLD-A-FL2',
 *   locationName: 'Building A - Floor 2',
 *   locationType: LocationType.FLOOR,
 *   parentLocationId: 'building-a-id',
 *   capacity: 100,
 *   accessLevel: AccessLevel.RESTRICTED
 * });
 * ```
 */
async function createLocation(data, transaction) {
    // Check for duplicate location code
    const existing = await AssetLocation.findOne({
        where: { locationCode: data.locationCode },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Location code ${data.locationCode} already exists`);
    }
    // Validate parent location if specified
    let hierarchyPath = data.locationCode;
    let hierarchyLevel = 0;
    if (data.parentLocationId) {
        const parent = await AssetLocation.findByPk(data.parentLocationId, { transaction });
        if (!parent) {
            throw new common_1.NotFoundException(`Parent location ${data.parentLocationId} not found`);
        }
        hierarchyPath = `${parent.hierarchyPath}/${data.locationCode}`;
        hierarchyLevel = parent.hierarchyLevel + 1;
    }
    const location = await AssetLocation.create({
        ...data,
        hierarchyPath,
        hierarchyLevel,
        status: LocationStatus.ACTIVE,
        currentOccupancy: 0,
        isActive: data.isActive !== false,
    }, { transaction });
    return location;
}
/**
 * Updates location details
 *
 * @param locationId - Location ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated location
 *
 * @example
 * ```typescript
 * await updateLocation('loc-123', {
 *   capacity: 150,
 *   manager: 'user-001',
 *   environmentalConditions: {
 *     temperature: 72,
 *     humidity: 45,
 *     isClimateControlled: true
 *   }
 * });
 * ```
 */
async function updateLocation(locationId, updates, transaction) {
    const location = await AssetLocation.findByPk(locationId, { transaction });
    if (!location) {
        throw new common_1.NotFoundException(`Location ${locationId} not found`);
    }
    // If parent is being changed, update hierarchy
    if (updates.parentLocationId !== undefined) {
        if (updates.parentLocationId) {
            const parent = await AssetLocation.findByPk(updates.parentLocationId, { transaction });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent location ${updates.parentLocationId} not found`);
            }
            updates['hierarchyPath'] = `${parent.hierarchyPath}/${location.locationCode}`;
            updates['hierarchyLevel'] = parent.hierarchyLevel + 1;
        }
        else {
            updates['hierarchyPath'] = location.locationCode;
            updates['hierarchyLevel'] = 0;
        }
    }
    await location.update(updates, { transaction });
    return location;
}
/**
 * Gets location by ID with full details
 *
 * @param locationId - Location ID
 * @param includeChildren - Whether to include child locations
 * @returns Location details
 *
 * @example
 * ```typescript
 * const location = await getLocationById('loc-123', true);
 * ```
 */
async function getLocationById(locationId, includeChildren = false) {
    const include = includeChildren
        ? [
            { model: AssetLocation, as: 'parentLocation' },
            { model: AssetLocation, as: 'childLocations' },
            { model: LocationGeofence, as: 'geofences' },
        ]
        : [{ model: AssetLocation, as: 'parentLocation' }];
    const location = await AssetLocation.findByPk(locationId, { include });
    if (!location) {
        throw new common_1.NotFoundException(`Location ${locationId} not found`);
    }
    return location;
}
/**
 * Gets complete location hierarchy from root
 *
 * @param rootLocationId - Optional root location ID (if not provided, gets all top-level)
 * @returns Location hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await getLocationHierarchy('facility-001');
 * ```
 */
async function getLocationHierarchy(rootLocationId) {
    const where = { isActive: true };
    if (rootLocationId) {
        where.id = rootLocationId;
    }
    else {
        where.parentLocationId = null;
    }
    const locations = await AssetLocation.findAll({
        where,
        include: [
            {
                model: AssetLocation,
                as: 'childLocations',
                include: [
                    {
                        model: AssetLocation,
                        as: 'childLocations',
                        include: [
                            {
                                model: AssetLocation,
                                as: 'childLocations',
                            },
                        ],
                    },
                ],
            },
        ],
        order: [['locationName', 'ASC']],
    });
    return locations;
}
/**
 * Gets all child locations recursively
 *
 * @param parentLocationId - Parent location ID
 * @returns All descendant locations
 *
 * @example
 * ```typescript
 * const children = await getAllChildLocations('building-a');
 * ```
 */
async function getAllChildLocations(parentLocationId) {
    const parent = await AssetLocation.findByPk(parentLocationId);
    if (!parent) {
        throw new common_1.NotFoundException(`Location ${parentLocationId} not found`);
    }
    return AssetLocation.findAll({
        where: {
            hierarchyPath: {
                [sequelize_1.Op.like]: `${parent.hierarchyPath}/%`,
            },
            isActive: true,
        },
        order: [['hierarchyLevel', 'ASC'], ['locationName', 'ASC']],
    });
}
/**
 * Searches locations with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered locations
 *
 * @example
 * ```typescript
 * const locations = await searchLocations({
 *   locationType: LocationType.ROOM,
 *   status: LocationStatus.ACTIVE,
 *   minCapacity: 50
 * });
 * ```
 */
async function searchLocations(filters, options = {}) {
    const where = { isActive: true };
    if (filters.locationType) {
        where.locationType = Array.isArray(filters.locationType)
            ? { [sequelize_1.Op.in]: filters.locationType }
            : filters.locationType;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.parentLocationId) {
        where.parentLocationId = filters.parentLocationId;
    }
    if (filters.accessLevel) {
        where.accessLevel = filters.accessLevel;
    }
    if (filters.minCapacity !== undefined || filters.maxCapacity !== undefined) {
        where.capacity = {};
        if (filters.minCapacity !== undefined) {
            where.capacity[sequelize_1.Op.gte] = filters.minCapacity;
        }
        if (filters.maxCapacity !== undefined) {
            where.capacity[sequelize_1.Op.lte] = filters.maxCapacity;
        }
    }
    if (filters.hasGPS) {
        where.gpsCoordinates = { [sequelize_1.Op.ne]: null };
    }
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { locationCode: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { locationName: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    const { rows: locations, count: total } = await AssetLocation.findAndCountAll({
        where,
        ...options,
    });
    return { locations, total };
}
// ============================================================================
// ASSET LOCATION ASSIGNMENT
// ============================================================================
/**
 * Assigns asset to location
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Location history record
 *
 * @example
 * ```typescript
 * await assignAssetToLocation({
 *   assetId: 'asset-123',
 *   locationId: 'loc-456',
 *   assignedBy: 'user-001',
 *   subLocation: 'Shelf 3B',
 *   position: 'Row 5, Slot 12'
 * });
 * ```
 */
async function assignAssetToLocation(data, transaction) {
    const location = await AssetLocation.findByPk(data.locationId, { transaction });
    if (!location) {
        throw new common_1.NotFoundException(`Location ${data.locationId} not found`);
    }
    // Check capacity
    if (location.capacity && location.currentOccupancy >= location.capacity) {
        throw new common_1.BadRequestException(`Location ${location.locationName} is at full capacity`);
    }
    // Mark previous location assignment as no longer current
    await AssetLocationHistory.update({ isCurrent: false, removedDate: new Date() }, {
        where: {
            assetId: data.assetId,
            isCurrent: true,
        },
        transaction,
    });
    // Create new location history
    const history = await AssetLocationHistory.create({
        assetId: data.assetId,
        locationId: data.locationId,
        subLocation: data.subLocation,
        position: data.position,
        assignedBy: data.assignedBy,
        assignedDate: data.assignmentDate || new Date(),
        notes: data.notes,
        isCurrent: true,
    }, { transaction });
    // Update location occupancy
    await location.increment('currentOccupancy', { by: 1, transaction });
    return history;
}
/**
 * Removes asset from location
 *
 * @param assetId - Asset ID
 * @param removedBy - User ID
 * @param reason - Removal reason
 * @param transaction - Optional database transaction
 * @returns Updated history record
 *
 * @example
 * ```typescript
 * await removeAssetFromLocation('asset-123', 'user-001', 'Asset transferred');
 * ```
 */
async function removeAssetFromLocation(assetId, removedBy, reason, transaction) {
    const currentHistory = await AssetLocationHistory.findOne({
        where: {
            assetId,
            isCurrent: true,
        },
        transaction,
    });
    if (!currentHistory) {
        return null;
    }
    await currentHistory.update({
        isCurrent: false,
        removedDate: new Date(),
        removalReason: reason,
    }, { transaction });
    // Update location occupancy
    const location = await AssetLocation.findByPk(currentHistory.locationId, { transaction });
    if (location) {
        await location.decrement('currentOccupancy', { by: 1, transaction });
    }
    return currentHistory;
}
/**
 * Gets current location for asset
 *
 * @param assetId - Asset ID
 * @returns Current location or null
 *
 * @example
 * ```typescript
 * const location = await getCurrentAssetLocation('asset-123');
 * ```
 */
async function getCurrentAssetLocation(assetId) {
    const history = await AssetLocationHistory.findOne({
        where: {
            assetId,
            isCurrent: true,
        },
        include: [{ model: AssetLocation, as: 'location' }],
    });
    return history?.location || null;
}
/**
 * Gets location history for asset
 *
 * @param assetId - Asset ID
 * @param limit - Maximum records to return
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getAssetLocationHistory('asset-123', 10);
 * ```
 */
async function getAssetLocationHistory(assetId, limit = 50) {
    return AssetLocationHistory.findAll({
        where: { assetId },
        include: [{ model: AssetLocation, as: 'location' }],
        order: [['assignedDate', 'DESC']],
        limit,
    });
}
/**
 * Gets all assets in location
 *
 * @param locationId - Location ID
 * @param includeSublocations - Whether to include child locations
 * @returns Asset IDs in location
 *
 * @example
 * ```typescript
 * const assetIds = await getAssetsInLocation('loc-123', true);
 * ```
 */
async function getAssetsInLocation(locationId, includeSublocations = false) {
    const where = { isCurrent: true };
    if (includeSublocations) {
        const location = await AssetLocation.findByPk(locationId);
        if (!location) {
            throw new common_1.NotFoundException(`Location ${locationId} not found`);
        }
        // Get all child locations
        const childLocations = await AssetLocation.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { id: locationId },
                    { hierarchyPath: { [sequelize_1.Op.like]: `${location.hierarchyPath}/%` } },
                ],
            },
        });
        const locationIds = childLocations.map((l) => l.id);
        where.locationId = { [sequelize_1.Op.in]: locationIds };
    }
    else {
        where.locationId = locationId;
    }
    const histories = await AssetLocationHistory.findAll({
        where,
        attributes: ['assetId'],
    });
    return histories.map((h) => h.assetId);
}
// ============================================================================
// LOCATION CAPACITY AND UTILIZATION
// ============================================================================
/**
 * Calculates location utilization
 *
 * @param locationId - Location ID
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateLocationUtilization('loc-123');
 * ```
 */
async function calculateLocationUtilization(locationId) {
    const location = await AssetLocation.findByPk(locationId);
    if (!location) {
        throw new common_1.NotFoundException(`Location ${locationId} not found`);
    }
    const totalCapacity = location.capacity || 0;
    const currentOccupancy = location.currentOccupancy;
    const availableSpace = Math.max(0, totalCapacity - currentOccupancy);
    const utilizationPercentage = totalCapacity > 0 ? (currentOccupancy / totalCapacity) * 100 : 0;
    // Get asset count (more accurate than occupancy)
    const assetIds = await getAssetsInLocation(locationId, false);
    const assetCount = assetIds.length;
    return {
        locationId,
        totalCapacity,
        currentOccupancy,
        utilizationPercentage,
        availableSpace,
        assetCount,
        spaceByCategory: {}, // Would be populated with actual asset type breakdown
    };
}
/**
 * Finds available locations with capacity
 *
 * @param minCapacity - Minimum available capacity needed
 * @param locationType - Optional location type filter
 * @returns Available locations
 *
 * @example
 * ```typescript
 * const available = await findAvailableLocations(10, LocationType.ROOM);
 * ```
 */
async function findAvailableLocations(minCapacity, locationType) {
    const where = {
        isActive: true,
        status: LocationStatus.ACTIVE,
    };
    if (locationType) {
        where.locationType = locationType;
    }
    const locations = await AssetLocation.findAll({ where });
    // Filter by available capacity
    return locations.filter((loc) => {
        if (!loc.capacity)
            return false;
        const available = loc.capacity - loc.currentOccupancy;
        return available >= minCapacity;
    });
}
/**
 * Optimizes asset placement across locations
 *
 * @param locationIds - Locations to optimize
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeLocationUtilization(['loc-1', 'loc-2']);
 * ```
 */
async function optimizeLocationUtilization(locationIds) {
    const recommendations = [];
    for (const locationId of locationIds) {
        const utilization = await calculateLocationUtilization(locationId);
        const location = await AssetLocation.findByPk(locationId);
        let recommendation = '';
        const suggestedActions = [];
        if (utilization.utilizationPercentage >= 90) {
            recommendation = 'Over-utilized - consider expanding or redistributing assets';
            suggestedActions.push('Review asset necessity in this location');
            suggestedActions.push('Consider moving some assets to nearby locations');
            suggestedActions.push('Evaluate capacity expansion options');
        }
        else if (utilization.utilizationPercentage >= 70) {
            recommendation = 'Well-utilized - monitor for future capacity needs';
            suggestedActions.push('Plan for potential capacity needs');
        }
        else if (utilization.utilizationPercentage <= 30) {
            recommendation = 'Under-utilized - consider consolidation opportunities';
            suggestedActions.push('Evaluate potential for asset consolidation');
            suggestedActions.push('Consider repurposing this space');
        }
        else {
            recommendation = 'Optimal utilization';
        }
        recommendations.push({
            locationId,
            currentUtilization: utilization.utilizationPercentage,
            recommendation,
            suggestedActions,
        });
    }
    return recommendations;
}
// ============================================================================
// GPS TRACKING AND GEOFENCING
// ============================================================================
/**
 * Records GPS tracking point
 *
 * @param assetId - Asset ID
 * @param coordinates - GPS coordinates
 * @param additionalData - Optional additional tracking data
 * @param transaction - Optional database transaction
 * @returns Tracking log entry
 *
 * @example
 * ```typescript
 * await recordGPSTracking('asset-123', {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10
 * }, {
 *   speed: 45,
 *   heading: 180,
 *   batteryLevel: 85
 * });
 * ```
 */
async function recordGPSTracking(assetId, coordinates, additionalData, transaction) {
    return GPSTrackingLog.create({
        assetId,
        coordinates,
        trackedAt: new Date(),
        ...additionalData,
    }, { transaction });
}
/**
 * Gets GPS tracking history
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param limit - Maximum records
 * @returns GPS tracking history
 *
 * @example
 * ```typescript
 * const history = await getGPSTrackingHistory(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   100
 * );
 * ```
 */
async function getGPSTrackingHistory(assetId, startDate, endDate, limit = 100) {
    const where = { assetId };
    if (startDate || endDate) {
        where.trackedAt = {};
        if (startDate) {
            where.trackedAt[sequelize_1.Op.gte] = startDate;
        }
        if (endDate) {
            where.trackedAt[sequelize_1.Op.lte] = endDate;
        }
    }
    return GPSTrackingLog.findAll({
        where,
        order: [['trackedAt', 'DESC']],
        limit,
    });
}
/**
 * Creates geofence for location
 *
 * @param data - Geofence definition
 * @param transaction - Optional database transaction
 * @returns Created geofence
 *
 * @example
 * ```typescript
 * await createLocationGeofence({
 *   locationId: 'loc-123',
 *   geofenceName: 'Main Campus Perimeter',
 *   boundaryType: 'circle',
 *   centerPoint: { latitude: 40.7128, longitude: -74.0060 },
 *   radius: 500,
 *   radiusUnit: 'meters',
 *   alertOnExit: true
 * });
 * ```
 */
async function createLocationGeofence(data, transaction) {
    const location = await AssetLocation.findByPk(data.locationId, { transaction });
    if (!location) {
        throw new common_1.NotFoundException(`Location ${data.locationId} not found`);
    }
    return LocationGeofence.create({
        ...data,
        isActive: true,
    }, { transaction });
}
/**
 * Checks if coordinates are within geofence
 *
 * @param geofenceId - Geofence ID
 * @param coordinates - GPS coordinates to check
 * @returns Whether coordinates are within geofence
 *
 * @example
 * ```typescript
 * const isInside = await isWithinGeofence('geofence-123', {
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * });
 * ```
 */
async function isWithinGeofence(geofenceId, coordinates) {
    const geofence = await LocationGeofence.findByPk(geofenceId);
    if (!geofence || !geofence.isActive) {
        return false;
    }
    switch (geofence.boundaryType) {
        case 'circle':
            return isWithinCircle(coordinates, geofence.centerPoint, geofence.radius, geofence.radiusUnit);
        case 'polygon':
            return isWithinPolygon(coordinates, geofence.polygonPoints);
        case 'rectangle':
            return isWithinRectangle(coordinates, geofence.rectangleBounds);
        default:
            return false;
    }
}
/**
 * Checks if point is within circle
 */
function isWithinCircle(point, center, radius, unit) {
    const distance = calculateDistance(point, center);
    const radiusInMeters = convertToMeters(radius, unit);
    return distance <= radiusInMeters;
}
/**
 * Checks if point is within polygon
 */
function isWithinPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].longitude;
        const yi = polygon[i].latitude;
        const xj = polygon[j].longitude;
        const yj = polygon[j].latitude;
        const intersect = yi > point.latitude !== yj > point.latitude &&
            point.longitude < ((xj - xi) * (point.latitude - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
    }
    return inside;
}
/**
 * Checks if point is within rectangle
 */
function isWithinRectangle(point, bounds) {
    return (point.latitude <= bounds.northEast.latitude &&
        point.latitude >= bounds.southWest.latitude &&
        point.longitude <= bounds.northEast.longitude &&
        point.longitude >= bounds.southWest.longitude);
}
/**
 * Calculates distance between two GPS coordinates in meters
 */
function calculateDistance(point1, point2) {
    const R = 6371000; // Earth's radius in meters
    const lat1 = (point1.latitude * Math.PI) / 180;
    const lat2 = (point2.latitude * Math.PI) / 180;
    const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const deltaLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Converts distance to meters
 */
function convertToMeters(distance, unit) {
    switch (unit) {
        case 'meters':
            return distance;
        case 'feet':
            return distance * 0.3048;
        case 'kilometers':
            return distance * 1000;
        case 'miles':
            return distance * 1609.34;
        default:
            return distance;
    }
}
/**
 * Gets geofence violations for asset
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Geofence violations
 *
 * @example
 * ```typescript
 * const violations = await getGeofenceViolations(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function getGeofenceViolations(assetId, startDate, endDate) {
    // Get GPS tracking history
    const trackingHistory = await getGPSTrackingHistory(assetId, startDate, endDate, 1000);
    // Get all active geofences
    const geofences = await LocationGeofence.findAll({
        where: { isActive: true },
    });
    const violations = [];
    // Check each tracking point against geofences
    for (let i = 1; i < trackingHistory.length; i++) {
        const current = trackingHistory[i];
        const previous = trackingHistory[i - 1];
        for (const geofence of geofences) {
            const wasInside = await isWithinGeofence(geofence.id, previous.coordinates);
            const isInside = await isWithinGeofence(geofence.id, current.coordinates);
            // Entry violation
            if (!wasInside && isInside && geofence.alertOnEntry) {
                violations.push({
                    timestamp: current.trackedAt,
                    geofence,
                    coordinates: current.coordinates,
                    violationType: 'unauthorized_entry',
                });
            }
            // Exit violation
            if (wasInside && !isInside && geofence.alertOnExit) {
                violations.push({
                    timestamp: current.trackedAt,
                    geofence,
                    coordinates: current.coordinates,
                    violationType: 'unauthorized_exit',
                });
            }
        }
    }
    return violations;
}
// ============================================================================
// REPORTING AND ANALYTICS
// ============================================================================
/**
 * Generates location utilization report
 *
 * @param locationId - Optional location ID (if not provided, reports all)
 * @returns Utilization report
 *
 * @example
 * ```typescript
 * const report = await generateLocationUtilizationReport();
 * ```
 */
async function generateLocationUtilizationReport(locationId) {
    const where = { isActive: true };
    if (locationId) {
        where.id = locationId;
    }
    const locations = await AssetLocation.findAll({ where });
    const byType = {};
    const overUtilized = [];
    const underUtilized = [];
    const optimal = [];
    for (const location of locations) {
        // Initialize type stats
        if (!byType[location.locationType]) {
            byType[location.locationType] = { count: 0, totalUtilization: 0, avgUtilization: 0 };
        }
        const utilization = location.capacity
            ? (location.currentOccupancy / location.capacity) * 100
            : 0;
        byType[location.locationType].count++;
        byType[location.locationType].totalUtilization += utilization;
        // Categorize by utilization
        if (utilization >= 90) {
            overUtilized.push(location);
        }
        else if (utilization <= 30) {
            underUtilized.push(location);
        }
        else {
            optimal.push(location);
        }
    }
    // Calculate averages
    Object.keys(byType).forEach((type) => {
        byType[type].avgUtilization = byType[type].totalUtilization / byType[type].count;
    });
    return {
        totalLocations: locations.length,
        byType: byType,
        overUtilized,
        underUtilized,
        optimal,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AssetLocation,
    AssetLocationHistory,
    LocationGeofence,
    GPSTrackingLog,
    // Location Management
    createLocation,
    updateLocation,
    getLocationById,
    getLocationHierarchy,
    getAllChildLocations,
    searchLocations,
    // Asset Location Assignment
    assignAssetToLocation,
    removeAssetFromLocation,
    getCurrentAssetLocation,
    getAssetLocationHistory,
    getAssetsInLocation,
    // Capacity and Utilization
    calculateLocationUtilization,
    findAvailableLocations,
    optimizeLocationUtilization,
    // GPS Tracking
    recordGPSTracking,
    getGPSTrackingHistory,
    // Geofencing
    createLocationGeofence,
    isWithinGeofence,
    getGeofenceViolations,
    // Reporting
    generateLocationUtilizationReport,
};
//# sourceMappingURL=asset-location-commands.js.map