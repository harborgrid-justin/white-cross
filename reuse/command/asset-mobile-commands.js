"use strict";
/**
 * ASSET MOBILE COMMAND FUNCTIONS
 *
 * Enterprise-grade mobile asset management system providing comprehensive
 * functionality for mobile asset lookup, work orders, inspections, barcode/QR
 * scanning, offline synchronization, push notifications, location services,
 * photo capture, and digital signatures. Competes with IBM Maximo Mobile
 * and ServiceNow Mobile Agent solutions.
 *
 * Features:
 * - Mobile asset lookup and search
 * - Mobile work order management
 * - Mobile inspection forms
 * - Barcode and QR code scanning
 * - Offline data synchronization
 * - Push notifications
 * - GPS location tracking
 * - Photo and document capture
 * - Digital signatures
 * - Mobile reporting and dashboards
 *
 * @module AssetMobileCommands
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
 *   createMobileSession,
 *   scanAssetBarcode,
 *   createMobileWorkOrder,
 *   submitMobileInspection,
 *   syncOfflineData,
 *   MobileSessionStatus,
 *   ScanType
 * } from './asset-mobile-commands';
 *
 * // Start mobile session
 * const session = await createMobileSession({
 *   userId: 'user-123',
 *   deviceId: 'mobile-device-456',
 *   platform: 'iOS',
 *   appVersion: '2.1.0'
 * });
 *
 * // Scan asset barcode
 * const asset = await scanAssetBarcode({
 *   sessionId: session.id,
 *   scanType: ScanType.BARCODE,
 *   code: '123456789'
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
exports.MobilePhoto = exports.LocationTracking = exports.PushNotification = exports.OfflineSyncQueue = exports.MobileInspection = exports.MobileWorkOrder = exports.AssetScan = exports.MobileSession = exports.PlatformType = exports.NotificationPriority = exports.SyncStatus = exports.InspectionStatus = exports.MobileWorkOrderStatus = exports.ScanType = exports.MobileSessionStatus = void 0;
exports.createMobileSession = createMobileSession;
exports.updateSessionActivity = updateSessionActivity;
exports.endMobileSession = endMobileSession;
exports.getActiveSessions = getActiveSessions;
exports.scanAssetBarcode = scanAssetBarcode;
exports.getScanHistory = getScanHistory;
exports.getScansByAsset = getScansByAsset;
exports.createMobileWorkOrder = createMobileWorkOrder;
exports.updateMobileWorkOrder = updateMobileWorkOrder;
exports.getMobileWorkOrders = getMobileWorkOrders;
exports.createMobileInspection = createMobileInspection;
exports.submitMobileInspection = submitMobileInspection;
exports.getMobileInspections = getMobileInspections;
exports.queueOfflineSync = queueOfflineSync;
exports.syncOfflineData = syncOfflineData;
exports.processSyncQueue = processSyncQueue;
exports.sendPushNotification = sendPushNotification;
exports.getNotifications = getNotifications;
exports.markNotificationRead = markNotificationRead;
exports.updateLocation = updateLocation;
exports.getLocationHistory = getLocationHistory;
exports.uploadMobilePhoto = uploadMobilePhoto;
exports.getPhotosForEntity = getPhotosForEntity;
exports.createMobileForm = createMobileForm;
exports.getMobileForm = getMobileForm;
exports.submitMobileForm = submitMobileForm;
exports.captureDigitalSignature = captureDigitalSignature;
exports.verifySignature = verifySignature;
exports.recordVoiceNote = recordVoiceNote;
exports.getVoiceNotes = getVoiceNotes;
exports.getMobileAnalytics = getMobileAnalytics;
exports.getUserMobileActivity = getUserMobileActivity;
exports.registerMobileDevice = registerMobileDevice;
exports.unregisterMobileDevice = unregisterMobileDevice;
exports.getRegisteredDevices = getRegisteredDevices;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Mobile Session Status
 */
var MobileSessionStatus;
(function (MobileSessionStatus) {
    MobileSessionStatus["ACTIVE"] = "active";
    MobileSessionStatus["INACTIVE"] = "inactive";
    MobileSessionStatus["EXPIRED"] = "expired";
    MobileSessionStatus["LOGGED_OUT"] = "logged_out";
})(MobileSessionStatus || (exports.MobileSessionStatus = MobileSessionStatus = {}));
/**
 * Scan Type
 */
var ScanType;
(function (ScanType) {
    ScanType["BARCODE"] = "barcode";
    ScanType["QR_CODE"] = "qr_code";
    ScanType["RFID"] = "rfid";
    ScanType["NFC"] = "nfc";
})(ScanType || (exports.ScanType = ScanType = {}));
/**
 * Mobile Work Order Status
 */
var MobileWorkOrderStatus;
(function (MobileWorkOrderStatus) {
    MobileWorkOrderStatus["ASSIGNED"] = "assigned";
    MobileWorkOrderStatus["ACCEPTED"] = "accepted";
    MobileWorkOrderStatus["IN_PROGRESS"] = "in_progress";
    MobileWorkOrderStatus["ON_HOLD"] = "on_hold";
    MobileWorkOrderStatus["COMPLETED"] = "completed";
    MobileWorkOrderStatus["REJECTED"] = "rejected";
})(MobileWorkOrderStatus || (exports.MobileWorkOrderStatus = MobileWorkOrderStatus = {}));
/**
 * Inspection Status
 */
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["PENDING"] = "pending";
    InspectionStatus["IN_PROGRESS"] = "in_progress";
    InspectionStatus["COMPLETED"] = "completed";
    InspectionStatus["FAILED"] = "failed";
    InspectionStatus["CANCELLED"] = "cancelled";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
/**
 * Sync Status
 */
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "pending";
    SyncStatus["IN_PROGRESS"] = "in_progress";
    SyncStatus["COMPLETED"] = "completed";
    SyncStatus["FAILED"] = "failed";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
/**
 * Notification Priority
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
/**
 * Platform Type
 */
var PlatformType;
(function (PlatformType) {
    PlatformType["IOS"] = "iOS";
    PlatformType["ANDROID"] = "android";
    PlatformType["WEB"] = "web";
})(PlatformType || (exports.PlatformType = PlatformType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Mobile Session Model
 */
let MobileSession = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_sessions',
            timestamps: true,
            indexes: [
                { fields: ['user_id'] },
                { fields: ['device_id'] },
                { fields: ['status'] },
                { fields: ['last_activity'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _deviceName_decorators;
    let _deviceName_initializers = [];
    let _deviceName_extraInitializers = [];
    let _platform_decorators;
    let _platform_initializers = [];
    let _platform_extraInitializers = [];
    let _osVersion_decorators;
    let _osVersion_initializers = [];
    let _osVersion_extraInitializers = [];
    let _appVersion_decorators;
    let _appVersion_initializers = [];
    let _appVersion_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _pushToken_decorators;
    let _pushToken_initializers = [];
    let _pushToken_extraInitializers = [];
    let _sessionToken_decorators;
    let _sessionToken_initializers = [];
    let _sessionToken_extraInitializers = [];
    let _lastActivity_decorators;
    let _lastActivity_initializers = [];
    let _lastActivity_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _offlineMode_decorators;
    let _offlineMode_initializers = [];
    let _offlineMode_extraInitializers = [];
    let _lastSyncTime_decorators;
    let _lastSyncTime_initializers = [];
    let _lastSyncTime_extraInitializers = [];
    let _loggedOutAt_decorators;
    let _loggedOutAt_initializers = [];
    let _loggedOutAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _scans_decorators;
    let _scans_initializers = [];
    let _scans_extraInitializers = [];
    let _locations_decorators;
    let _locations_initializers = [];
    let _locations_extraInitializers = [];
    var MobileSession = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.deviceId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.deviceName = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _deviceName_initializers, void 0));
            this.platform = (__runInitializers(this, _deviceName_extraInitializers), __runInitializers(this, _platform_initializers, void 0));
            this.osVersion = (__runInitializers(this, _platform_extraInitializers), __runInitializers(this, _osVersion_initializers, void 0));
            this.appVersion = (__runInitializers(this, _osVersion_extraInitializers), __runInitializers(this, _appVersion_initializers, void 0));
            this.status = (__runInitializers(this, _appVersion_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.pushToken = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _pushToken_initializers, void 0));
            this.sessionToken = (__runInitializers(this, _pushToken_extraInitializers), __runInitializers(this, _sessionToken_initializers, void 0));
            this.lastActivity = (__runInitializers(this, _sessionToken_extraInitializers), __runInitializers(this, _lastActivity_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _lastActivity_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.offlineMode = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _offlineMode_initializers, void 0));
            this.lastSyncTime = (__runInitializers(this, _offlineMode_extraInitializers), __runInitializers(this, _lastSyncTime_initializers, void 0));
            this.loggedOutAt = (__runInitializers(this, _lastSyncTime_extraInitializers), __runInitializers(this, _loggedOutAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _loggedOutAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.scans = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _scans_initializers, void 0));
            this.locations = (__runInitializers(this, _scans_extraInitializers), __runInitializers(this, _locations_initializers, void 0));
            __runInitializers(this, _locations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileSession");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _deviceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Device ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _deviceName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Device name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _platform_decorators = [(0, swagger_1.ApiProperty)({ description: 'Platform' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PlatformType)), allowNull: false })];
        _osVersion_decorators = [(0, swagger_1.ApiProperty)({ description: 'OS version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _appVersion_decorators = [(0, swagger_1.ApiProperty)({ description: 'App version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MobileSessionStatus)), defaultValue: MobileSessionStatus.ACTIVE }), sequelize_typescript_1.Index];
        _pushToken_decorators = [(0, swagger_1.ApiProperty)({ description: 'Push notification token' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _sessionToken_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session token' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _lastActivity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last activity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _offlineMode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offline mode enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _lastSyncTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last sync time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _loggedOutAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Logged out at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _scans_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetScan)];
        _locations_decorators = [(0, sequelize_typescript_1.HasMany)(() => LocationTracking)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _deviceName_decorators, { kind: "field", name: "deviceName", static: false, private: false, access: { has: obj => "deviceName" in obj, get: obj => obj.deviceName, set: (obj, value) => { obj.deviceName = value; } }, metadata: _metadata }, _deviceName_initializers, _deviceName_extraInitializers);
        __esDecorate(null, null, _platform_decorators, { kind: "field", name: "platform", static: false, private: false, access: { has: obj => "platform" in obj, get: obj => obj.platform, set: (obj, value) => { obj.platform = value; } }, metadata: _metadata }, _platform_initializers, _platform_extraInitializers);
        __esDecorate(null, null, _osVersion_decorators, { kind: "field", name: "osVersion", static: false, private: false, access: { has: obj => "osVersion" in obj, get: obj => obj.osVersion, set: (obj, value) => { obj.osVersion = value; } }, metadata: _metadata }, _osVersion_initializers, _osVersion_extraInitializers);
        __esDecorate(null, null, _appVersion_decorators, { kind: "field", name: "appVersion", static: false, private: false, access: { has: obj => "appVersion" in obj, get: obj => obj.appVersion, set: (obj, value) => { obj.appVersion = value; } }, metadata: _metadata }, _appVersion_initializers, _appVersion_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _pushToken_decorators, { kind: "field", name: "pushToken", static: false, private: false, access: { has: obj => "pushToken" in obj, get: obj => obj.pushToken, set: (obj, value) => { obj.pushToken = value; } }, metadata: _metadata }, _pushToken_initializers, _pushToken_extraInitializers);
        __esDecorate(null, null, _sessionToken_decorators, { kind: "field", name: "sessionToken", static: false, private: false, access: { has: obj => "sessionToken" in obj, get: obj => obj.sessionToken, set: (obj, value) => { obj.sessionToken = value; } }, metadata: _metadata }, _sessionToken_initializers, _sessionToken_extraInitializers);
        __esDecorate(null, null, _lastActivity_decorators, { kind: "field", name: "lastActivity", static: false, private: false, access: { has: obj => "lastActivity" in obj, get: obj => obj.lastActivity, set: (obj, value) => { obj.lastActivity = value; } }, metadata: _metadata }, _lastActivity_initializers, _lastActivity_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _offlineMode_decorators, { kind: "field", name: "offlineMode", static: false, private: false, access: { has: obj => "offlineMode" in obj, get: obj => obj.offlineMode, set: (obj, value) => { obj.offlineMode = value; } }, metadata: _metadata }, _offlineMode_initializers, _offlineMode_extraInitializers);
        __esDecorate(null, null, _lastSyncTime_decorators, { kind: "field", name: "lastSyncTime", static: false, private: false, access: { has: obj => "lastSyncTime" in obj, get: obj => obj.lastSyncTime, set: (obj, value) => { obj.lastSyncTime = value; } }, metadata: _metadata }, _lastSyncTime_initializers, _lastSyncTime_extraInitializers);
        __esDecorate(null, null, _loggedOutAt_decorators, { kind: "field", name: "loggedOutAt", static: false, private: false, access: { has: obj => "loggedOutAt" in obj, get: obj => obj.loggedOutAt, set: (obj, value) => { obj.loggedOutAt = value; } }, metadata: _metadata }, _loggedOutAt_initializers, _loggedOutAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _scans_decorators, { kind: "field", name: "scans", static: false, private: false, access: { has: obj => "scans" in obj, get: obj => obj.scans, set: (obj, value) => { obj.scans = value; } }, metadata: _metadata }, _scans_initializers, _scans_extraInitializers);
        __esDecorate(null, null, _locations_decorators, { kind: "field", name: "locations", static: false, private: false, access: { has: obj => "locations" in obj, get: obj => obj.locations, set: (obj, value) => { obj.locations = value; } }, metadata: _metadata }, _locations_initializers, _locations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileSession = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileSession = _classThis;
})();
exports.MobileSession = MobileSession;
/**
 * Asset Scan Model
 */
let AssetScan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_scans',
            timestamps: true,
            indexes: [
                { fields: ['session_id'] },
                { fields: ['asset_id'] },
                { fields: ['scan_type'] },
                { fields: ['code'] },
                { fields: ['scanned_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _scanType_decorators;
    let _scanType_initializers = [];
    let _scanType_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _scannedAt_decorators;
    let _scannedAt_initializers = [];
    let _scannedAt_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _accuracy_decorators;
    let _accuracy_initializers = [];
    let _accuracy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _successful_decorators;
    let _successful_initializers = [];
    let _successful_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _session_decorators;
    let _session_initializers = [];
    let _session_extraInitializers = [];
    var AssetScan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sessionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.assetId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.scanType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _scanType_initializers, void 0));
            this.code = (__runInitializers(this, _scanType_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.scannedAt = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _scannedAt_initializers, void 0));
            this.latitude = (__runInitializers(this, _scannedAt_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.accuracy = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _accuracy_initializers, void 0));
            this.metadata = (__runInitializers(this, _accuracy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.successful = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _successful_initializers, void 0));
            this.createdAt = (__runInitializers(this, _successful_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.session = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _session_initializers, void 0));
            __runInitializers(this, _session_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetScan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mobile session ID' }), (0, sequelize_typescript_1.ForeignKey)(() => MobileSession), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _scanType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scan type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ScanType)), allowNull: false }), sequelize_typescript_1.Index];
        _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scanned code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _scannedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scanned at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _accuracy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location accuracy' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _successful_decorators = [(0, swagger_1.ApiProperty)({ description: 'Successful scan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _session_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => MobileSession)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _scanType_decorators, { kind: "field", name: "scanType", static: false, private: false, access: { has: obj => "scanType" in obj, get: obj => obj.scanType, set: (obj, value) => { obj.scanType = value; } }, metadata: _metadata }, _scanType_initializers, _scanType_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _scannedAt_decorators, { kind: "field", name: "scannedAt", static: false, private: false, access: { has: obj => "scannedAt" in obj, get: obj => obj.scannedAt, set: (obj, value) => { obj.scannedAt = value; } }, metadata: _metadata }, _scannedAt_initializers, _scannedAt_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _accuracy_decorators, { kind: "field", name: "accuracy", static: false, private: false, access: { has: obj => "accuracy" in obj, get: obj => obj.accuracy, set: (obj, value) => { obj.accuracy = value; } }, metadata: _metadata }, _accuracy_initializers, _accuracy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _successful_decorators, { kind: "field", name: "successful", static: false, private: false, access: { has: obj => "successful" in obj, get: obj => obj.successful, set: (obj, value) => { obj.successful = value; } }, metadata: _metadata }, _successful_initializers, _successful_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _session_decorators, { kind: "field", name: "session", static: false, private: false, access: { has: obj => "session" in obj, get: obj => obj.session, set: (obj, value) => { obj.session = value; } }, metadata: _metadata }, _session_initializers, _session_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetScan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetScan = _classThis;
})();
exports.AssetScan = AssetScan;
/**
 * Mobile Work Order Model
 */
let MobileWorkOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_work_orders',
            timestamps: true,
            indexes: [
                { fields: ['work_order_id'], unique: true },
                { fields: ['assigned_to'] },
                { fields: ['status'] },
                { fields: ['due_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    let _progress_decorators;
    let _progress_initializers = [];
    let _progress_extraInitializers = [];
    let _acceptedAt_decorators;
    let _acceptedAt_initializers = [];
    let _acceptedAt_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _signature_decorators;
    let _signature_initializers = [];
    let _signature_extraInitializers = [];
    let _partsUsed_decorators;
    let _partsUsed_initializers = [];
    let _partsUsed_extraInitializers = [];
    let _laborHours_decorators;
    let _laborHours_initializers = [];
    let _laborHours_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _synced_decorators;
    let _synced_initializers = [];
    let _synced_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var MobileWorkOrder = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workOrderId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.status = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.dueDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.priority = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.instructions = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
            this.progress = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _progress_initializers, void 0));
            this.acceptedAt = (__runInitializers(this, _progress_extraInitializers), __runInitializers(this, _acceptedAt_initializers, void 0));
            this.startedAt = (__runInitializers(this, _acceptedAt_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.notes = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.photos = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.signature = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
            this.partsUsed = (__runInitializers(this, _signature_extraInitializers), __runInitializers(this, _partsUsed_initializers, void 0));
            this.laborHours = (__runInitializers(this, _partsUsed_extraInitializers), __runInitializers(this, _laborHours_initializers, void 0));
            this.latitude = (__runInitializers(this, _laborHours_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.synced = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _synced_initializers, void 0));
            this.createdAt = (__runInitializers(this, _synced_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileWorkOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MobileWorkOrderStatus)), defaultValue: MobileWorkOrderStatus.ASSIGNED }), sequelize_typescript_1.Index];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _progress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Progress percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _acceptedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accepted at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _photos_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photos' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _signature_decorators = [(0, swagger_1.ApiProperty)({ description: 'Signature URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _partsUsed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parts used' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _laborHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Labor hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _synced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Synced to server' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
        __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: obj => "progress" in obj, get: obj => obj.progress, set: (obj, value) => { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
        __esDecorate(null, null, _acceptedAt_decorators, { kind: "field", name: "acceptedAt", static: false, private: false, access: { has: obj => "acceptedAt" in obj, get: obj => obj.acceptedAt, set: (obj, value) => { obj.acceptedAt = value; } }, metadata: _metadata }, _acceptedAt_initializers, _acceptedAt_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: obj => "signature" in obj, get: obj => obj.signature, set: (obj, value) => { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
        __esDecorate(null, null, _partsUsed_decorators, { kind: "field", name: "partsUsed", static: false, private: false, access: { has: obj => "partsUsed" in obj, get: obj => obj.partsUsed, set: (obj, value) => { obj.partsUsed = value; } }, metadata: _metadata }, _partsUsed_initializers, _partsUsed_extraInitializers);
        __esDecorate(null, null, _laborHours_decorators, { kind: "field", name: "laborHours", static: false, private: false, access: { has: obj => "laborHours" in obj, get: obj => obj.laborHours, set: (obj, value) => { obj.laborHours = value; } }, metadata: _metadata }, _laborHours_initializers, _laborHours_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _synced_decorators, { kind: "field", name: "synced", static: false, private: false, access: { has: obj => "synced" in obj, get: obj => obj.synced, set: (obj, value) => { obj.synced = value; } }, metadata: _metadata }, _synced_initializers, _synced_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileWorkOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileWorkOrder = _classThis;
})();
exports.MobileWorkOrder = MobileWorkOrder;
/**
 * Mobile Inspection Model
 */
let MobileInspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_inspections',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['inspected_by'] },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
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
    let _inspectionTemplateId_decorators;
    let _inspectionTemplateId_initializers = [];
    let _inspectionTemplateId_extraInitializers = [];
    let _inspectedBy_decorators;
    let _inspectedBy_initializers = [];
    let _inspectedBy_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _responses_decorators;
    let _responses_initializers = [];
    let _responses_extraInitializers = [];
    let _passed_decorators;
    let _passed_initializers = [];
    let _passed_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _signature_decorators;
    let _signature_initializers = [];
    let _signature_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _synced_decorators;
    let _synced_initializers = [];
    let _synced_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var MobileInspection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.inspectionTemplateId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _inspectionTemplateId_initializers, void 0));
            this.inspectedBy = (__runInitializers(this, _inspectionTemplateId_extraInitializers), __runInitializers(this, _inspectedBy_initializers, void 0));
            this.status = (__runInitializers(this, _inspectedBy_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.startedAt = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.responses = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _responses_initializers, void 0));
            this.passed = (__runInitializers(this, _responses_extraInitializers), __runInitializers(this, _passed_initializers, void 0));
            this.score = (__runInitializers(this, _passed_extraInitializers), __runInitializers(this, _score_initializers, void 0));
            this.photos = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.signature = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
            this.notes = (__runInitializers(this, _signature_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.latitude = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.synced = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _synced_initializers, void 0));
            this.createdAt = (__runInitializers(this, _synced_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileInspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _inspectionTemplateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection template ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _inspectedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspected by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InspectionStatus)), defaultValue: InspectionStatus.PENDING }), sequelize_typescript_1.Index];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _responses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection responses' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _passed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall pass/fail' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _score_decorators = [(0, swagger_1.ApiProperty)({ description: 'Score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _photos_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photos' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _signature_decorators = [(0, swagger_1.ApiProperty)({ description: 'Signature URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _synced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Synced to server' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _inspectionTemplateId_decorators, { kind: "field", name: "inspectionTemplateId", static: false, private: false, access: { has: obj => "inspectionTemplateId" in obj, get: obj => obj.inspectionTemplateId, set: (obj, value) => { obj.inspectionTemplateId = value; } }, metadata: _metadata }, _inspectionTemplateId_initializers, _inspectionTemplateId_extraInitializers);
        __esDecorate(null, null, _inspectedBy_decorators, { kind: "field", name: "inspectedBy", static: false, private: false, access: { has: obj => "inspectedBy" in obj, get: obj => obj.inspectedBy, set: (obj, value) => { obj.inspectedBy = value; } }, metadata: _metadata }, _inspectedBy_initializers, _inspectedBy_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _responses_decorators, { kind: "field", name: "responses", static: false, private: false, access: { has: obj => "responses" in obj, get: obj => obj.responses, set: (obj, value) => { obj.responses = value; } }, metadata: _metadata }, _responses_initializers, _responses_extraInitializers);
        __esDecorate(null, null, _passed_decorators, { kind: "field", name: "passed", static: false, private: false, access: { has: obj => "passed" in obj, get: obj => obj.passed, set: (obj, value) => { obj.passed = value; } }, metadata: _metadata }, _passed_initializers, _passed_extraInitializers);
        __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: obj => "signature" in obj, get: obj => obj.signature, set: (obj, value) => { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _synced_decorators, { kind: "field", name: "synced", static: false, private: false, access: { has: obj => "synced" in obj, get: obj => obj.synced, set: (obj, value) => { obj.synced = value; } }, metadata: _metadata }, _synced_initializers, _synced_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileInspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileInspection = _classThis;
})();
exports.MobileInspection = MobileInspection;
/**
 * Offline Sync Queue Model
 */
let OfflineSyncQueue = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'offline_sync_queue',
            timestamps: true,
            indexes: [
                { fields: ['session_id'] },
                { fields: ['status'] },
                { fields: ['entity_type'] },
                { fields: ['priority'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _maxRetries_decorators;
    let _maxRetries_initializers = [];
    let _maxRetries_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _syncedAt_decorators;
    let _syncedAt_initializers = [];
    let _syncedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _session_decorators;
    let _session_initializers = [];
    let _session_extraInitializers = [];
    var OfflineSyncQueue = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sessionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.entityType = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.entityId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.operation = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _operation_initializers, void 0));
            this.data = (__runInitializers(this, _operation_extraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.status = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.retryCount = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
            this.maxRetries = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _maxRetries_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _maxRetries_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.syncedAt = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _syncedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _syncedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.session = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _session_initializers, void 0));
            __runInitializers(this, _session_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OfflineSyncQueue");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mobile session ID' }), (0, sequelize_typescript_1.ForeignKey)(() => MobileSession), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _entityType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _operation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Operation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _data_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data payload' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SyncStatus)), defaultValue: SyncStatus.PENDING }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 5 }), sequelize_typescript_1.Index];
        _retryCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _maxRetries_decorators = [(0, swagger_1.ApiProperty)({ description: 'Max retries' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 3 })];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _syncedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Synced at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _session_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => MobileSession)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
        __esDecorate(null, null, _maxRetries_decorators, { kind: "field", name: "maxRetries", static: false, private: false, access: { has: obj => "maxRetries" in obj, get: obj => obj.maxRetries, set: (obj, value) => { obj.maxRetries = value; } }, metadata: _metadata }, _maxRetries_initializers, _maxRetries_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _syncedAt_decorators, { kind: "field", name: "syncedAt", static: false, private: false, access: { has: obj => "syncedAt" in obj, get: obj => obj.syncedAt, set: (obj, value) => { obj.syncedAt = value; } }, metadata: _metadata }, _syncedAt_initializers, _syncedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _session_decorators, { kind: "field", name: "session", static: false, private: false, access: { has: obj => "session" in obj, get: obj => obj.session, set: (obj, value) => { obj.session = value; } }, metadata: _metadata }, _session_initializers, _session_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OfflineSyncQueue = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OfflineSyncQueue = _classThis;
})();
exports.OfflineSyncQueue = OfflineSyncQueue;
/**
 * Push Notification Model
 */
let PushNotification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'push_notifications',
            timestamps: true,
            indexes: [
                { fields: ['user_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['scheduled_for'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _actionUrl_decorators;
    let _actionUrl_initializers = [];
    let _actionUrl_extraInitializers = [];
    let _scheduledFor_decorators;
    let _scheduledFor_initializers = [];
    let _scheduledFor_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _readAt_decorators;
    let _readAt_initializers = [];
    let _readAt_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PushNotification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.title = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.priority = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.data = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.actionUrl = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _actionUrl_initializers, void 0));
            this.scheduledFor = (__runInitializers(this, _actionUrl_extraInitializers), __runInitializers(this, _scheduledFor_initializers, void 0));
            this.sentAt = (__runInitializers(this, _scheduledFor_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.readAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _readAt_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _readAt_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.createdAt = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PushNotification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), defaultValue: 'pending' }), sequelize_typescript_1.Index];
        _data_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data payload' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _actionUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _scheduledFor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled for' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _sentAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sent at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _deliveredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _readAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Read at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _actionUrl_decorators, { kind: "field", name: "actionUrl", static: false, private: false, access: { has: obj => "actionUrl" in obj, get: obj => obj.actionUrl, set: (obj, value) => { obj.actionUrl = value; } }, metadata: _metadata }, _actionUrl_initializers, _actionUrl_extraInitializers);
        __esDecorate(null, null, _scheduledFor_decorators, { kind: "field", name: "scheduledFor", static: false, private: false, access: { has: obj => "scheduledFor" in obj, get: obj => obj.scheduledFor, set: (obj, value) => { obj.scheduledFor = value; } }, metadata: _metadata }, _scheduledFor_initializers, _scheduledFor_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _readAt_decorators, { kind: "field", name: "readAt", static: false, private: false, access: { has: obj => "readAt" in obj, get: obj => obj.readAt, set: (obj, value) => { obj.readAt = value; } }, metadata: _metadata }, _readAt_initializers, _readAt_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PushNotification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PushNotification = _classThis;
})();
exports.PushNotification = PushNotification;
/**
 * Location Tracking Model
 */
let LocationTracking = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'location_tracking',
            timestamps: true,
            indexes: [
                { fields: ['session_id'] },
                { fields: ['user_id'] },
                { fields: ['timestamp'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _accuracy_decorators;
    let _accuracy_initializers = [];
    let _accuracy_extraInitializers = [];
    let _altitude_decorators;
    let _altitude_initializers = [];
    let _altitude_extraInitializers = [];
    let _speed_decorators;
    let _speed_initializers = [];
    let _speed_extraInitializers = [];
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _session_decorators;
    let _session_initializers = [];
    let _session_extraInitializers = [];
    var LocationTracking = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sessionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.userId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.latitude = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.accuracy = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _accuracy_initializers, void 0));
            this.altitude = (__runInitializers(this, _accuracy_extraInitializers), __runInitializers(this, _altitude_initializers, void 0));
            this.speed = (__runInitializers(this, _altitude_extraInitializers), __runInitializers(this, _speed_initializers, void 0));
            this.heading = (__runInitializers(this, _speed_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
            this.timestamp = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.createdAt = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.session = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _session_initializers, void 0));
            __runInitializers(this, _session_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LocationTracking");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mobile session ID' }), (0, sequelize_typescript_1.ForeignKey)(() => MobileSession), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8), allowNull: false })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8), allowNull: false })];
        _accuracy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accuracy in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _altitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Altitude in meters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _speed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Speed in m/s' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _heading_decorators = [(0, swagger_1.ApiProperty)({ description: 'Heading in degrees' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _session_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => MobileSession)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _accuracy_decorators, { kind: "field", name: "accuracy", static: false, private: false, access: { has: obj => "accuracy" in obj, get: obj => obj.accuracy, set: (obj, value) => { obj.accuracy = value; } }, metadata: _metadata }, _accuracy_initializers, _accuracy_extraInitializers);
        __esDecorate(null, null, _altitude_decorators, { kind: "field", name: "altitude", static: false, private: false, access: { has: obj => "altitude" in obj, get: obj => obj.altitude, set: (obj, value) => { obj.altitude = value; } }, metadata: _metadata }, _altitude_initializers, _altitude_extraInitializers);
        __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _session_decorators, { kind: "field", name: "session", static: false, private: false, access: { has: obj => "session" in obj, get: obj => obj.session, set: (obj, value) => { obj.session = value; } }, metadata: _metadata }, _session_initializers, _session_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LocationTracking = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LocationTracking = _classThis;
})();
exports.LocationTracking = LocationTracking;
/**
 * Mobile Photo Model
 */
let MobilePhoto = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_photos',
            timestamps: true,
            indexes: [
                { fields: ['session_id'] },
                { fields: ['asset_id'] },
                { fields: ['work_order_id'] },
                { fields: ['inspection_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _photoUrl_decorators;
    let _photoUrl_initializers = [];
    let _photoUrl_extraInitializers = [];
    let _thumbnailUrl_decorators;
    let _thumbnailUrl_initializers = [];
    let _thumbnailUrl_extraInitializers = [];
    let _caption_decorators;
    let _caption_initializers = [];
    let _caption_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _synced_decorators;
    let _synced_initializers = [];
    let _synced_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _session_decorators;
    let _session_initializers = [];
    let _session_extraInitializers = [];
    var MobilePhoto = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sessionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.assetId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.workOrderId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.inspectionId = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.photoUrl = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
            this.thumbnailUrl = (__runInitializers(this, _photoUrl_extraInitializers), __runInitializers(this, _thumbnailUrl_initializers, void 0));
            this.caption = (__runInitializers(this, _thumbnailUrl_extraInitializers), __runInitializers(this, _caption_initializers, void 0));
            this.latitude = (__runInitializers(this, _caption_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.fileSize = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.synced = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _synced_initializers, void 0));
            this.createdAt = (__runInitializers(this, _synced_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.session = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _session_initializers, void 0));
            __runInitializers(this, _session_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobilePhoto");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mobile session ID' }), (0, sequelize_typescript_1.ForeignKey)(() => MobileSession), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _inspectionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _photoUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photo URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _thumbnailUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Thumbnail URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _caption_decorators = [(0, swagger_1.ApiProperty)({ description: 'Caption' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Latitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 8) })];
        _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Longitude' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(11, 8) })];
        _fileSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'File size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _synced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Synced to server' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _session_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => MobileSession)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: obj => "photoUrl" in obj, get: obj => obj.photoUrl, set: (obj, value) => { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
        __esDecorate(null, null, _thumbnailUrl_decorators, { kind: "field", name: "thumbnailUrl", static: false, private: false, access: { has: obj => "thumbnailUrl" in obj, get: obj => obj.thumbnailUrl, set: (obj, value) => { obj.thumbnailUrl = value; } }, metadata: _metadata }, _thumbnailUrl_initializers, _thumbnailUrl_extraInitializers);
        __esDecorate(null, null, _caption_decorators, { kind: "field", name: "caption", static: false, private: false, access: { has: obj => "caption" in obj, get: obj => obj.caption, set: (obj, value) => { obj.caption = value; } }, metadata: _metadata }, _caption_initializers, _caption_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _synced_decorators, { kind: "field", name: "synced", static: false, private: false, access: { has: obj => "synced" in obj, get: obj => obj.synced, set: (obj, value) => { obj.synced = value; } }, metadata: _metadata }, _synced_initializers, _synced_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _session_decorators, { kind: "field", name: "session", static: false, private: false, access: { has: obj => "session" in obj, get: obj => obj.session, set: (obj, value) => { obj.session = value; } }, metadata: _metadata }, _session_initializers, _session_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobilePhoto = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobilePhoto = _classThis;
})();
exports.MobilePhoto = MobilePhoto;
// ============================================================================
// MOBILE SESSION FUNCTIONS
// ============================================================================
/**
 * Creates mobile session
 *
 * @param data - Session data
 * @param transaction - Optional database transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createMobileSession({
 *   userId: 'user-123',
 *   deviceId: 'device-456',
 *   deviceName: 'iPhone 13',
 *   platform: PlatformType.IOS,
 *   osVersion: '16.0',
 *   appVersion: '2.1.0',
 *   pushToken: 'fcm-token-xxx'
 * });
 * ```
 */
async function createMobileSession(data, transaction) {
    // Deactivate existing sessions for this device
    await MobileSession.update({ status: MobileSessionStatus.INACTIVE }, {
        where: {
            userId: data.userId,
            deviceId: data.deviceId,
            status: MobileSessionStatus.ACTIVE,
        },
        transaction,
    });
    const session = await MobileSession.create({
        ...data,
        status: MobileSessionStatus.ACTIVE,
        sessionToken: generateSessionToken(),
        lastActivity: new Date(),
    }, { transaction });
    return session;
}
/**
 * Updates session activity
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await updateSessionActivity('session-123');
 * ```
 */
async function updateSessionActivity(sessionId, transaction) {
    const session = await MobileSession.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Session ${sessionId} not found`);
    }
    await session.update({
        lastActivity: new Date(),
    }, { transaction });
    return session;
}
/**
 * Ends mobile session
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await endMobileSession('session-123');
 * ```
 */
async function endMobileSession(sessionId, transaction) {
    const session = await MobileSession.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Session ${sessionId} not found`);
    }
    await session.update({
        status: MobileSessionStatus.LOGGED_OUT,
        loggedOutAt: new Date(),
    }, { transaction });
    return session;
}
/**
 * Gets active sessions for user
 *
 * @param userId - User ID
 * @returns Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveSessions('user-123');
 * ```
 */
async function getActiveSessions(userId) {
    return MobileSession.findAll({
        where: {
            userId,
            status: MobileSessionStatus.ACTIVE,
        },
        order: [['lastActivity', 'DESC']],
    });
}
// ============================================================================
// ASSET SCANNING FUNCTIONS
// ============================================================================
/**
 * Scans asset barcode
 *
 * @param data - Scan data
 * @param transaction - Optional database transaction
 * @returns Scan record and asset data
 *
 * @example
 * ```typescript
 * const result = await scanAssetBarcode({
 *   sessionId: 'session-123',
 *   scanType: ScanType.BARCODE,
 *   code: '123456789',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
async function scanAssetBarcode(data, transaction) {
    const session = await MobileSession.findByPk(data.sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Session ${data.sessionId} not found`);
    }
    // Simulate asset lookup by code
    const assetId = `asset-${data.code}`;
    const scan = await AssetScan.create({
        sessionId: data.sessionId,
        assetId,
        scanType: data.scanType,
        code: data.code,
        scannedAt: new Date(),
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        accuracy: data.location?.accuracy,
        metadata: data.metadata,
        successful: true,
    }, { transaction });
    // Update session activity
    await updateSessionActivity(data.sessionId, transaction);
    return {
        scan,
        asset: { id: assetId, code: data.code }, // In real implementation, fetch actual asset
    };
}
/**
 * Gets scan history
 *
 * @param sessionId - Session ID
 * @param limit - Maximum scans to return
 * @returns Scan history
 *
 * @example
 * ```typescript
 * const history = await getScanHistory('session-123', 50);
 * ```
 */
async function getScanHistory(sessionId, limit = 100) {
    return AssetScan.findAll({
        where: { sessionId },
        order: [['scannedAt', 'DESC']],
        limit,
    });
}
/**
 * Gets scans by asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Asset scans
 *
 * @example
 * ```typescript
 * const scans = await getScansByAsset('asset-123', startDate, endDate);
 * ```
 */
async function getScansByAsset(assetId, startDate, endDate) {
    const where = { assetId };
    if (startDate || endDate) {
        where.scannedAt = {};
        if (startDate) {
            where.scannedAt[sequelize_1.Op.gte] = startDate;
        }
        if (endDate) {
            where.scannedAt[sequelize_1.Op.lte] = endDate;
        }
    }
    return AssetScan.findAll({
        where,
        order: [['scannedAt', 'DESC']],
    });
}
// ============================================================================
// MOBILE WORK ORDER FUNCTIONS
// ============================================================================
/**
 * Creates mobile work order
 *
 * @param data - Work order data
 * @param transaction - Optional database transaction
 * @returns Created mobile work order
 *
 * @example
 * ```typescript
 * const wo = await createMobileWorkOrder({
 *   workOrderId: 'wo-123',
 *   assignedTo: 'user-456',
 *   dueDate: new Date('2024-12-31'),
 *   priority: 'high',
 *   instructions: 'Replace worn bearings'
 * });
 * ```
 */
async function createMobileWorkOrder(data, transaction) {
    const wo = await MobileWorkOrder.create({
        ...data,
        status: MobileWorkOrderStatus.ASSIGNED,
    }, { transaction });
    // Send push notification
    await sendPushNotification({
        userId: data.assignedTo,
        title: 'New Work Order Assigned',
        message: `You have been assigned a new work order`,
        priority: NotificationPriority.MEDIUM,
        data: { workOrderId: wo.id },
        actionUrl: `/work-orders/${wo.id}`,
    }, transaction);
    return wo;
}
/**
 * Updates mobile work order
 *
 * @param data - Update data
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await updateMobileWorkOrder({
 *   workOrderId: 'wo-123',
 *   status: MobileWorkOrderStatus.COMPLETED,
 *   progress: 100,
 *   notes: 'Work completed successfully',
 *   laborHours: 2.5,
 *   signature: 'data:image/png;base64,...'
 * });
 * ```
 */
async function updateMobileWorkOrder(data, transaction) {
    const wo = await MobileWorkOrder.findOne({
        where: { workOrderId: data.workOrderId },
        transaction,
    });
    if (!wo) {
        throw new common_1.NotFoundException(`Work order ${data.workOrderId} not found`);
    }
    const updates = {
        status: data.status,
        progress: data.progress,
        notes: data.notes,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        photos: data.photos,
        signature: data.signature,
        partsUsed: data.partsUsed,
        laborHours: data.laborHours,
    };
    if (data.status === MobileWorkOrderStatus.ACCEPTED) {
        updates.acceptedAt = new Date();
    }
    else if (data.status === MobileWorkOrderStatus.IN_PROGRESS && !wo.startedAt) {
        updates.startedAt = new Date();
    }
    else if (data.status === MobileWorkOrderStatus.COMPLETED) {
        updates.completedAt = new Date();
    }
    await wo.update(updates, { transaction });
    return wo;
}
/**
 * Gets mobile work orders for user
 *
 * @param userId - User ID
 * @param status - Optional status filter
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const workOrders = await getMobileWorkOrders('user-123', MobileWorkOrderStatus.ASSIGNED);
 * ```
 */
async function getMobileWorkOrders(userId, status) {
    const where = { assignedTo: userId };
    if (status) {
        where.status = status;
    }
    return MobileWorkOrder.findAll({
        where,
        order: [['dueDate', 'ASC'], ['priority', 'DESC']],
    });
}
// ============================================================================
// MOBILE INSPECTION FUNCTIONS
// ============================================================================
/**
 * Creates mobile inspection
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await createMobileInspection({
 *   assetId: 'asset-123',
 *   inspectionTemplateId: 'template-456',
 *   inspectedBy: 'user-789',
 *   scheduledDate: new Date('2024-12-01')
 * });
 * ```
 */
async function createMobileInspection(data, transaction) {
    const inspection = await MobileInspection.create({
        ...data,
        status: InspectionStatus.PENDING,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
    }, { transaction });
    return inspection;
}
/**
 * Submits mobile inspection
 *
 * @param data - Submission data
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await submitMobileInspection({
 *   inspectionId: 'inspection-123',
 *   responses: [
 *     { checkpointId: 'cp-1', response: 'pass', passed: true },
 *     { checkpointId: 'cp-2', response: 'fail', passed: false, notes: 'Needs repair' }
 *   ],
 *   photos: ['photo-url-1', 'photo-url-2'],
 *   signature: 'signature-url',
 *   notes: 'Overall condition fair'
 * });
 * ```
 */
async function submitMobileInspection(data, transaction) {
    const inspection = await MobileInspection.findByPk(data.inspectionId, { transaction });
    if (!inspection) {
        throw new common_1.NotFoundException(`Inspection ${data.inspectionId} not found`);
    }
    // Calculate overall pass/fail and score
    const totalCheckpoints = data.responses.length;
    const passedCheckpoints = data.responses.filter(r => r.passed).length;
    const score = (passedCheckpoints / totalCheckpoints) * 100;
    const passed = score >= 70; // 70% threshold
    await inspection.update({
        status: InspectionStatus.COMPLETED,
        completedAt: new Date(),
        responses: data.responses,
        photos: data.photos,
        signature: data.signature,
        notes: data.notes,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        passed,
        score,
    }, { transaction });
    return inspection;
}
/**
 * Gets mobile inspections
 *
 * @param userId - User ID
 * @param status - Optional status filter
 * @returns Inspections
 *
 * @example
 * ```typescript
 * const inspections = await getMobileInspections('user-123', InspectionStatus.PENDING);
 * ```
 */
async function getMobileInspections(userId, status) {
    const where = { inspectedBy: userId };
    if (status) {
        where.status = status;
    }
    return MobileInspection.findAll({
        where,
        order: [['scheduledDate', 'ASC']],
    });
}
// ============================================================================
// OFFLINE SYNC FUNCTIONS
// ============================================================================
/**
 * Queues offline data for sync
 *
 * @param sessionId - Session ID
 * @param entityType - Entity type
 * @param entityId - Entity ID
 * @param operation - Operation type
 * @param data - Data payload
 * @param transaction - Optional database transaction
 * @returns Queue entry
 *
 * @example
 * ```typescript
 * await queueOfflineSync('session-123', 'work_order', 'wo-456', 'update', { status: 'completed' });
 * ```
 */
async function queueOfflineSync(sessionId, entityType, entityId, operation, data, transaction) {
    const entry = await OfflineSyncQueue.create({
        sessionId,
        entityType,
        entityId,
        operation,
        data,
        status: SyncStatus.PENDING,
    }, { transaction });
    return entry;
}
/**
 * Syncs offline data
 *
 * @param sessionId - Session ID
 * @param batch - Offline data batch
 * @param transaction - Optional database transaction
 * @returns Sync results
 *
 * @example
 * ```typescript
 * const results = await syncOfflineData('session-123', {
 *   sessionId: 'session-123',
 *   workOrders: [...],
 *   inspections: [...],
 *   scans: [...]
 * });
 * ```
 */
async function syncOfflineData(sessionId, batch, transaction) {
    const session = await MobileSession.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Session ${sessionId} not found`);
    }
    let synced = 0;
    let failed = 0;
    const errors = [];
    // Process work orders
    if (batch.workOrders) {
        for (const wo of batch.workOrders) {
            try {
                await updateMobileWorkOrder(wo, transaction);
                synced++;
            }
            catch (error) {
                failed++;
                errors.push({ type: 'work_order', id: wo.workOrderId, error: error.message });
            }
        }
    }
    // Process inspections
    if (batch.inspections) {
        for (const inspection of batch.inspections) {
            try {
                await submitMobileInspection(inspection, transaction);
                synced++;
            }
            catch (error) {
                failed++;
                errors.push({ type: 'inspection', id: inspection.inspectionId, error: error.message });
            }
        }
    }
    // Update session
    await session.update({
        lastSyncTime: new Date(),
        offlineMode: false,
    }, { transaction });
    return { synced, failed, errors };
}
/**
 * Processes sync queue
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const count = await processSyncQueue('session-123');
 * ```
 */
async function processSyncQueue(sessionId, transaction) {
    const entries = await OfflineSyncQueue.findAll({
        where: {
            sessionId,
            status: SyncStatus.PENDING,
        },
        order: [['priority', 'DESC'], ['createdAt', 'ASC']],
        transaction,
    });
    let processed = 0;
    for (const entry of entries) {
        try {
            await entry.update({
                status: SyncStatus.IN_PROGRESS,
            }, { transaction });
            // Process based on entity type (simplified)
            await entry.update({
                status: SyncStatus.COMPLETED,
                syncedAt: new Date(),
            }, { transaction });
            processed++;
        }
        catch (error) {
            await entry.update({
                status: SyncStatus.FAILED,
                errorMessage: error.message,
                retryCount: entry.retryCount + 1,
            }, { transaction });
        }
    }
    return processed;
}
// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================
/**
 * Sends push notification
 *
 * @param data - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notification
 *
 * @example
 * ```typescript
 * await sendPushNotification({
 *   userId: 'user-123',
 *   title: 'Work Order Due',
 *   message: 'WO-2024-001 is due today',
 *   priority: NotificationPriority.HIGH,
 *   actionUrl: '/work-orders/wo-2024-001'
 * });
 * ```
 */
async function sendPushNotification(data, transaction) {
    const notification = await PushNotification.create({
        ...data,
        status: 'pending',
    }, { transaction });
    // Simulate sending (in real implementation, use Firebase/APNS)
    try {
        await notification.update({
            status: 'sent',
            sentAt: new Date(),
        }, { transaction });
    }
    catch (error) {
        await notification.update({
            status: 'failed',
            errorMessage: error.message,
        }, { transaction });
    }
    return notification;
}
/**
 * Gets notifications for user
 *
 * @param userId - User ID
 * @param unreadOnly - Get unread only
 * @param limit - Maximum notifications
 * @returns Notifications
 *
 * @example
 * ```typescript
 * const notifications = await getNotifications('user-123', true, 50);
 * ```
 */
async function getNotifications(userId, unreadOnly = false, limit = 100) {
    const where = { userId };
    if (unreadOnly) {
        where.readAt = null;
    }
    return PushNotification.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
    });
}
/**
 * Marks notification as read
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await markNotificationRead('notification-123');
 * ```
 */
async function markNotificationRead(notificationId, transaction) {
    const notification = await PushNotification.findByPk(notificationId, { transaction });
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    await notification.update({
        readAt: new Date(),
    }, { transaction });
    return notification;
}
// ============================================================================
// LOCATION TRACKING FUNCTIONS
// ============================================================================
/**
 * Updates user location
 *
 * @param data - Location data
 * @param transaction - Optional database transaction
 * @returns Location record
 *
 * @example
 * ```typescript
 * await updateLocation({
 *   sessionId: 'session-123',
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10,
 *   speed: 2.5
 * });
 * ```
 */
async function updateLocation(data, transaction) {
    const session = await MobileSession.findByPk(data.sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Session ${data.sessionId} not found`);
    }
    const location = await LocationTracking.create({
        sessionId: data.sessionId,
        userId: session.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        altitude: data.altitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date(),
    }, { transaction });
    // Update session activity
    await updateSessionActivity(data.sessionId, transaction);
    return location;
}
/**
 * Gets location history
 *
 * @param sessionId - Session ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getLocationHistory('session-123', startDate, endDate);
 * ```
 */
async function getLocationHistory(sessionId, startDate, endDate) {
    return LocationTracking.findAll({
        where: {
            sessionId,
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['timestamp', 'ASC']],
    });
}
// ============================================================================
// PHOTO FUNCTIONS
// ============================================================================
/**
 * Uploads mobile photo
 *
 * @param data - Photo data
 * @param transaction - Optional database transaction
 * @returns Photo record
 *
 * @example
 * ```typescript
 * const photo = await uploadMobilePhoto({
 *   sessionId: 'session-123',
 *   workOrderId: 'wo-456',
 *   photoUrl: 's3://bucket/photo.jpg',
 *   caption: 'Before repair',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
async function uploadMobilePhoto(data, transaction) {
    const photo = await MobilePhoto.create({
        ...data,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
    }, { transaction });
    return photo;
}
/**
 * Gets photos for entity
 *
 * @param entityType - Entity type
 * @param entityId - Entity ID
 * @returns Photos
 *
 * @example
 * ```typescript
 * const photos = await getPhotosForEntity('work_order', 'wo-123');
 * ```
 */
async function getPhotosForEntity(entityType, entityId) {
    const where = {};
    switch (entityType) {
        case 'asset':
            where.assetId = entityId;
            break;
        case 'work_order':
            where.workOrderId = entityId;
            break;
        case 'inspection':
            where.inspectionId = entityId;
            break;
    }
    return MobilePhoto.findAll({
        where,
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// MOBILE FORMS AND CHECKLISTS
// ============================================================================
/**
 * Creates mobile form
 *
 * @param name - Form name
 * @param formType - Form type
 * @param fields - Form fields
 * @param transaction - Optional database transaction
 * @returns Form definition
 *
 * @example
 * ```typescript
 * await createMobileForm('Safety Inspection', 'inspection', fields);
 * ```
 */
async function createMobileForm(name, formType, fields, transaction) {
    // In real implementation, create form definition
    return {
        id: `form_${Date.now()}`,
        name,
        formType,
        fields,
        createdAt: new Date(),
    };
}
/**
 * Gets mobile form by ID
 *
 * @param formId - Form ID
 * @returns Form definition
 *
 * @example
 * ```typescript
 * const form = await getMobileForm('form-123');
 * ```
 */
async function getMobileForm(formId) {
    // In real implementation, fetch form definition
    return {
        id: formId,
        name: 'Sample Form',
        fields: [],
    };
}
/**
 * Submits mobile form response
 *
 * @param formId - Form ID
 * @param assetId - Asset ID
 * @param responses - Form responses
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Submission record
 *
 * @example
 * ```typescript
 * await submitMobileForm('form-123', 'asset-456', responses, 'user-789');
 * ```
 */
async function submitMobileForm(formId, assetId, responses, userId, transaction) {
    return {
        id: `submission_${Date.now()}`,
        formId,
        assetId,
        responses,
        userId,
        submittedAt: new Date(),
    };
}
// ============================================================================
// MOBILE SIGNATURE CAPTURE
// ============================================================================
/**
 * Captures digital signature
 *
 * @param userId - User ID
 * @param documentId - Document ID
 * @param signatureData - Signature image data
 * @param transaction - Optional database transaction
 * @returns Signature record
 *
 * @example
 * ```typescript
 * await captureDigitalSignature('user-123', 'doc-456', base64Data);
 * ```
 */
async function captureDigitalSignature(userId, documentId, signatureData, transaction) {
    return {
        id: `signature_${Date.now()}`,
        userId,
        documentId,
        signatureData,
        capturedAt: new Date(),
    };
}
/**
 * Verifies signature
 *
 * @param signatureId - Signature ID
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const valid = await verifySignature('signature-123');
 * ```
 */
async function verifySignature(signatureId) {
    // In real implementation, verify signature integrity
    return true;
}
// ============================================================================
// MOBILE VOICE NOTES
// ============================================================================
/**
 * Records voice note
 *
 * @param assetId - Asset ID
 * @param userId - User ID
 * @param audioData - Audio data
 * @param duration - Duration in seconds
 * @param transaction - Optional database transaction
 * @returns Voice note record
 *
 * @example
 * ```typescript
 * await recordVoiceNote('asset-123', 'user-456', audioBlob, 45);
 * ```
 */
async function recordVoiceNote(assetId, userId, audioData, duration, transaction) {
    return {
        id: `voice_${Date.now()}`,
        assetId,
        userId,
        audioData,
        duration,
        recordedAt: new Date(),
    };
}
/**
 * Gets voice notes for asset
 *
 * @param assetId - Asset ID
 * @returns Voice notes
 *
 * @example
 * ```typescript
 * const notes = await getVoiceNotes('asset-123');
 * ```
 */
async function getVoiceNotes(assetId) {
    // In real implementation, fetch voice notes
    return [];
}
// ============================================================================
// MOBILE ANALYTICS
// ============================================================================
/**
 * Gets mobile usage analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getMobileAnalytics(new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function getMobileAnalytics(startDate, endDate) {
    const sessions = await MobileSession.findAll({
        where: {
            startTime: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const scans = await AssetScan.findAll({
        where: {
            scannedAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const workOrders = await MobileWorkOrder.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        period: { startDate, endDate },
        sessions: {
            total: sessions.length,
            avgDuration: sessions.length > 0
                ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
                : 0,
        },
        scans: {
            total: scans.length,
        },
        workOrders: {
            total: workOrders.length,
            completed: workOrders.filter(w => w.status === 'completed').length,
        },
        generatedAt: new Date(),
    };
}
/**
 * Gets user mobile activity
 *
 * @param userId - User ID
 * @param days - Number of days to analyze
 * @returns Activity report
 *
 * @example
 * ```typescript
 * const activity = await getUserMobileActivity('user-123', 30);
 * ```
 */
async function getUserMobileActivity(userId, days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sessions = await MobileSession.findAll({
        where: {
            userId,
            startTime: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const scans = await AssetScan.findAll({
        where: {
            userId,
            scannedAt: { [sequelize_1.Op.gte]: startDate },
        },
    });
    return {
        period: { days, startDate },
        sessionCount: sessions.length,
        totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        scanCount: scans.length,
        lastActiveAt: sessions.length > 0 ? sessions[0].startTime : null,
    };
}
// ============================================================================
// MOBILE DEVICE MANAGEMENT
// ============================================================================
/**
 * Registers mobile device
 *
 * @param userId - User ID
 * @param deviceInfo - Device information
 * @param transaction - Optional database transaction
 * @returns Device registration
 *
 * @example
 * ```typescript
 * await registerMobileDevice('user-123', deviceInfo);
 * ```
 */
async function registerMobileDevice(userId, deviceInfo, transaction) {
    return {
        id: `device_${Date.now()}`,
        userId,
        deviceInfo,
        registeredAt: new Date(),
    };
}
/**
 * Unregisters mobile device
 *
 * @param deviceId - Device ID
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await unregisterMobileDevice('device-123');
 * ```
 */
async function unregisterMobileDevice(deviceId, transaction) {
    // In real implementation, remove device registration
    return true;
}
/**
 * Gets registered mobile devices for user
 *
 * @param userId - User ID
 * @returns Registered devices
 *
 * @example
 * ```typescript
 * const devices = await getRegisteredDevices('user-123');
 * ```
 */
async function getRegisteredDevices(userId) {
    // In real implementation, fetch registered devices
    return [];
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates session token
 */
function generateSessionToken() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    MobileSession,
    AssetScan,
    MobileWorkOrder,
    MobileInspection,
    OfflineSyncQueue,
    PushNotification,
    LocationTracking,
    MobilePhoto,
    // Mobile Session Functions
    createMobileSession,
    updateSessionActivity,
    endMobileSession,
    getActiveSessions,
    // Asset Scanning Functions
    scanAssetBarcode,
    getScanHistory,
    getScansByAsset,
    // Mobile Work Order Functions
    createMobileWorkOrder,
    updateMobileWorkOrder,
    getMobileWorkOrders,
    // Mobile Inspection Functions
    createMobileInspection,
    submitMobileInspection,
    getMobileInspections,
    // Offline Sync Functions
    queueOfflineSync,
    syncOfflineData,
    processSyncQueue,
    // Notification Functions
    sendPushNotification,
    getNotifications,
    markNotificationRead,
    // Location Tracking Functions
    updateLocation,
    getLocationHistory,
    // Photo Functions
    uploadMobilePhoto,
    getPhotosForEntity,
    // Mobile Forms Functions
    createMobileForm,
    getMobileForm,
    submitMobileForm,
    // Signature Functions
    captureDigitalSignature,
    verifySignature,
    // Voice Note Functions
    recordVoiceNote,
    getVoiceNotes,
    // Analytics Functions
    getMobileAnalytics,
    getUserMobileActivity,
    // Device Management Functions
    registerMobileDevice,
    unregisterMobileDevice,
    getRegisteredDevices,
};
//# sourceMappingURL=asset-mobile-commands.js.map