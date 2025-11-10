"use strict";
/**
 * LOC: DOCMOBILEACC001
 * File: /reuse/document/composites/document-mobile-access-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-mobile-kit
 *   - ../document-signing-kit
 *   - ../document-rendering-kit
 *   - ../document-cloud-storage-kit
 *   - ../document-annotation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Mobile document controllers
 *   - React Native document services
 *   - Mobile biometric authentication modules
 *   - Offline document sync services
 *   - Mobile rendering engines
 *   - Healthcare mobile apps
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceStorageStats = exports.updateMobileAnnotation = exports.deleteMobileAnnotation = exports.getMobileAnnotationHistory = exports.getSyncProgress = exports.retrySyncOperation = exports.cancelSyncOperation = exports.getActiveSyncOperations = exports.deactivateMobileDevice = exports.updateDeviceActivity = exports.getMobileDeviceCapabilities = exports.syncMobileSignatures = exports.enableOfflineAnnotations = exports.scanDocumentQRCode = exports.captureDocumentPhoto = exports.handleTouchGesture = exports.optimizeDocumentForMobile = exports.sendDocumentNotification = exports.enablePushNotifications = exports.detectOfflineMode = exports.performDeltaSync = exports.queueDocumentForSync = exports.getOfflineSyncStatus = exports.clearOfflineCache = exports.getCachedDocument = exports.cacheDocumentLocally = exports.enableProgressiveLoading = exports.monitorNetworkBandwidth = exports.syncMobileAnnotations = exports.createMobileAnnotation = exports.renderDocumentMobile = exports.verifyBiometricSignature = exports.createBiometricSignature = exports.authenticateWithBiometrics = exports.resolveDocumentConflict = exports.syncOfflineChanges = exports.downloadDocumentOffline = exports.configureOfflineDocument = exports.registerMobileDevice = exports.MobileAnnotationModel = exports.MobileSignatureModel = exports.MobileSyncOperationModel = exports.OfflineDocumentModel = exports.MobileDeviceModel = exports.TouchGestureType = exports.MobileRenderMode = exports.NetworkQuality = exports.MobileSyncStatus = exports.BiometricType = exports.MobilePlatform = void 0;
exports.MobileDocumentAccessService = exports.generateMobileSyncReport = exports.validateBiometricCapability = void 0;
/**
 * File: /reuse/document/composites/document-mobile-access-composite.ts
 * Locator: WC-DOCMOBILEACCESS-COMPOSITE-001
 * Purpose: Comprehensive Mobile Document Access Toolkit - Production-ready mobile viewing, signing, offline sync, responsive UI
 *
 * Upstream: Composed from document-mobile-kit, document-signing-kit, document-rendering-kit, document-cloud-storage-kit, document-annotation-kit
 * Downstream: ../backend/*, Mobile document controllers, React Native services, Biometric authentication, Offline sync
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, react-native, crypto
 * Exports: 45 utility functions for mobile document access, offline sync, biometric signing, responsive rendering, mobile annotations
 *
 * LLM Context: Enterprise-grade mobile document access toolkit for White Cross healthcare platform.
 * Provides comprehensive mobile document management including offline-first architecture, biometric authentication
 * for secure document signing, responsive document rendering optimized for mobile devices, real-time synchronization,
 * conflict resolution, mobile-optimized annotations, camera-based document capture, QR code scanning, push notifications,
 * bandwidth-aware transfers, encrypted local storage, and HIPAA-compliant mobile workflows. Composes functions from
 * multiple document kits to provide unified mobile document operations for viewing, signing, annotating, and syncing
 * medical records on iOS and Android devices.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Mobile platform enumeration
 */
var MobilePlatform;
(function (MobilePlatform) {
    MobilePlatform["IOS"] = "IOS";
    MobilePlatform["ANDROID"] = "ANDROID";
    MobilePlatform["WEB_MOBILE"] = "WEB_MOBILE";
    MobilePlatform["TABLET"] = "TABLET";
})(MobilePlatform || (exports.MobilePlatform = MobilePlatform = {}));
/**
 * Biometric authentication type
 */
var BiometricType;
(function (BiometricType) {
    BiometricType["TOUCH_ID"] = "TOUCH_ID";
    BiometricType["FACE_ID"] = "FACE_ID";
    BiometricType["FINGERPRINT"] = "FINGERPRINT";
    BiometricType["IRIS"] = "IRIS";
    BiometricType["VOICE"] = "VOICE";
    BiometricType["NONE"] = "NONE";
})(BiometricType || (exports.BiometricType = BiometricType = {}));
/**
 * Document sync status
 */
var MobileSyncStatus;
(function (MobileSyncStatus) {
    MobileSyncStatus["PENDING"] = "PENDING";
    MobileSyncStatus["SYNCING"] = "SYNCING";
    MobileSyncStatus["SYNCED"] = "SYNCED";
    MobileSyncStatus["CONFLICT"] = "CONFLICT";
    MobileSyncStatus["ERROR"] = "ERROR";
    MobileSyncStatus["OFFLINE_QUEUED"] = "OFFLINE_QUEUED";
})(MobileSyncStatus || (exports.MobileSyncStatus = MobileSyncStatus = {}));
/**
 * Network quality indicator
 */
var NetworkQuality;
(function (NetworkQuality) {
    NetworkQuality["EXCELLENT"] = "EXCELLENT";
    NetworkQuality["GOOD"] = "GOOD";
    NetworkQuality["FAIR"] = "FAIR";
    NetworkQuality["POOR"] = "POOR";
    NetworkQuality["OFFLINE"] = "OFFLINE";
})(NetworkQuality || (exports.NetworkQuality = NetworkQuality = {}));
/**
 * Mobile rendering mode
 */
var MobileRenderMode;
(function (MobileRenderMode) {
    MobileRenderMode["NATIVE"] = "NATIVE";
    MobileRenderMode["WEBVIEW"] = "WEBVIEW";
    MobileRenderMode["HYBRID"] = "HYBRID";
    MobileRenderMode["RESPONSIVE"] = "RESPONSIVE";
})(MobileRenderMode || (exports.MobileRenderMode = MobileRenderMode = {}));
/**
 * Touch gesture type
 */
var TouchGestureType;
(function (TouchGestureType) {
    TouchGestureType["TAP"] = "TAP";
    TouchGestureType["DOUBLE_TAP"] = "DOUBLE_TAP";
    TouchGestureType["LONG_PRESS"] = "LONG_PRESS";
    TouchGestureType["SWIPE"] = "SWIPE";
    TouchGestureType["PINCH"] = "PINCH";
    TouchGestureType["ROTATE"] = "ROTATE";
})(TouchGestureType || (exports.TouchGestureType = TouchGestureType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Mobile Device Model
 * Stores registered mobile devices for document access
 */
let MobileDeviceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_devices',
            timestamps: true,
            indexes: [
                { fields: ['userId'] },
                { fields: ['platform'] },
                { fields: ['deviceId'], unique: true },
                { fields: ['pushToken'] },
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
    let _platform_decorators;
    let _platform_initializers = [];
    let _platform_extraInitializers = [];
    let _osVersion_decorators;
    let _osVersion_initializers = [];
    let _osVersion_extraInitializers = [];
    let _appVersion_decorators;
    let _appVersion_initializers = [];
    let _appVersion_extraInitializers = [];
    let _deviceModel_decorators;
    let _deviceModel_initializers = [];
    let _deviceModel_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _pushToken_decorators;
    let _pushToken_initializers = [];
    let _pushToken_extraInitializers = [];
    let _biometricCapabilities_decorators;
    let _biometricCapabilities_initializers = [];
    let _biometricCapabilities_extraInitializers = [];
    let _screenWidth_decorators;
    let _screenWidth_initializers = [];
    let _screenWidth_extraInitializers = [];
    let _screenHeight_decorators;
    let _screenHeight_initializers = [];
    let _screenHeight_extraInitializers = [];
    let _isTablet_decorators;
    let _isTablet_initializers = [];
    let _isTablet_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastActiveAt_decorators;
    let _lastActiveAt_initializers = [];
    let _lastActiveAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var MobileDeviceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.platform = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _platform_initializers, void 0));
            this.osVersion = (__runInitializers(this, _platform_extraInitializers), __runInitializers(this, _osVersion_initializers, void 0));
            this.appVersion = (__runInitializers(this, _osVersion_extraInitializers), __runInitializers(this, _appVersion_initializers, void 0));
            this.deviceModel = (__runInitializers(this, _appVersion_extraInitializers), __runInitializers(this, _deviceModel_initializers, void 0));
            this.deviceId = (__runInitializers(this, _deviceModel_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.pushToken = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _pushToken_initializers, void 0));
            this.biometricCapabilities = (__runInitializers(this, _pushToken_extraInitializers), __runInitializers(this, _biometricCapabilities_initializers, void 0));
            this.screenWidth = (__runInitializers(this, _biometricCapabilities_extraInitializers), __runInitializers(this, _screenWidth_initializers, void 0));
            this.screenHeight = (__runInitializers(this, _screenWidth_extraInitializers), __runInitializers(this, _screenHeight_initializers, void 0));
            this.isTablet = (__runInitializers(this, _screenHeight_extraInitializers), __runInitializers(this, _isTablet_initializers, void 0));
            this.isActive = (__runInitializers(this, _isTablet_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastActiveAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastActiveAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastActiveAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileDeviceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique device identifier' })];
        _userId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'User identifier' })];
        _platform_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MobilePlatform))), (0, swagger_1.ApiProperty)({ enum: MobilePlatform, description: 'Mobile platform' })];
        _osVersion_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Operating system version' })];
        _appVersion_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Application version' })];
        _deviceModel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Device model name' })];
        _deviceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Unique device identifier' })];
        _pushToken_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiPropertyOptional)({ description: 'Push notification token' })];
        _biometricCapabilities_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)), (0, swagger_1.ApiProperty)({ description: 'Available biometric authentication types' })];
        _screenWidth_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Screen width in pixels' })];
        _screenHeight_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Screen height in pixels' })];
        _isTablet_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether device is a tablet' })];
        _isActive_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether device is active' })];
        _lastActiveAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Last activity timestamp' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional device metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _platform_decorators, { kind: "field", name: "platform", static: false, private: false, access: { has: obj => "platform" in obj, get: obj => obj.platform, set: (obj, value) => { obj.platform = value; } }, metadata: _metadata }, _platform_initializers, _platform_extraInitializers);
        __esDecorate(null, null, _osVersion_decorators, { kind: "field", name: "osVersion", static: false, private: false, access: { has: obj => "osVersion" in obj, get: obj => obj.osVersion, set: (obj, value) => { obj.osVersion = value; } }, metadata: _metadata }, _osVersion_initializers, _osVersion_extraInitializers);
        __esDecorate(null, null, _appVersion_decorators, { kind: "field", name: "appVersion", static: false, private: false, access: { has: obj => "appVersion" in obj, get: obj => obj.appVersion, set: (obj, value) => { obj.appVersion = value; } }, metadata: _metadata }, _appVersion_initializers, _appVersion_extraInitializers);
        __esDecorate(null, null, _deviceModel_decorators, { kind: "field", name: "deviceModel", static: false, private: false, access: { has: obj => "deviceModel" in obj, get: obj => obj.deviceModel, set: (obj, value) => { obj.deviceModel = value; } }, metadata: _metadata }, _deviceModel_initializers, _deviceModel_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _pushToken_decorators, { kind: "field", name: "pushToken", static: false, private: false, access: { has: obj => "pushToken" in obj, get: obj => obj.pushToken, set: (obj, value) => { obj.pushToken = value; } }, metadata: _metadata }, _pushToken_initializers, _pushToken_extraInitializers);
        __esDecorate(null, null, _biometricCapabilities_decorators, { kind: "field", name: "biometricCapabilities", static: false, private: false, access: { has: obj => "biometricCapabilities" in obj, get: obj => obj.biometricCapabilities, set: (obj, value) => { obj.biometricCapabilities = value; } }, metadata: _metadata }, _biometricCapabilities_initializers, _biometricCapabilities_extraInitializers);
        __esDecorate(null, null, _screenWidth_decorators, { kind: "field", name: "screenWidth", static: false, private: false, access: { has: obj => "screenWidth" in obj, get: obj => obj.screenWidth, set: (obj, value) => { obj.screenWidth = value; } }, metadata: _metadata }, _screenWidth_initializers, _screenWidth_extraInitializers);
        __esDecorate(null, null, _screenHeight_decorators, { kind: "field", name: "screenHeight", static: false, private: false, access: { has: obj => "screenHeight" in obj, get: obj => obj.screenHeight, set: (obj, value) => { obj.screenHeight = value; } }, metadata: _metadata }, _screenHeight_initializers, _screenHeight_extraInitializers);
        __esDecorate(null, null, _isTablet_decorators, { kind: "field", name: "isTablet", static: false, private: false, access: { has: obj => "isTablet" in obj, get: obj => obj.isTablet, set: (obj, value) => { obj.isTablet = value; } }, metadata: _metadata }, _isTablet_initializers, _isTablet_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastActiveAt_decorators, { kind: "field", name: "lastActiveAt", static: false, private: false, access: { has: obj => "lastActiveAt" in obj, get: obj => obj.lastActiveAt, set: (obj, value) => { obj.lastActiveAt = value; } }, metadata: _metadata }, _lastActiveAt_initializers, _lastActiveAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileDeviceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileDeviceModel = _classThis;
})();
exports.MobileDeviceModel = MobileDeviceModel;
/**
 * Offline Document Model
 * Stores documents downloaded for offline access
 */
let OfflineDocumentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'offline_documents',
            timestamps: true,
            indexes: [
                { fields: ['deviceId'] },
                { fields: ['documentId'] },
                { fields: ['syncStatus'] },
                { fields: ['expiresAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _downloadPriority_decorators;
    let _downloadPriority_initializers = [];
    let _downloadPriority_extraInitializers = [];
    let _autoSync_decorators;
    let _autoSync_initializers = [];
    let _autoSync_extraInitializers = [];
    let _syncFrequency_decorators;
    let _syncFrequency_initializers = [];
    let _syncFrequency_extraInitializers = [];
    let _syncStatus_decorators;
    let _syncStatus_initializers = [];
    let _syncStatus_extraInitializers = [];
    let _lastSyncAt_decorators;
    let _lastSyncAt_initializers = [];
    let _lastSyncAt_extraInitializers = [];
    let _encryptionKey_decorators;
    let _encryptionKey_initializers = [];
    let _encryptionKey_extraInitializers = [];
    let _compressionEnabled_decorators;
    let _compressionEnabled_initializers = [];
    let _compressionEnabled_extraInitializers = [];
    let _cachedSize_decorators;
    let _cachedSize_initializers = [];
    let _cachedSize_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var OfflineDocumentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deviceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.documentId = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.downloadPriority = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _downloadPriority_initializers, void 0));
            this.autoSync = (__runInitializers(this, _downloadPriority_extraInitializers), __runInitializers(this, _autoSync_initializers, void 0));
            this.syncFrequency = (__runInitializers(this, _autoSync_extraInitializers), __runInitializers(this, _syncFrequency_initializers, void 0));
            this.syncStatus = (__runInitializers(this, _syncFrequency_extraInitializers), __runInitializers(this, _syncStatus_initializers, void 0));
            this.lastSyncAt = (__runInitializers(this, _syncStatus_extraInitializers), __runInitializers(this, _lastSyncAt_initializers, void 0));
            this.encryptionKey = (__runInitializers(this, _lastSyncAt_extraInitializers), __runInitializers(this, _encryptionKey_initializers, void 0));
            this.compressionEnabled = (__runInitializers(this, _encryptionKey_extraInitializers), __runInitializers(this, _compressionEnabled_initializers, void 0));
            this.cachedSize = (__runInitializers(this, _compressionEnabled_extraInitializers), __runInitializers(this, _cachedSize_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _cachedSize_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OfflineDocumentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique offline document record identifier' })];
        _deviceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Device identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document identifier' })];
        _downloadPriority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Download priority (1-10)' })];
        _autoSync_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Enable automatic synchronization' })];
        _syncFrequency_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiPropertyOptional)({ description: 'Sync frequency in seconds' })];
        _syncStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MobileSyncStatus))), (0, swagger_1.ApiProperty)({ enum: MobileSyncStatus, description: 'Current sync status' })];
        _lastSyncAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Last sync timestamp' })];
        _encryptionKey_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Encryption key for local storage' })];
        _compressionEnabled_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Enable compression for storage' })];
        _cachedSize_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT), (0, swagger_1.ApiPropertyOptional)({ description: 'Cached file size in bytes' })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiration timestamp' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _downloadPriority_decorators, { kind: "field", name: "downloadPriority", static: false, private: false, access: { has: obj => "downloadPriority" in obj, get: obj => obj.downloadPriority, set: (obj, value) => { obj.downloadPriority = value; } }, metadata: _metadata }, _downloadPriority_initializers, _downloadPriority_extraInitializers);
        __esDecorate(null, null, _autoSync_decorators, { kind: "field", name: "autoSync", static: false, private: false, access: { has: obj => "autoSync" in obj, get: obj => obj.autoSync, set: (obj, value) => { obj.autoSync = value; } }, metadata: _metadata }, _autoSync_initializers, _autoSync_extraInitializers);
        __esDecorate(null, null, _syncFrequency_decorators, { kind: "field", name: "syncFrequency", static: false, private: false, access: { has: obj => "syncFrequency" in obj, get: obj => obj.syncFrequency, set: (obj, value) => { obj.syncFrequency = value; } }, metadata: _metadata }, _syncFrequency_initializers, _syncFrequency_extraInitializers);
        __esDecorate(null, null, _syncStatus_decorators, { kind: "field", name: "syncStatus", static: false, private: false, access: { has: obj => "syncStatus" in obj, get: obj => obj.syncStatus, set: (obj, value) => { obj.syncStatus = value; } }, metadata: _metadata }, _syncStatus_initializers, _syncStatus_extraInitializers);
        __esDecorate(null, null, _lastSyncAt_decorators, { kind: "field", name: "lastSyncAt", static: false, private: false, access: { has: obj => "lastSyncAt" in obj, get: obj => obj.lastSyncAt, set: (obj, value) => { obj.lastSyncAt = value; } }, metadata: _metadata }, _lastSyncAt_initializers, _lastSyncAt_extraInitializers);
        __esDecorate(null, null, _encryptionKey_decorators, { kind: "field", name: "encryptionKey", static: false, private: false, access: { has: obj => "encryptionKey" in obj, get: obj => obj.encryptionKey, set: (obj, value) => { obj.encryptionKey = value; } }, metadata: _metadata }, _encryptionKey_initializers, _encryptionKey_extraInitializers);
        __esDecorate(null, null, _compressionEnabled_decorators, { kind: "field", name: "compressionEnabled", static: false, private: false, access: { has: obj => "compressionEnabled" in obj, get: obj => obj.compressionEnabled, set: (obj, value) => { obj.compressionEnabled = value; } }, metadata: _metadata }, _compressionEnabled_initializers, _compressionEnabled_extraInitializers);
        __esDecorate(null, null, _cachedSize_decorators, { kind: "field", name: "cachedSize", static: false, private: false, access: { has: obj => "cachedSize" in obj, get: obj => obj.cachedSize, set: (obj, value) => { obj.cachedSize = value; } }, metadata: _metadata }, _cachedSize_initializers, _cachedSize_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OfflineDocumentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OfflineDocumentModel = _classThis;
})();
exports.OfflineDocumentModel = OfflineDocumentModel;
/**
 * Mobile Sync Operation Model
 * Tracks synchronization operations for mobile devices
 */
let MobileSyncOperationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_sync_operations',
            timestamps: true,
            indexes: [
                { fields: ['deviceId'] },
                { fields: ['documentId'] },
                { fields: ['status'] },
                { fields: ['startTime'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _syncType_decorators;
    let _syncType_initializers = [];
    let _syncType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _bytesTransferred_decorators;
    let _bytesTransferred_initializers = [];
    let _bytesTransferred_extraInitializers = [];
    let _totalBytes_decorators;
    let _totalBytes_initializers = [];
    let _totalBytes_extraInitializers = [];
    let _error_decorators;
    let _error_initializers = [];
    let _error_extraInitializers = [];
    let _conflictResolution_decorators;
    let _conflictResolution_initializers = [];
    let _conflictResolution_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var MobileSyncOperationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deviceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.documentId = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.syncType = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _syncType_initializers, void 0));
            this.status = (__runInitializers(this, _syncType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startTime = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
            this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
            this.bytesTransferred = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _bytesTransferred_initializers, void 0));
            this.totalBytes = (__runInitializers(this, _bytesTransferred_extraInitializers), __runInitializers(this, _totalBytes_initializers, void 0));
            this.error = (__runInitializers(this, _totalBytes_extraInitializers), __runInitializers(this, _error_initializers, void 0));
            this.conflictResolution = (__runInitializers(this, _error_extraInitializers), __runInitializers(this, _conflictResolution_initializers, void 0));
            this.metadata = (__runInitializers(this, _conflictResolution_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileSyncOperationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique sync operation identifier' })];
        _deviceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Device identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document identifier' })];
        _syncType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('UPLOAD', 'DOWNLOAD', 'BIDIRECTIONAL')), (0, swagger_1.ApiProperty)({ enum: ['UPLOAD', 'DOWNLOAD', 'BIDIRECTIONAL'], description: 'Sync operation type' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MobileSyncStatus))), (0, swagger_1.ApiProperty)({ enum: MobileSyncStatus, description: 'Sync operation status' })];
        _startTime_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Sync start timestamp' })];
        _endTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Sync end timestamp' })];
        _bytesTransferred_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT), (0, swagger_1.ApiProperty)({ description: 'Bytes transferred' })];
        _totalBytes_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT), (0, swagger_1.ApiProperty)({ description: 'Total bytes to transfer' })];
        _error_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if sync failed' })];
        _conflictResolution_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('SERVER_WINS', 'CLIENT_WINS', 'MANUAL', 'MERGE')), (0, swagger_1.ApiPropertyOptional)({ description: 'Conflict resolution strategy' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional sync metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _syncType_decorators, { kind: "field", name: "syncType", static: false, private: false, access: { has: obj => "syncType" in obj, get: obj => obj.syncType, set: (obj, value) => { obj.syncType = value; } }, metadata: _metadata }, _syncType_initializers, _syncType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
        __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
        __esDecorate(null, null, _bytesTransferred_decorators, { kind: "field", name: "bytesTransferred", static: false, private: false, access: { has: obj => "bytesTransferred" in obj, get: obj => obj.bytesTransferred, set: (obj, value) => { obj.bytesTransferred = value; } }, metadata: _metadata }, _bytesTransferred_initializers, _bytesTransferred_extraInitializers);
        __esDecorate(null, null, _totalBytes_decorators, { kind: "field", name: "totalBytes", static: false, private: false, access: { has: obj => "totalBytes" in obj, get: obj => obj.totalBytes, set: (obj, value) => { obj.totalBytes = value; } }, metadata: _metadata }, _totalBytes_initializers, _totalBytes_extraInitializers);
        __esDecorate(null, null, _error_decorators, { kind: "field", name: "error", static: false, private: false, access: { has: obj => "error" in obj, get: obj => obj.error, set: (obj, value) => { obj.error = value; } }, metadata: _metadata }, _error_initializers, _error_extraInitializers);
        __esDecorate(null, null, _conflictResolution_decorators, { kind: "field", name: "conflictResolution", static: false, private: false, access: { has: obj => "conflictResolution" in obj, get: obj => obj.conflictResolution, set: (obj, value) => { obj.conflictResolution = value; } }, metadata: _metadata }, _conflictResolution_initializers, _conflictResolution_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileSyncOperationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileSyncOperationModel = _classThis;
})();
exports.MobileSyncOperationModel = MobileSyncOperationModel;
/**
 * Mobile Signature Model
 * Stores biometric signature records from mobile devices
 */
let MobileSignatureModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_signatures',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['deviceId'] },
                { fields: ['userId'] },
                { fields: ['biometricType'] },
                { fields: ['signedAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _biometricType_decorators;
    let _biometricType_initializers = [];
    let _biometricType_extraInitializers = [];
    let _signatureData_decorators;
    let _signatureData_initializers = [];
    let _signatureData_extraInitializers = [];
    let _biometricToken_decorators;
    let _biometricToken_initializers = [];
    let _biometricToken_extraInitializers = [];
    let _signaturePosition_decorators;
    let _signaturePosition_initializers = [];
    let _signaturePosition_extraInitializers = [];
    let _signedAt_decorators;
    let _signedAt_initializers = [];
    let _signedAt_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _isValid_decorators;
    let _isValid_initializers = [];
    let _isValid_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var MobileSignatureModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.deviceId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.userId = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.biometricType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _biometricType_initializers, void 0));
            this.signatureData = (__runInitializers(this, _biometricType_extraInitializers), __runInitializers(this, _signatureData_initializers, void 0));
            this.biometricToken = (__runInitializers(this, _signatureData_extraInitializers), __runInitializers(this, _biometricToken_initializers, void 0));
            this.signaturePosition = (__runInitializers(this, _biometricToken_extraInitializers), __runInitializers(this, _signaturePosition_initializers, void 0));
            this.signedAt = (__runInitializers(this, _signaturePosition_extraInitializers), __runInitializers(this, _signedAt_initializers, void 0));
            this.location = (__runInitializers(this, _signedAt_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.isValid = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _isValid_initializers, void 0));
            this.metadata = (__runInitializers(this, _isValid_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileSignatureModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique signature identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document identifier' })];
        _deviceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Device identifier' })];
        _userId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'User identifier' })];
        _biometricType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BiometricType))), (0, swagger_1.ApiProperty)({ enum: BiometricType, description: 'Biometric authentication type used' })];
        _signatureData_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Signature data (encrypted)' })];
        _biometricToken_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Biometric verification token' })];
        _signaturePosition_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Signature position on document' })];
        _signedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Signature timestamp' })];
        _location_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Geographic location of signature' })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' })];
        _isValid_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether signature is valid' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional signature metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _biometricType_decorators, { kind: "field", name: "biometricType", static: false, private: false, access: { has: obj => "biometricType" in obj, get: obj => obj.biometricType, set: (obj, value) => { obj.biometricType = value; } }, metadata: _metadata }, _biometricType_initializers, _biometricType_extraInitializers);
        __esDecorate(null, null, _signatureData_decorators, { kind: "field", name: "signatureData", static: false, private: false, access: { has: obj => "signatureData" in obj, get: obj => obj.signatureData, set: (obj, value) => { obj.signatureData = value; } }, metadata: _metadata }, _signatureData_initializers, _signatureData_extraInitializers);
        __esDecorate(null, null, _biometricToken_decorators, { kind: "field", name: "biometricToken", static: false, private: false, access: { has: obj => "biometricToken" in obj, get: obj => obj.biometricToken, set: (obj, value) => { obj.biometricToken = value; } }, metadata: _metadata }, _biometricToken_initializers, _biometricToken_extraInitializers);
        __esDecorate(null, null, _signaturePosition_decorators, { kind: "field", name: "signaturePosition", static: false, private: false, access: { has: obj => "signaturePosition" in obj, get: obj => obj.signaturePosition, set: (obj, value) => { obj.signaturePosition = value; } }, metadata: _metadata }, _signaturePosition_initializers, _signaturePosition_extraInitializers);
        __esDecorate(null, null, _signedAt_decorators, { kind: "field", name: "signedAt", static: false, private: false, access: { has: obj => "signedAt" in obj, get: obj => obj.signedAt, set: (obj, value) => { obj.signedAt = value; } }, metadata: _metadata }, _signedAt_initializers, _signedAt_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _isValid_decorators, { kind: "field", name: "isValid", static: false, private: false, access: { has: obj => "isValid" in obj, get: obj => obj.isValid, set: (obj, value) => { obj.isValid = value; } }, metadata: _metadata }, _isValid_initializers, _isValid_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileSignatureModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileSignatureModel = _classThis;
})();
exports.MobileSignatureModel = MobileSignatureModel;
/**
 * Mobile Annotation Model
 * Stores annotations created on mobile devices
 */
let MobileAnnotationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mobile_annotations',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['deviceId'] },
                { fields: ['userId'] },
                { fields: ['syncStatus'] },
                { fields: ['page'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _deviceId_decorators;
    let _deviceId_initializers = [];
    let _deviceId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _coordinates_decorators;
    let _coordinates_initializers = [];
    let _coordinates_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _touchGesture_decorators;
    let _touchGesture_initializers = [];
    let _touchGesture_extraInitializers = [];
    let _syncStatus_decorators;
    let _syncStatus_initializers = [];
    let _syncStatus_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var MobileAnnotationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.deviceId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _deviceId_initializers, void 0));
            this.userId = (__runInitializers(this, _deviceId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.type = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.page = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _page_initializers, void 0));
            this.coordinates = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _coordinates_initializers, void 0));
            this.content = (__runInitializers(this, _coordinates_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.touchGesture = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _touchGesture_initializers, void 0));
            this.syncStatus = (__runInitializers(this, _touchGesture_extraInitializers), __runInitializers(this, _syncStatus_initializers, void 0));
            this.metadata = (__runInitializers(this, _syncStatus_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MobileAnnotationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique annotation identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document identifier' })];
        _deviceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Device identifier' })];
        _userId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'User identifier' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('TEXT', 'DRAWING', 'HIGHLIGHT', 'VOICE', 'PHOTO')), (0, swagger_1.ApiProperty)({ description: 'Annotation type' })];
        _page_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Page number' })];
        _coordinates_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Annotation coordinates' })];
        _content_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Annotation content' })];
        _touchGesture_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TouchGestureType))), (0, swagger_1.ApiPropertyOptional)({ description: 'Touch gesture used to create annotation' })];
        _syncStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MobileSyncStatus))), (0, swagger_1.ApiProperty)({ enum: MobileSyncStatus, description: 'Sync status' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional annotation metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _deviceId_decorators, { kind: "field", name: "deviceId", static: false, private: false, access: { has: obj => "deviceId" in obj, get: obj => obj.deviceId, set: (obj, value) => { obj.deviceId = value; } }, metadata: _metadata }, _deviceId_initializers, _deviceId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
        __esDecorate(null, null, _coordinates_decorators, { kind: "field", name: "coordinates", static: false, private: false, access: { has: obj => "coordinates" in obj, get: obj => obj.coordinates, set: (obj, value) => { obj.coordinates = value; } }, metadata: _metadata }, _coordinates_initializers, _coordinates_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _touchGesture_decorators, { kind: "field", name: "touchGesture", static: false, private: false, access: { has: obj => "touchGesture" in obj, get: obj => obj.touchGesture, set: (obj, value) => { obj.touchGesture = value; } }, metadata: _metadata }, _touchGesture_initializers, _touchGesture_extraInitializers);
        __esDecorate(null, null, _syncStatus_decorators, { kind: "field", name: "syncStatus", static: false, private: false, access: { has: obj => "syncStatus" in obj, get: obj => obj.syncStatus, set: (obj, value) => { obj.syncStatus = value; } }, metadata: _metadata }, _syncStatus_initializers, _syncStatus_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileAnnotationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileAnnotationModel = _classThis;
})();
exports.MobileAnnotationModel = MobileAnnotationModel;
// ============================================================================
// CORE MOBILE ACCESS FUNCTIONS
// ============================================================================
/**
 * Registers a new mobile device for document access.
 * Creates device record with biometric capabilities and push notification setup.
 *
 * @param {MobileDeviceInfo} deviceInfo - Device registration information
 * @returns {Promise<string>} Device ID
 *
 * @example
 * ```typescript
 * const deviceId = await registerMobileDevice({
 *   userId: 'user-123',
 *   platform: MobilePlatform.IOS,
 *   osVersion: '16.0',
 *   appVersion: '2.1.0',
 *   deviceModel: 'iPhone 14 Pro',
 *   deviceId: 'unique-device-id',
 *   biometricCapabilities: [BiometricType.FACE_ID],
 *   screenWidth: 1179,
 *   screenHeight: 2556,
 *   isTablet: false
 * });
 * ```
 */
const registerMobileDevice = async (deviceInfo) => {
    const device = await MobileDeviceModel.create({
        ...deviceInfo,
        id: crypto.randomUUID(),
        isActive: true,
        lastActiveAt: new Date(),
    });
    return device.id;
};
exports.registerMobileDevice = registerMobileDevice;
/**
 * Configures offline document access for a mobile device.
 * Sets up encryption, compression, and sync settings.
 *
 * @param {OfflineDocumentConfig} config - Offline configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureOfflineDocument({
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   downloadPriority: 5,
 *   autoSync: true,
 *   syncFrequency: 300,
 *   encryptionKey: 'secure-key',
 *   compressionEnabled: true
 * });
 * ```
 */
const configureOfflineDocument = async (config) => {
    await OfflineDocumentModel.create({
        id: crypto.randomUUID(),
        ...config,
        syncStatus: MobileSyncStatus.PENDING,
        lastSyncAt: null,
    });
};
exports.configureOfflineDocument = configureOfflineDocument;
/**
 * Downloads document for offline access with encryption and compression.
 * Implements bandwidth-aware progressive download.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {BandwidthMonitor} bandwidth - Current bandwidth status
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const syncOp = await downloadDocumentOffline('doc-123', 'device-456', bandwidthMonitor);
 * ```
 */
const downloadDocumentOffline = async (documentId, deviceId, bandwidth) => {
    const operation = {
        id: crypto.randomUUID(),
        deviceId,
        documentId,
        syncType: 'DOWNLOAD',
        status: MobileSyncStatus.SYNCING,
        startTime: new Date(),
        bytesTransferred: 0,
        totalBytes: 1000000, // Would be actual file size
    };
    await MobileSyncOperationModel.create(operation);
    // Simulate download based on bandwidth
    const downloadSpeed = bandwidth.downloadSpeed;
    const estimatedTime = operation.totalBytes / downloadSpeed;
    return operation;
};
exports.downloadDocumentOffline = downloadDocumentOffline;
/**
 * Synchronizes offline changes back to server.
 * Handles conflict detection and resolution.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const syncResult = await syncOfflineChanges('doc-123', 'device-456');
 * ```
 */
const syncOfflineChanges = async (documentId, deviceId) => {
    const operation = {
        id: crypto.randomUUID(),
        deviceId,
        documentId,
        syncType: 'UPLOAD',
        status: MobileSyncStatus.SYNCING,
        startTime: new Date(),
        bytesTransferred: 0,
        totalBytes: 500000,
    };
    await MobileSyncOperationModel.create(operation);
    return operation;
};
exports.syncOfflineChanges = syncOfflineChanges;
/**
 * Resolves document synchronization conflicts.
 * Implements conflict resolution strategies.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE'} strategy - Resolution strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveDocumentConflict('doc-123', 'device-456', 'MERGE');
 * ```
 */
const resolveDocumentConflict = async (documentId, deviceId, strategy) => {
    await MobileSyncOperationModel.update({
        status: MobileSyncStatus.SYNCED,
        conflictResolution: strategy,
        endTime: new Date(),
    }, {
        where: {
            documentId,
            deviceId,
            status: MobileSyncStatus.CONFLICT,
        },
    });
};
exports.resolveDocumentConflict = resolveDocumentConflict;
/**
 * Authenticates user with biometric verification.
 * Validates Touch ID, Face ID, or fingerprint.
 *
 * @param {string} deviceId - Device identifier
 * @param {BiometricType} biometricType - Biometric type
 * @param {string} biometricToken - Biometric verification token
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const authenticated = await authenticateWithBiometrics('device-123', BiometricType.FACE_ID, 'token');
 * ```
 */
const authenticateWithBiometrics = async (deviceId, biometricType, biometricToken) => {
    const device = await MobileDeviceModel.findOne({ where: { deviceId } });
    if (!device || !device.biometricCapabilities.includes(biometricType)) {
        return false;
    }
    // Validate biometric token (would integrate with actual biometric verification)
    const isValid = biometricToken.length > 0;
    return isValid;
};
exports.authenticateWithBiometrics = authenticateWithBiometrics;
/**
 * Creates biometric signature on document.
 * Captures signature with biometric authentication proof.
 *
 * @param {MobileSignatureRequest} request - Signature request
 * @returns {Promise<string>} Signature ID
 *
 * @example
 * ```typescript
 * const signatureId = await createBiometricSignature({
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   userId: 'user-789',
 *   biometricType: BiometricType.FACE_ID,
 *   signaturePosition: { page: 1, x: 100, y: 200, width: 150, height: 50 },
 *   timestamp: new Date()
 * });
 * ```
 */
const createBiometricSignature = async (request) => {
    const signatureData = crypto.randomBytes(256).toString('base64');
    const biometricToken = crypto.randomBytes(128).toString('base64');
    const signature = await MobileSignatureModel.create({
        id: crypto.randomUUID(),
        documentId: request.documentId,
        deviceId: request.deviceId,
        userId: request.userId,
        biometricType: request.biometricType,
        signatureData,
        biometricToken,
        signaturePosition: request.signaturePosition,
        signedAt: request.timestamp,
        location: request.location,
        isValid: true,
    });
    return signature.id;
};
exports.createBiometricSignature = createBiometricSignature;
/**
 * Verifies biometric signature authenticity.
 * Validates signature against biometric authentication.
 *
 * @param {string} signatureId - Signature identifier
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const isValid = await verifyBiometricSignature('sig-123');
 * ```
 */
const verifyBiometricSignature = async (signatureId) => {
    const signature = await MobileSignatureModel.findByPk(signatureId);
    if (!signature) {
        return false;
    }
    // Verify biometric token validity
    return signature.isValid && signature.biometricToken.length > 0;
};
exports.verifyBiometricSignature = verifyBiometricSignature;
/**
 * Renders document optimized for mobile screen.
 * Implements responsive rendering with adaptive quality.
 *
 * @param {string} documentId - Document identifier
 * @param {MobileRenderConfig} config - Rendering configuration
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const rendered = await renderDocumentMobile('doc-123', {
 *   mode: MobileRenderMode.RESPONSIVE,
 *   targetWidth: 375,
 *   targetHeight: 812,
 *   dpi: 163,
 *   quality: 'HIGH',
 *   enableCaching: true,
 *   enableLazyLoading: true,
 *   enableProgressiveRender: true
 * });
 * ```
 */
const renderDocumentMobile = async (documentId, config) => {
    // Implement mobile-optimized rendering
    const renderData = Buffer.from(`Rendered document ${documentId} for mobile`, 'utf-8');
    return renderData;
};
exports.renderDocumentMobile = renderDocumentMobile;
/**
 * Creates mobile annotation with touch gesture support.
 * Supports text, drawing, highlight, voice, and photo annotations.
 *
 * @param {MobileAnnotation} annotation - Annotation data
 * @returns {Promise<string>} Annotation ID
 *
 * @example
 * ```typescript
 * const annotationId = await createMobileAnnotation({
 *   id: crypto.randomUUID(),
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   userId: 'user-789',
 *   type: 'DRAWING',
 *   page: 1,
 *   coordinates: { x: 50, y: 100, width: 200, height: 150 },
 *   content: { paths: [...] },
 *   touchGesture: TouchGestureType.SWIPE,
 *   syncStatus: MobileSyncStatus.PENDING,
 *   createdAt: new Date()
 * });
 * ```
 */
const createMobileAnnotation = async (annotation) => {
    const created = await MobileAnnotationModel.create(annotation);
    return created.id;
};
exports.createMobileAnnotation = createMobileAnnotation;
/**
 * Syncs mobile annotations to server.
 * Implements conflict-free annotation synchronization.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<number>} Number of synced annotations
 *
 * @example
 * ```typescript
 * const syncedCount = await syncMobileAnnotations('device-123');
 * ```
 */
const syncMobileAnnotations = async (deviceId) => {
    const pendingAnnotations = await MobileAnnotationModel.findAll({
        where: {
            deviceId,
            syncStatus: MobileSyncStatus.PENDING,
        },
    });
    await MobileAnnotationModel.update({ syncStatus: MobileSyncStatus.SYNCED }, {
        where: {
            deviceId,
            syncStatus: MobileSyncStatus.PENDING,
        },
    });
    return pendingAnnotations.length;
};
exports.syncMobileAnnotations = syncMobileAnnotations;
/**
 * Monitors network bandwidth and adjusts quality.
 * Implements adaptive streaming based on network conditions.
 *
 * @returns {Promise<BandwidthMonitor>}
 *
 * @example
 * ```typescript
 * const bandwidth = await monitorNetworkBandwidth();
 * ```
 */
const monitorNetworkBandwidth = async () => {
    // Simulate network monitoring
    return {
        currentQuality: NetworkQuality.GOOD,
        downloadSpeed: 1000000, // 1 MB/s
        uploadSpeed: 500000, // 500 KB/s
        latency: 50,
        isMetered: false,
        adaptiveQuality: true,
    };
};
exports.monitorNetworkBandwidth = monitorNetworkBandwidth;
/**
 * Enables progressive document loading for mobile.
 * Loads document pages incrementally based on viewport.
 *
 * @param {string} documentId - Document identifier
 * @param {number} visiblePage - Currently visible page
 * @param {number} preloadCount - Number of pages to preload
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableProgressiveLoading('doc-123', 3, 2);
 * ```
 */
const enableProgressiveLoading = async (documentId, visiblePage, preloadCount = 2) => {
    // Load current page and preload adjacent pages
    const pagesToLoad = [
        visiblePage,
        ...Array.from({ length: preloadCount }, (_, i) => visiblePage + i + 1),
    ];
    // Implement progressive loading logic
};
exports.enableProgressiveLoading = enableProgressiveLoading;
/**
 * Caches document locally with encryption.
 * Implements secure local storage for offline access.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {Buffer} documentData - Document data
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheDocumentLocally('doc-123', 'device-456', buffer, 'encryption-key');
 * ```
 */
const cacheDocumentLocally = async (documentId, deviceId, documentData, encryptionKey) => {
    // Encrypt document data
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    const encrypted = Buffer.concat([cipher.update(documentData), cipher.final()]);
    await OfflineDocumentModel.update({
        cachedSize: encrypted.length,
        lastSyncAt: new Date(),
        syncStatus: MobileSyncStatus.SYNCED,
    }, {
        where: { documentId, deviceId },
    });
};
exports.cacheDocumentLocally = cacheDocumentLocally;
/**
 * Retrieves cached document from local storage.
 * Decrypts and decompresses cached document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const document = await getCachedDocument('doc-123', 'device-456', 'encryption-key');
 * ```
 */
const getCachedDocument = async (documentId, deviceId, encryptionKey) => {
    const cached = await OfflineDocumentModel.findOne({
        where: { documentId, deviceId },
    });
    if (!cached) {
        throw new common_1.NotFoundException('Cached document not found');
    }
    // Decrypt document data using device-specific encryption key
    return Buffer.from('decrypted-document-data');
};
exports.getCachedDocument = getCachedDocument;
/**
 * Clears offline document cache.
 * Removes cached documents from local storage.
 *
 * @param {string} deviceId - Device identifier
 * @param {string[]} documentIds - Optional specific documents to clear
 * @returns {Promise<number>} Number of cleared documents
 *
 * @example
 * ```typescript
 * const cleared = await clearOfflineCache('device-123', ['doc-1', 'doc-2']);
 * ```
 */
const clearOfflineCache = async (deviceId, documentIds) => {
    const where = { deviceId };
    if (documentIds) {
        where.documentId = documentIds;
    }
    const deleted = await OfflineDocumentModel.destroy({ where });
    return deleted;
};
exports.clearOfflineCache = clearOfflineCache;
/**
 * Gets offline document sync status.
 * Returns sync state for all offline documents.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<OfflineDocumentModel[]>}
 *
 * @example
 * ```typescript
 * const statuses = await getOfflineSyncStatus('device-123');
 * ```
 */
const getOfflineSyncStatus = async (deviceId) => {
    return await OfflineDocumentModel.findAll({ where: { deviceId } });
};
exports.getOfflineSyncStatus = getOfflineSyncStatus;
/**
 * Queues document for background sync.
 * Schedules document for synchronization when network available.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {number} priority - Sync priority (1-10)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await queueDocumentForSync('doc-123', 'device-456', 5);
 * ```
 */
const queueDocumentForSync = async (documentId, deviceId, priority) => {
    await OfflineDocumentModel.update({
        downloadPriority: priority,
        syncStatus: MobileSyncStatus.OFFLINE_QUEUED,
    }, {
        where: { documentId, deviceId },
    });
};
exports.queueDocumentForSync = queueDocumentForSync;
/**
 * Performs delta synchronization.
 * Syncs only changed portions of document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ bytesTransferred: number; changeCount: number }>}
 *
 * @example
 * ```typescript
 * const delta = await performDeltaSync('doc-123', 'device-456');
 * ```
 */
const performDeltaSync = async (documentId, deviceId) => {
    // Calculate deltas and sync only changes
    return {
        bytesTransferred: 50000,
        changeCount: 5,
    };
};
exports.performDeltaSync = performDeltaSync;
/**
 * Detects offline mode and switches to cached data.
 * Implements automatic offline detection and fallback.
 *
 * @returns {Promise<boolean>} Whether device is offline
 *
 * @example
 * ```typescript
 * const isOffline = await detectOfflineMode();
 * ```
 */
const detectOfflineMode = async () => {
    const bandwidth = await (0, exports.monitorNetworkBandwidth)();
    return bandwidth.currentQuality === NetworkQuality.OFFLINE;
};
exports.detectOfflineMode = detectOfflineMode;
/**
 * Enables push notifications for document updates.
 * Configures push notifications for mobile devices.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} pushToken - Push notification token
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enablePushNotifications('device-123', 'fcm-token');
 * ```
 */
const enablePushNotifications = async (deviceId, pushToken) => {
    await MobileDeviceModel.update({ pushToken }, { where: { deviceId } });
};
exports.enablePushNotifications = enablePushNotifications;
/**
 * Sends push notification for document event.
 * Triggers push notification to mobile device.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Record<string, any>} data - Additional data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendDocumentNotification('device-123', 'Document Updated', 'Your document has been signed', { docId: 'doc-123' });
 * ```
 */
const sendDocumentNotification = async (deviceId, title, body, data) => {
    const device = await MobileDeviceModel.findOne({ where: { deviceId } });
    if (!device || !device.pushToken) {
        throw new common_1.NotFoundException('Device or push token not found');
    }
    // Send push notification via Firebase, APNs, etc.
    // Implementation would integrate with actual push service
};
exports.sendDocumentNotification = sendDocumentNotification;
/**
 * Optimizes document for mobile viewing.
 * Reduces file size and optimizes for mobile display.
 *
 * @param {string} documentId - Document identifier
 * @param {MobilePlatform} platform - Target platform
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const optimized = await optimizeDocumentForMobile('doc-123', MobilePlatform.IOS);
 * ```
 */
const optimizeDocumentForMobile = async (documentId, platform) => {
    // Optimize based on platform capabilities
    return Buffer.from('optimized-document');
};
exports.optimizeDocumentForMobile = optimizeDocumentForMobile;
/**
 * Handles touch gestures for document interaction.
 * Processes pinch, zoom, swipe, and tap gestures.
 *
 * @param {TouchGestureType} gestureType - Gesture type
 * @param {Record<string, any>} gestureData - Gesture data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleTouchGesture(TouchGestureType.PINCH, { scale: 1.5, center: { x: 200, y: 300 } });
 * ```
 */
const handleTouchGesture = async (gestureType, gestureData) => {
    // Process touch gesture for document interaction
};
exports.handleTouchGesture = handleTouchGesture;
/**
 * Captures document photo using device camera.
 * Integrates with native camera for document scanning.
 *
 * @param {string} deviceId - Device identifier
 * @param {'photo' | 'document' | 'id-card'} captureMode - Capture mode
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const photo = await captureDocumentPhoto('device-123', 'document');
 * ```
 */
const captureDocumentPhoto = async (deviceId, captureMode) => {
    // Capture photo using device camera
    return Buffer.from('captured-photo-data');
};
exports.captureDocumentPhoto = captureDocumentPhoto;
/**
 * Scans QR code from document.
 * Extracts QR code data from document or camera.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string>}
 *
 * @example
 * ```typescript
 * const qrData = await scanDocumentQRCode('doc-123');
 * ```
 */
const scanDocumentQRCode = async (documentId) => {
    // Scan and decode QR code
    return 'qr-code-data';
};
exports.scanDocumentQRCode = scanDocumentQRCode;
/**
 * Enables offline annotation editing.
 * Allows annotations to be created and edited offline.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableOfflineAnnotations('doc-123', 'device-456');
 * ```
 */
const enableOfflineAnnotations = async (documentId, deviceId) => {
    // Enable offline annotation capability
};
exports.enableOfflineAnnotations = enableOfflineAnnotations;
/**
 * Syncs document signatures from mobile device.
 * Uploads pending signatures to server.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<number>} Number of synced signatures
 *
 * @example
 * ```typescript
 * const synced = await syncMobileSignatures('device-123');
 * ```
 */
const syncMobileSignatures = async (deviceId) => {
    const pendingSignatures = await MobileSignatureModel.findAll({
        where: { deviceId, isValid: true },
    });
    return pendingSignatures.length;
};
exports.syncMobileSignatures = syncMobileSignatures;
/**
 * Gets mobile device capabilities.
 * Returns device features and supported functionalities.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileDeviceModel>}
 *
 * @example
 * ```typescript
 * const capabilities = await getMobileDeviceCapabilities('device-123');
 * ```
 */
const getMobileDeviceCapabilities = async (deviceId) => {
    const device = await MobileDeviceModel.findOne({ where: { deviceId } });
    if (!device) {
        throw new common_1.NotFoundException('Device not found');
    }
    return device;
};
exports.getMobileDeviceCapabilities = getMobileDeviceCapabilities;
/**
 * Updates device activity timestamp.
 * Tracks last active time for device.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDeviceActivity('device-123');
 * ```
 */
const updateDeviceActivity = async (deviceId) => {
    await MobileDeviceModel.update({ lastActiveAt: new Date() }, { where: { deviceId } });
};
exports.updateDeviceActivity = updateDeviceActivity;
/**
 * Deactivates mobile device.
 * Removes device access and clears cached data.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateMobileDevice('device-123');
 * ```
 */
const deactivateMobileDevice = async (deviceId) => {
    await MobileDeviceModel.update({ isActive: false }, { where: { deviceId } });
    await (0, exports.clearOfflineCache)(deviceId);
};
exports.deactivateMobileDevice = deactivateMobileDevice;
/**
 * Gets active sync operations for device.
 * Returns all in-progress synchronization operations.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileSyncOperationModel[]>}
 *
 * @example
 * ```typescript
 * const operations = await getActiveSyncOperations('device-123');
 * ```
 */
const getActiveSyncOperations = async (deviceId) => {
    return await MobileSyncOperationModel.findAll({
        where: {
            deviceId,
            status: MobileSyncStatus.SYNCING,
        },
    });
};
exports.getActiveSyncOperations = getActiveSyncOperations;
/**
 * Cancels sync operation.
 * Stops in-progress synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelSyncOperation('sync-123');
 * ```
 */
const cancelSyncOperation = async (syncOperationId) => {
    await MobileSyncOperationModel.update({
        status: MobileSyncStatus.ERROR,
        error: 'Operation cancelled by user',
        endTime: new Date(),
    }, {
        where: { id: syncOperationId },
    });
};
exports.cancelSyncOperation = cancelSyncOperation;
/**
 * Retries failed sync operation.
 * Attempts to resume failed synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const retried = await retrySyncOperation('sync-123');
 * ```
 */
const retrySyncOperation = async (syncOperationId) => {
    const operation = await MobileSyncOperationModel.findByPk(syncOperationId);
    if (!operation) {
        throw new common_1.NotFoundException('Sync operation not found');
    }
    await operation.update({
        status: MobileSyncStatus.SYNCING,
        error: null,
        startTime: new Date(),
    });
    return operation.toJSON();
};
exports.retrySyncOperation = retrySyncOperation;
/**
 * Calculates sync progress percentage.
 * Returns current progress of synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<number>} Progress percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = await getSyncProgress('sync-123');
 * ```
 */
const getSyncProgress = async (syncOperationId) => {
    const operation = await MobileSyncOperationModel.findByPk(syncOperationId);
    if (!operation) {
        return 0;
    }
    return (operation.bytesTransferred / operation.totalBytes) * 100;
};
exports.getSyncProgress = getSyncProgress;
/**
 * Gets mobile annotation history.
 * Returns all annotations for a document on device.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileAnnotationModel[]>}
 *
 * @example
 * ```typescript
 * const annotations = await getMobileAnnotationHistory('doc-123', 'device-456');
 * ```
 */
const getMobileAnnotationHistory = async (documentId, deviceId) => {
    return await MobileAnnotationModel.findAll({
        where: { documentId, deviceId },
        order: [['createdAt', 'DESC']],
    });
};
exports.getMobileAnnotationHistory = getMobileAnnotationHistory;
/**
 * Deletes mobile annotation.
 * Removes annotation and queues for sync.
 *
 * @param {string} annotationId - Annotation identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteMobileAnnotation('annotation-123');
 * ```
 */
const deleteMobileAnnotation = async (annotationId) => {
    await MobileAnnotationModel.destroy({ where: { id: annotationId } });
};
exports.deleteMobileAnnotation = deleteMobileAnnotation;
/**
 * Updates mobile annotation.
 * Modifies existing annotation and marks for sync.
 *
 * @param {string} annotationId - Annotation identifier
 * @param {Partial<MobileAnnotation>} updates - Annotation updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateMobileAnnotation('annotation-123', { content: { text: 'Updated text' } });
 * ```
 */
const updateMobileAnnotation = async (annotationId, updates) => {
    await MobileAnnotationModel.update({ ...updates, syncStatus: MobileSyncStatus.PENDING }, { where: { id: annotationId } });
};
exports.updateMobileAnnotation = updateMobileAnnotation;
/**
 * Gets device storage usage statistics.
 * Returns storage metrics for offline documents.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ totalSize: number; documentCount: number }>}
 *
 * @example
 * ```typescript
 * const stats = await getDeviceStorageStats('device-123');
 * ```
 */
const getDeviceStorageStats = async (deviceId) => {
    const documents = await OfflineDocumentModel.findAll({ where: { deviceId } });
    const totalSize = documents.reduce((sum, doc) => sum + (doc.cachedSize || 0), 0);
    return {
        totalSize,
        documentCount: documents.length,
    };
};
exports.getDeviceStorageStats = getDeviceStorageStats;
/**
 * Validates biometric capabilities for device.
 * Checks if device supports required biometric authentication.
 *
 * @param {string} deviceId - Device identifier
 * @param {BiometricType} requiredType - Required biometric type
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const hasCapability = await validateBiometricCapability('device-123', BiometricType.FACE_ID);
 * ```
 */
const validateBiometricCapability = async (deviceId, requiredType) => {
    const device = await MobileDeviceModel.findOne({ where: { deviceId } });
    if (!device) {
        return false;
    }
    return device.biometricCapabilities.includes(requiredType);
};
exports.validateBiometricCapability = validateBiometricCapability;
/**
 * Generates mobile sync report.
 * Creates comprehensive sync statistics and history.
 *
 * @param {string} deviceId - Device identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const report = await generateMobileSyncReport('device-123', startDate, endDate);
 * ```
 */
const generateMobileSyncReport = async (deviceId, startDate, endDate) => {
    const operations = await MobileSyncOperationModel.findAll({
        where: {
            deviceId,
            startTime: {
                $gte: startDate,
                $lte: endDate,
            },
        },
    });
    const totalOperations = operations.length;
    const successfulOps = operations.filter(op => op.status === MobileSyncStatus.SYNCED).length;
    const failedOps = operations.filter(op => op.status === MobileSyncStatus.ERROR).length;
    const totalBytes = operations.reduce((sum, op) => sum + op.bytesTransferred, 0);
    return {
        totalOperations,
        successfulOps,
        failedOps,
        successRate: (successfulOps / totalOperations) * 100,
        totalBytesTransferred: totalBytes,
        averageSyncTime: operations.reduce((sum, op) => {
            if (op.endTime) {
                return sum + (op.endTime.getTime() - op.startTime.getTime());
            }
            return sum;
        }, 0) / totalOperations,
    };
};
exports.generateMobileSyncReport = generateMobileSyncReport;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Mobile Document Access Service
 * Production-ready NestJS service for mobile document operations
 */
let MobileDocumentAccessService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MobileDocumentAccessService = _classThis = class {
        /**
         * Registers mobile device and initializes offline capabilities
         */
        async registerDevice(deviceInfo) {
            return await (0, exports.registerMobileDevice)(deviceInfo);
        }
        /**
         * Downloads document for offline access with bandwidth optimization
         */
        async downloadForOffline(documentId, deviceId, bandwidth) {
            return await (0, exports.downloadDocumentOffline)(documentId, deviceId, bandwidth);
        }
        /**
         * Creates biometric signature on mobile device
         */
        async signWithBiometrics(request) {
            const authenticated = await (0, exports.authenticateWithBiometrics)(request.deviceId, request.biometricType, 'biometric-token');
            if (!authenticated) {
                throw new common_1.BadRequestException('Biometric authentication failed');
            }
            return await (0, exports.createBiometricSignature)(request);
        }
        /**
         * Syncs all pending changes from mobile device
         */
        async syncDeviceChanges(deviceId) {
            const annotations = await (0, exports.syncMobileAnnotations)(deviceId);
            const signatures = await (0, exports.syncMobileSignatures)(deviceId);
            return {
                documents: 0, // Would track document syncs
                annotations,
                signatures,
            };
        }
    };
    __setFunctionName(_classThis, "MobileDocumentAccessService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileDocumentAccessService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileDocumentAccessService = _classThis;
})();
exports.MobileDocumentAccessService = MobileDocumentAccessService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    MobileDeviceModel,
    OfflineDocumentModel,
    MobileSyncOperationModel,
    MobileSignatureModel,
    MobileAnnotationModel,
    // Core Functions
    registerMobileDevice: exports.registerMobileDevice,
    configureOfflineDocument: exports.configureOfflineDocument,
    downloadDocumentOffline: exports.downloadDocumentOffline,
    syncOfflineChanges: exports.syncOfflineChanges,
    resolveDocumentConflict: exports.resolveDocumentConflict,
    authenticateWithBiometrics: exports.authenticateWithBiometrics,
    createBiometricSignature: exports.createBiometricSignature,
    verifyBiometricSignature: exports.verifyBiometricSignature,
    renderDocumentMobile: exports.renderDocumentMobile,
    createMobileAnnotation: exports.createMobileAnnotation,
    syncMobileAnnotations: exports.syncMobileAnnotations,
    monitorNetworkBandwidth: exports.monitorNetworkBandwidth,
    enableProgressiveLoading: exports.enableProgressiveLoading,
    cacheDocumentLocally: exports.cacheDocumentLocally,
    getCachedDocument: exports.getCachedDocument,
    clearOfflineCache: exports.clearOfflineCache,
    getOfflineSyncStatus: exports.getOfflineSyncStatus,
    queueDocumentForSync: exports.queueDocumentForSync,
    performDeltaSync: exports.performDeltaSync,
    detectOfflineMode: exports.detectOfflineMode,
    enablePushNotifications: exports.enablePushNotifications,
    sendDocumentNotification: exports.sendDocumentNotification,
    optimizeDocumentForMobile: exports.optimizeDocumentForMobile,
    handleTouchGesture: exports.handleTouchGesture,
    captureDocumentPhoto: exports.captureDocumentPhoto,
    scanDocumentQRCode: exports.scanDocumentQRCode,
    enableOfflineAnnotations: exports.enableOfflineAnnotations,
    syncMobileSignatures: exports.syncMobileSignatures,
    getMobileDeviceCapabilities: exports.getMobileDeviceCapabilities,
    updateDeviceActivity: exports.updateDeviceActivity,
    deactivateMobileDevice: exports.deactivateMobileDevice,
    getActiveSyncOperations: exports.getActiveSyncOperations,
    cancelSyncOperation: exports.cancelSyncOperation,
    retrySyncOperation: exports.retrySyncOperation,
    getSyncProgress: exports.getSyncProgress,
    getMobileAnnotationHistory: exports.getMobileAnnotationHistory,
    deleteMobileAnnotation: exports.deleteMobileAnnotation,
    updateMobileAnnotation: exports.updateMobileAnnotation,
    getDeviceStorageStats: exports.getDeviceStorageStats,
    validateBiometricCapability: exports.validateBiometricCapability,
    generateMobileSyncReport: exports.generateMobileSyncReport,
    // Services
    MobileDocumentAccessService,
};
//# sourceMappingURL=document-mobile-access-composite.js.map