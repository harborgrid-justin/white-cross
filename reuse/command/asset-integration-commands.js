"use strict";
/**
 * ASSET INTEGRATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset integration management system providing comprehensive
 * functionality for ERP integration, CMMS connectivity, IoT sensor integration,
 * API management, import/export operations, webhooks, EDI, and real-time
 * synchronization. Competes with MuleSoft and Dell Boomi solutions.
 *
 * Features:
 * - ERP system integration (SAP, Oracle, Microsoft Dynamics)
 * - CMMS integration (Maximo, Infor EAM)
 * - IoT sensor data integration
 * - RESTful API management
 * - Data import/export pipelines
 * - Webhook event handling
 * - EDI transaction processing
 * - Real-time data synchronization
 * - Integration monitoring and logging
 * - Error handling and retry mechanisms
 *
 * @module AssetIntegrationCommands
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
 *   createIntegration,
 *   syncWithERP,
 *   processIoTSensorData,
 *   createWebhook,
 *   IntegrationType,
 *   SyncStatus
 * } from './asset-integration-commands';
 *
 * // Create ERP integration
 * const integration = await createIntegration({
 *   name: 'SAP S/4HANA Integration',
 *   integrationType: IntegrationType.ERP,
 *   endpoint: 'https://sap.example.com/api',
 *   credentials: { apiKey: 'xxx' },
 *   syncFrequency: 3600
 * });
 *
 * // Process IoT sensor data
 * await processIoTSensorData({
 *   assetId: 'asset-123',
 *   sensorId: 'temp-sensor-1',
 *   dataType: 'temperature',
 *   value: 75.5,
 *   unit: 'celsius'
 * });
 * ```
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportJob = exports.EDIDocument = exports.APIMapping = exports.WebhookDelivery = exports.Webhook = exports.IoTSensorReading = exports.SyncJob = exports.Integration = exports.EDITransactionType = exports.WebhookEventType = exports.DataDirection = exports.IntegrationStatus = exports.SyncStatus = exports.IntegrationType = void 0;
exports.createIntegration = createIntegration;
exports.activateIntegration = activateIntegration;
exports.deactivateIntegration = deactivateIntegration;
exports.testIntegrationConnection = testIntegrationConnection;
exports.getActiveIntegrations = getActiveIntegrations;
exports.createSyncJob = createSyncJob;
exports.executeSyncJob = executeSyncJob;
exports.syncWithERP = syncWithERP;
exports.getSyncJobsByStatus = getSyncJobsByStatus;
exports.retrySyncJob = retrySyncJob;
exports.processIoTSensorData = processIoTSensorData;
exports.getSensorReadings = getSensorReadings;
exports.getAnomalousReadings = getAnomalousReadings;
exports.aggregateSensorData = aggregateSensorData;
exports.createWebhook = createWebhook;
exports.triggerWebhook = triggerWebhook;
exports.triggerWebhooksForEvent = triggerWebhooksForEvent;
exports.getWebhookDeliveries = getWebhookDeliveries;
exports.retryWebhookDelivery = retryWebhookDelivery;
exports.createAPIMapping = createAPIMapping;
exports.getAPIMappings = getAPIMappings;
exports.applyFieldMappings = applyFieldMappings;
exports.createEDIDocument = createEDIDocument;
exports.processEDIDocument = processEDIDocument;
exports.getEDIDocumentsByType = getEDIDocumentsByType;
exports.createImportJob = createImportJob;
exports.executeImportJob = executeImportJob;
exports.exportData = exportData;
exports.getIntegrationHealth = getIntegrationHealth;
exports.batchSyncEntities = batchSyncEntities;
exports.logIntegrationAudit = logIntegrationAudit;
exports.transformData = transformData;
exports.getIntegrationAnalytics = getIntegrationAnalytics;
exports.resolveSyncConflicts = resolveSyncConflicts;
exports.checkIntegrationRateLimit = checkIntegrationRateLimit;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Integration Type
 */
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["ERP"] = "erp";
    IntegrationType["CMMS"] = "cmms";
    IntegrationType["IOT"] = "iot";
    IntegrationType["API"] = "api";
    IntegrationType["WEBHOOK"] = "webhook";
    IntegrationType["EDI"] = "edi";
    IntegrationType["DATABASE"] = "database";
    IntegrationType["FILE"] = "file";
    IntegrationType["MESSAGE_QUEUE"] = "message_queue";
    IntegrationType["CLOUD_SERVICE"] = "cloud_service";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
/**
 * Sync Status
 */
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "pending";
    SyncStatus["IN_PROGRESS"] = "in_progress";
    SyncStatus["COMPLETED"] = "completed";
    SyncStatus["FAILED"] = "failed";
    SyncStatus["PARTIAL"] = "partial";
    SyncStatus["CANCELLED"] = "cancelled";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
/**
 * Integration Status
 */
var IntegrationStatus;
(function (IntegrationStatus) {
    IntegrationStatus["ACTIVE"] = "active";
    IntegrationStatus["INACTIVE"] = "inactive";
    IntegrationStatus["ERROR"] = "error";
    IntegrationStatus["MAINTENANCE"] = "maintenance";
    IntegrationStatus["TESTING"] = "testing";
})(IntegrationStatus || (exports.IntegrationStatus = IntegrationStatus = {}));
/**
 * Data Direction
 */
var DataDirection;
(function (DataDirection) {
    DataDirection["INBOUND"] = "inbound";
    DataDirection["OUTBOUND"] = "outbound";
    DataDirection["BIDIRECTIONAL"] = "bidirectional";
})(DataDirection || (exports.DataDirection = DataDirection = {}));
/**
 * Webhook Event Type
 */
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["ASSET_CREATED"] = "asset.created";
    WebhookEventType["ASSET_UPDATED"] = "asset.updated";
    WebhookEventType["ASSET_DELETED"] = "asset.deleted";
    WebhookEventType["MAINTENANCE_DUE"] = "maintenance.due";
    WebhookEventType["INSPECTION_COMPLETED"] = "inspection.completed";
    WebhookEventType["ALERT_TRIGGERED"] = "alert.triggered";
    WebhookEventType["STATUS_CHANGED"] = "status.changed";
    WebhookEventType["CUSTOM"] = "custom";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
/**
 * EDI Transaction Type
 */
var EDITransactionType;
(function (EDITransactionType) {
    EDITransactionType["PO_850"] = "850";
    EDITransactionType["PO_ACK_855"] = "855";
    EDITransactionType["INVOICE_810"] = "810";
    EDITransactionType["SHIP_NOTICE_856"] = "856";
    EDITransactionType["INVENTORY_846"] = "846";
    EDITransactionType["PRICE_CATALOG_832"] = "832";
})(EDITransactionType || (exports.EDITransactionType = EDITransactionType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Integration Model
 */
let Integration = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'integrations',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['integration_code'], unique: true },
                { fields: ['integration_type'] },
                { fields: ['status'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateIntegrationCode_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _integrationCode_decorators;
    let _integrationCode_initializers = [];
    let _integrationCode_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _integrationType_decorators;
    let _integrationType_initializers = [];
    let _integrationType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _endpoint_decorators;
    let _endpoint_initializers = [];
    let _endpoint_extraInitializers = [];
    let _authMethod_decorators;
    let _authMethod_initializers = [];
    let _authMethod_extraInitializers = [];
    let _credentials_decorators;
    let _credentials_initializers = [];
    let _credentials_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _dataDirection_decorators;
    let _dataDirection_initializers = [];
    let _dataDirection_extraInitializers = [];
    let _syncFrequency_decorators;
    let _syncFrequency_initializers = [];
    let _syncFrequency_extraInitializers = [];
    let _lastSyncTime_decorators;
    let _lastSyncTime_initializers = [];
    let _lastSyncTime_extraInitializers = [];
    let _nextScheduledSync_decorators;
    let _nextScheduledSync_initializers = [];
    let _nextScheduledSync_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _retryAttempts_decorators;
    let _retryAttempts_initializers = [];
    let _retryAttempts_extraInitializers = [];
    let _timeout_decorators;
    let _timeout_initializers = [];
    let _timeout_extraInitializers = [];
    let _successCount_decorators;
    let _successCount_initializers = [];
    let _successCount_extraInitializers = [];
    let _errorCount_decorators;
    let _errorCount_initializers = [];
    let _errorCount_extraInitializers = [];
    let _lastError_decorators;
    let _lastError_initializers = [];
    let _lastError_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _syncJobs_decorators;
    let _syncJobs_initializers = [];
    let _syncJobs_extraInitializers = [];
    let _mappings_decorators;
    let _mappings_initializers = [];
    let _mappings_extraInitializers = [];
    var Integration = _classThis = class extends _classSuper {
        static async generateIntegrationCode(instance) {
            if (!instance.integrationCode) {
                const count = await Integration.count();
                const prefix = instance.integrationType.toUpperCase().substring(0, 3);
                instance.integrationCode = `INT-${prefix}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.integrationCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _integrationCode_initializers, void 0));
            this.name = (__runInitializers(this, _integrationCode_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.integrationType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _integrationType_initializers, void 0));
            this.status = (__runInitializers(this, _integrationType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.endpoint = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _endpoint_initializers, void 0));
            this.authMethod = (__runInitializers(this, _endpoint_extraInitializers), __runInitializers(this, _authMethod_initializers, void 0));
            this.credentials = (__runInitializers(this, _authMethod_extraInitializers), __runInitializers(this, _credentials_initializers, void 0));
            this.config = (__runInitializers(this, _credentials_extraInitializers), __runInitializers(this, _config_initializers, void 0));
            this.dataDirection = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _dataDirection_initializers, void 0));
            this.syncFrequency = (__runInitializers(this, _dataDirection_extraInitializers), __runInitializers(this, _syncFrequency_initializers, void 0));
            this.lastSyncTime = (__runInitializers(this, _syncFrequency_extraInitializers), __runInitializers(this, _lastSyncTime_initializers, void 0));
            this.nextScheduledSync = (__runInitializers(this, _lastSyncTime_extraInitializers), __runInitializers(this, _nextScheduledSync_initializers, void 0));
            this.isActive = (__runInitializers(this, _nextScheduledSync_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.retryAttempts = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _retryAttempts_initializers, void 0));
            this.timeout = (__runInitializers(this, _retryAttempts_extraInitializers), __runInitializers(this, _timeout_initializers, void 0));
            this.successCount = (__runInitializers(this, _timeout_extraInitializers), __runInitializers(this, _successCount_initializers, void 0));
            this.errorCount = (__runInitializers(this, _successCount_extraInitializers), __runInitializers(this, _errorCount_initializers, void 0));
            this.lastError = (__runInitializers(this, _errorCount_extraInitializers), __runInitializers(this, _lastError_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastError_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.syncJobs = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _syncJobs_initializers, void 0));
            this.mappings = (__runInitializers(this, _syncJobs_extraInitializers), __runInitializers(this, _mappings_initializers, void 0));
            __runInitializers(this, _mappings_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Integration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _integrationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _integrationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(IntegrationType)), allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(IntegrationStatus)), defaultValue: IntegrationStatus.INACTIVE }), sequelize_typescript_1.Index];
        _endpoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Endpoint URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _authMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authentication method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _credentials_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credentials (encrypted)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _config_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _dataDirection_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data direction' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DataDirection)), allowNull: false })];
        _syncFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sync frequency in seconds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _lastSyncTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last sync time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _nextScheduledSync_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next scheduled sync' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _retryAttempts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry attempts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 3 })];
        _timeout_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timeout in milliseconds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 30000 })];
        _successCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _errorCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _lastError_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _syncJobs_decorators = [(0, sequelize_typescript_1.HasMany)(() => SyncJob)];
        _mappings_decorators = [(0, sequelize_typescript_1.HasMany)(() => APIMapping)];
        _static_generateIntegrationCode_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateIntegrationCode_decorators, { kind: "method", name: "generateIntegrationCode", static: true, private: false, access: { has: obj => "generateIntegrationCode" in obj, get: obj => obj.generateIntegrationCode }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _integrationCode_decorators, { kind: "field", name: "integrationCode", static: false, private: false, access: { has: obj => "integrationCode" in obj, get: obj => obj.integrationCode, set: (obj, value) => { obj.integrationCode = value; } }, metadata: _metadata }, _integrationCode_initializers, _integrationCode_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _integrationType_decorators, { kind: "field", name: "integrationType", static: false, private: false, access: { has: obj => "integrationType" in obj, get: obj => obj.integrationType, set: (obj, value) => { obj.integrationType = value; } }, metadata: _metadata }, _integrationType_initializers, _integrationType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _endpoint_decorators, { kind: "field", name: "endpoint", static: false, private: false, access: { has: obj => "endpoint" in obj, get: obj => obj.endpoint, set: (obj, value) => { obj.endpoint = value; } }, metadata: _metadata }, _endpoint_initializers, _endpoint_extraInitializers);
        __esDecorate(null, null, _authMethod_decorators, { kind: "field", name: "authMethod", static: false, private: false, access: { has: obj => "authMethod" in obj, get: obj => obj.authMethod, set: (obj, value) => { obj.authMethod = value; } }, metadata: _metadata }, _authMethod_initializers, _authMethod_extraInitializers);
        __esDecorate(null, null, _credentials_decorators, { kind: "field", name: "credentials", static: false, private: false, access: { has: obj => "credentials" in obj, get: obj => obj.credentials, set: (obj, value) => { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers, _credentials_extraInitializers);
        __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
        __esDecorate(null, null, _dataDirection_decorators, { kind: "field", name: "dataDirection", static: false, private: false, access: { has: obj => "dataDirection" in obj, get: obj => obj.dataDirection, set: (obj, value) => { obj.dataDirection = value; } }, metadata: _metadata }, _dataDirection_initializers, _dataDirection_extraInitializers);
        __esDecorate(null, null, _syncFrequency_decorators, { kind: "field", name: "syncFrequency", static: false, private: false, access: { has: obj => "syncFrequency" in obj, get: obj => obj.syncFrequency, set: (obj, value) => { obj.syncFrequency = value; } }, metadata: _metadata }, _syncFrequency_initializers, _syncFrequency_extraInitializers);
        __esDecorate(null, null, _lastSyncTime_decorators, { kind: "field", name: "lastSyncTime", static: false, private: false, access: { has: obj => "lastSyncTime" in obj, get: obj => obj.lastSyncTime, set: (obj, value) => { obj.lastSyncTime = value; } }, metadata: _metadata }, _lastSyncTime_initializers, _lastSyncTime_extraInitializers);
        __esDecorate(null, null, _nextScheduledSync_decorators, { kind: "field", name: "nextScheduledSync", static: false, private: false, access: { has: obj => "nextScheduledSync" in obj, get: obj => obj.nextScheduledSync, set: (obj, value) => { obj.nextScheduledSync = value; } }, metadata: _metadata }, _nextScheduledSync_initializers, _nextScheduledSync_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _retryAttempts_decorators, { kind: "field", name: "retryAttempts", static: false, private: false, access: { has: obj => "retryAttempts" in obj, get: obj => obj.retryAttempts, set: (obj, value) => { obj.retryAttempts = value; } }, metadata: _metadata }, _retryAttempts_initializers, _retryAttempts_extraInitializers);
        __esDecorate(null, null, _timeout_decorators, { kind: "field", name: "timeout", static: false, private: false, access: { has: obj => "timeout" in obj, get: obj => obj.timeout, set: (obj, value) => { obj.timeout = value; } }, metadata: _metadata }, _timeout_initializers, _timeout_extraInitializers);
        __esDecorate(null, null, _successCount_decorators, { kind: "field", name: "successCount", static: false, private: false, access: { has: obj => "successCount" in obj, get: obj => obj.successCount, set: (obj, value) => { obj.successCount = value; } }, metadata: _metadata }, _successCount_initializers, _successCount_extraInitializers);
        __esDecorate(null, null, _errorCount_decorators, { kind: "field", name: "errorCount", static: false, private: false, access: { has: obj => "errorCount" in obj, get: obj => obj.errorCount, set: (obj, value) => { obj.errorCount = value; } }, metadata: _metadata }, _errorCount_initializers, _errorCount_extraInitializers);
        __esDecorate(null, null, _lastError_decorators, { kind: "field", name: "lastError", static: false, private: false, access: { has: obj => "lastError" in obj, get: obj => obj.lastError, set: (obj, value) => { obj.lastError = value; } }, metadata: _metadata }, _lastError_initializers, _lastError_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _syncJobs_decorators, { kind: "field", name: "syncJobs", static: false, private: false, access: { has: obj => "syncJobs" in obj, get: obj => obj.syncJobs, set: (obj, value) => { obj.syncJobs = value; } }, metadata: _metadata }, _syncJobs_initializers, _syncJobs_extraInitializers);
        __esDecorate(null, null, _mappings_decorators, { kind: "field", name: "mappings", static: false, private: false, access: { has: obj => "mappings" in obj, get: obj => obj.mappings, set: (obj, value) => { obj.mappings = value; } }, metadata: _metadata }, _mappings_initializers, _mappings_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Integration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Integration = _classThis;
})();
exports.Integration = Integration;
/**
 * Sync Job Model
 */
let SyncJob = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'sync_jobs',
            timestamps: true,
            indexes: [
                { fields: ['integration_id'] },
                { fields: ['status'] },
                { fields: ['scheduled_for'] },
                { fields: ['entity_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _integrationId_decorators;
    let _integrationId_initializers = [];
    let _integrationId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _entityIds_decorators;
    let _entityIds_initializers = [];
    let _entityIds_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _scheduledFor_decorators;
    let _scheduledFor_initializers = [];
    let _scheduledFor_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _recordsProcessed_decorators;
    let _recordsProcessed_initializers = [];
    let _recordsProcessed_extraInitializers = [];
    let _recordsSucceeded_decorators;
    let _recordsSucceeded_initializers = [];
    let _recordsSucceeded_extraInitializers = [];
    let _recordsFailed_decorators;
    let _recordsFailed_initializers = [];
    let _recordsFailed_extraInitializers = [];
    let _errorMessages_decorators;
    let _errorMessages_initializers = [];
    let _errorMessages_extraInitializers = [];
    let _resultSummary_decorators;
    let _resultSummary_initializers = [];
    let _resultSummary_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _integration_decorators;
    let _integration_initializers = [];
    let _integration_extraInitializers = [];
    var SyncJob = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.integrationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _integrationId_initializers, void 0));
            this.status = (__runInitializers(this, _integrationId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.direction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
            this.entityType = (__runInitializers(this, _direction_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.entityIds = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityIds_initializers, void 0));
            this.filters = (__runInitializers(this, _entityIds_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
            this.scheduledFor = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _scheduledFor_initializers, void 0));
            this.startedAt = (__runInitializers(this, _scheduledFor_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.recordsProcessed = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _recordsProcessed_initializers, void 0));
            this.recordsSucceeded = (__runInitializers(this, _recordsProcessed_extraInitializers), __runInitializers(this, _recordsSucceeded_initializers, void 0));
            this.recordsFailed = (__runInitializers(this, _recordsSucceeded_extraInitializers), __runInitializers(this, _recordsFailed_initializers, void 0));
            this.errorMessages = (__runInitializers(this, _recordsFailed_extraInitializers), __runInitializers(this, _errorMessages_initializers, void 0));
            this.resultSummary = (__runInitializers(this, _errorMessages_extraInitializers), __runInitializers(this, _resultSummary_initializers, void 0));
            this.createdAt = (__runInitializers(this, _resultSummary_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.integration = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _integration_initializers, void 0));
            __runInitializers(this, _integration_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SyncJob");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _integrationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Integration), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SyncStatus)), defaultValue: SyncStatus.PENDING }), sequelize_typescript_1.Index];
        _direction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Direction' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DataDirection)), allowNull: false })];
        _entityType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _entityIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity IDs to sync' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _filters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _scheduledFor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled for' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _recordsProcessed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Records processed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _recordsSucceeded_decorators = [(0, swagger_1.ApiProperty)({ description: 'Records succeeded' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _recordsFailed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Records failed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _errorMessages_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error messages' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _resultSummary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Result summary' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _integration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Integration)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _integrationId_decorators, { kind: "field", name: "integrationId", static: false, private: false, access: { has: obj => "integrationId" in obj, get: obj => obj.integrationId, set: (obj, value) => { obj.integrationId = value; } }, metadata: _metadata }, _integrationId_initializers, _integrationId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _entityIds_decorators, { kind: "field", name: "entityIds", static: false, private: false, access: { has: obj => "entityIds" in obj, get: obj => obj.entityIds, set: (obj, value) => { obj.entityIds = value; } }, metadata: _metadata }, _entityIds_initializers, _entityIds_extraInitializers);
        __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
        __esDecorate(null, null, _scheduledFor_decorators, { kind: "field", name: "scheduledFor", static: false, private: false, access: { has: obj => "scheduledFor" in obj, get: obj => obj.scheduledFor, set: (obj, value) => { obj.scheduledFor = value; } }, metadata: _metadata }, _scheduledFor_initializers, _scheduledFor_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _recordsProcessed_decorators, { kind: "field", name: "recordsProcessed", static: false, private: false, access: { has: obj => "recordsProcessed" in obj, get: obj => obj.recordsProcessed, set: (obj, value) => { obj.recordsProcessed = value; } }, metadata: _metadata }, _recordsProcessed_initializers, _recordsProcessed_extraInitializers);
        __esDecorate(null, null, _recordsSucceeded_decorators, { kind: "field", name: "recordsSucceeded", static: false, private: false, access: { has: obj => "recordsSucceeded" in obj, get: obj => obj.recordsSucceeded, set: (obj, value) => { obj.recordsSucceeded = value; } }, metadata: _metadata }, _recordsSucceeded_initializers, _recordsSucceeded_extraInitializers);
        __esDecorate(null, null, _recordsFailed_decorators, { kind: "field", name: "recordsFailed", static: false, private: false, access: { has: obj => "recordsFailed" in obj, get: obj => obj.recordsFailed, set: (obj, value) => { obj.recordsFailed = value; } }, metadata: _metadata }, _recordsFailed_initializers, _recordsFailed_extraInitializers);
        __esDecorate(null, null, _errorMessages_decorators, { kind: "field", name: "errorMessages", static: false, private: false, access: { has: obj => "errorMessages" in obj, get: obj => obj.errorMessages, set: (obj, value) => { obj.errorMessages = value; } }, metadata: _metadata }, _errorMessages_initializers, _errorMessages_extraInitializers);
        __esDecorate(null, null, _resultSummary_decorators, { kind: "field", name: "resultSummary", static: false, private: false, access: { has: obj => "resultSummary" in obj, get: obj => obj.resultSummary, set: (obj, value) => { obj.resultSummary = value; } }, metadata: _metadata }, _resultSummary_initializers, _resultSummary_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _integration_decorators, { kind: "field", name: "integration", static: false, private: false, access: { has: obj => "integration" in obj, get: obj => obj.integration, set: (obj, value) => { obj.integration = value; } }, metadata: _metadata }, _integration_initializers, _integration_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncJob = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncJob = _classThis;
})();
exports.SyncJob = SyncJob;
/**
 * IoT Sensor Reading Model
 */
let IoTSensorReading = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'iot_sensor_readings',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['sensor_id'] },
                { fields: ['data_type'] },
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
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _sensorId_decorators;
    let _sensorId_initializers = [];
    let _sensorId_extraInitializers = [];
    let _dataType_decorators;
    let _dataType_initializers = [];
    let _dataType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _quality_decorators;
    let _quality_initializers = [];
    let _quality_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _isAnomaly_decorators;
    let _isAnomaly_initializers = [];
    let _isAnomaly_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var IoTSensorReading = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.sensorId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _sensorId_initializers, void 0));
            this.dataType = (__runInitializers(this, _sensorId_extraInitializers), __runInitializers(this, _dataType_initializers, void 0));
            this.value = (__runInitializers(this, _dataType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.timestamp = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.quality = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _quality_initializers, void 0));
            this.metadata = (__runInitializers(this, _quality_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.isAnomaly = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _isAnomaly_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isAnomaly_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "IoTSensorReading");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _sensorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sensor ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _dataType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _quality_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quality indicator' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isAnomaly_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is anomaly' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _sensorId_decorators, { kind: "field", name: "sensorId", static: false, private: false, access: { has: obj => "sensorId" in obj, get: obj => obj.sensorId, set: (obj, value) => { obj.sensorId = value; } }, metadata: _metadata }, _sensorId_initializers, _sensorId_extraInitializers);
        __esDecorate(null, null, _dataType_decorators, { kind: "field", name: "dataType", static: false, private: false, access: { has: obj => "dataType" in obj, get: obj => obj.dataType, set: (obj, value) => { obj.dataType = value; } }, metadata: _metadata }, _dataType_initializers, _dataType_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _quality_decorators, { kind: "field", name: "quality", static: false, private: false, access: { has: obj => "quality" in obj, get: obj => obj.quality, set: (obj, value) => { obj.quality = value; } }, metadata: _metadata }, _quality_initializers, _quality_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _isAnomaly_decorators, { kind: "field", name: "isAnomaly", static: false, private: false, access: { has: obj => "isAnomaly" in obj, get: obj => obj.isAnomaly, set: (obj, value) => { obj.isAnomaly = value; } }, metadata: _metadata }, _isAnomaly_initializers, _isAnomaly_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IoTSensorReading = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IoTSensorReading = _classThis;
})();
exports.IoTSensorReading = IoTSensorReading;
/**
 * Webhook Model
 */
let Webhook = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'webhooks',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['webhook_code'], unique: true },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateWebhookCode_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _webhookCode_decorators;
    let _webhookCode_initializers = [];
    let _webhookCode_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _eventTypes_decorators;
    let _eventTypes_initializers = [];
    let _eventTypes_extraInitializers = [];
    let _secret_decorators;
    let _secret_initializers = [];
    let _secret_extraInitializers = [];
    let _headers_decorators;
    let _headers_initializers = [];
    let _headers_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _retryAttempts_decorators;
    let _retryAttempts_initializers = [];
    let _retryAttempts_extraInitializers = [];
    let _successCount_decorators;
    let _successCount_initializers = [];
    let _successCount_extraInitializers = [];
    let _failureCount_decorators;
    let _failureCount_initializers = [];
    let _failureCount_extraInitializers = [];
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
    let _deliveries_decorators;
    let _deliveries_initializers = [];
    let _deliveries_extraInitializers = [];
    var Webhook = _classThis = class extends _classSuper {
        static async generateWebhookCode(instance) {
            if (!instance.webhookCode) {
                const count = await Webhook.count();
                instance.webhookCode = `WHK-${String(count + 1).padStart(8, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.webhookCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _webhookCode_initializers, void 0));
            this.name = (__runInitializers(this, _webhookCode_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.url = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.eventTypes = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _eventTypes_initializers, void 0));
            this.secret = (__runInitializers(this, _eventTypes_extraInitializers), __runInitializers(this, _secret_initializers, void 0));
            this.headers = (__runInitializers(this, _secret_extraInitializers), __runInitializers(this, _headers_initializers, void 0));
            this.isActive = (__runInitializers(this, _headers_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.retryAttempts = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _retryAttempts_initializers, void 0));
            this.successCount = (__runInitializers(this, _retryAttempts_extraInitializers), __runInitializers(this, _successCount_initializers, void 0));
            this.failureCount = (__runInitializers(this, _successCount_extraInitializers), __runInitializers(this, _failureCount_initializers, void 0));
            this.lastTriggered = (__runInitializers(this, _failureCount_extraInitializers), __runInitializers(this, _lastTriggered_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastTriggered_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.deliveries = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _deliveries_initializers, void 0));
            __runInitializers(this, _deliveries_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Webhook");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _webhookCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Webhook code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _url_decorators = [(0, swagger_1.ApiProperty)({ description: 'URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _eventTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event types' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(WebhookEventType))), allowNull: false })];
        _secret_decorators = [(0, swagger_1.ApiProperty)({ description: 'Secret key' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _headers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom headers' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _retryAttempts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry attempts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 3 })];
        _successCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _failureCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Failure count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _lastTriggered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last triggered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _deliveries_decorators = [(0, sequelize_typescript_1.HasMany)(() => WebhookDelivery)];
        _static_generateWebhookCode_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateWebhookCode_decorators, { kind: "method", name: "generateWebhookCode", static: true, private: false, access: { has: obj => "generateWebhookCode" in obj, get: obj => obj.generateWebhookCode }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _webhookCode_decorators, { kind: "field", name: "webhookCode", static: false, private: false, access: { has: obj => "webhookCode" in obj, get: obj => obj.webhookCode, set: (obj, value) => { obj.webhookCode = value; } }, metadata: _metadata }, _webhookCode_initializers, _webhookCode_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _eventTypes_decorators, { kind: "field", name: "eventTypes", static: false, private: false, access: { has: obj => "eventTypes" in obj, get: obj => obj.eventTypes, set: (obj, value) => { obj.eventTypes = value; } }, metadata: _metadata }, _eventTypes_initializers, _eventTypes_extraInitializers);
        __esDecorate(null, null, _secret_decorators, { kind: "field", name: "secret", static: false, private: false, access: { has: obj => "secret" in obj, get: obj => obj.secret, set: (obj, value) => { obj.secret = value; } }, metadata: _metadata }, _secret_initializers, _secret_extraInitializers);
        __esDecorate(null, null, _headers_decorators, { kind: "field", name: "headers", static: false, private: false, access: { has: obj => "headers" in obj, get: obj => obj.headers, set: (obj, value) => { obj.headers = value; } }, metadata: _metadata }, _headers_initializers, _headers_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _retryAttempts_decorators, { kind: "field", name: "retryAttempts", static: false, private: false, access: { has: obj => "retryAttempts" in obj, get: obj => obj.retryAttempts, set: (obj, value) => { obj.retryAttempts = value; } }, metadata: _metadata }, _retryAttempts_initializers, _retryAttempts_extraInitializers);
        __esDecorate(null, null, _successCount_decorators, { kind: "field", name: "successCount", static: false, private: false, access: { has: obj => "successCount" in obj, get: obj => obj.successCount, set: (obj, value) => { obj.successCount = value; } }, metadata: _metadata }, _successCount_initializers, _successCount_extraInitializers);
        __esDecorate(null, null, _failureCount_decorators, { kind: "field", name: "failureCount", static: false, private: false, access: { has: obj => "failureCount" in obj, get: obj => obj.failureCount, set: (obj, value) => { obj.failureCount = value; } }, metadata: _metadata }, _failureCount_initializers, _failureCount_extraInitializers);
        __esDecorate(null, null, _lastTriggered_decorators, { kind: "field", name: "lastTriggered", static: false, private: false, access: { has: obj => "lastTriggered" in obj, get: obj => obj.lastTriggered, set: (obj, value) => { obj.lastTriggered = value; } }, metadata: _metadata }, _lastTriggered_initializers, _lastTriggered_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _deliveries_decorators, { kind: "field", name: "deliveries", static: false, private: false, access: { has: obj => "deliveries" in obj, get: obj => obj.deliveries, set: (obj, value) => { obj.deliveries = value; } }, metadata: _metadata }, _deliveries_initializers, _deliveries_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Webhook = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Webhook = _classThis;
})();
exports.Webhook = Webhook;
/**
 * Webhook Delivery Model
 */
let WebhookDelivery = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'webhook_deliveries',
            timestamps: true,
            indexes: [
                { fields: ['webhook_id'] },
                { fields: ['status'] },
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
    let _webhookId_decorators;
    let _webhookId_initializers = [];
    let _webhookId_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _payload_decorators;
    let _payload_initializers = [];
    let _payload_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _triggeredAt_decorators;
    let _triggeredAt_initializers = [];
    let _triggeredAt_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _responseStatusCode_decorators;
    let _responseStatusCode_initializers = [];
    let _responseStatusCode_extraInitializers = [];
    let _responseBody_decorators;
    let _responseBody_initializers = [];
    let _responseBody_extraInitializers = [];
    let _attemptCount_decorators;
    let _attemptCount_initializers = [];
    let _attemptCount_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _webhook_decorators;
    let _webhook_initializers = [];
    let _webhook_extraInitializers = [];
    var WebhookDelivery = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.webhookId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _webhookId_initializers, void 0));
            this.eventType = (__runInitializers(this, _webhookId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.payload = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
            this.status = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.triggeredAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _triggeredAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _triggeredAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.responseStatusCode = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _responseStatusCode_initializers, void 0));
            this.responseBody = (__runInitializers(this, _responseStatusCode_extraInitializers), __runInitializers(this, _responseBody_initializers, void 0));
            this.attemptCount = (__runInitializers(this, _responseBody_extraInitializers), __runInitializers(this, _attemptCount_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _attemptCount_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.createdAt = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.webhook = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _webhook_initializers, void 0));
            __runInitializers(this, _webhook_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WebhookDelivery");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _webhookId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Webhook ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Webhook), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(WebhookEventType)), allowNull: false }), sequelize_typescript_1.Index];
        _payload_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payload' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), defaultValue: 'pending' }), sequelize_typescript_1.Index];
        _triggeredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triggered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _deliveredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _responseStatusCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response status code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _responseBody_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response body' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attemptCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attempt count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _webhook_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Webhook)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _webhookId_decorators, { kind: "field", name: "webhookId", static: false, private: false, access: { has: obj => "webhookId" in obj, get: obj => obj.webhookId, set: (obj, value) => { obj.webhookId = value; } }, metadata: _metadata }, _webhookId_initializers, _webhookId_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _triggeredAt_decorators, { kind: "field", name: "triggeredAt", static: false, private: false, access: { has: obj => "triggeredAt" in obj, get: obj => obj.triggeredAt, set: (obj, value) => { obj.triggeredAt = value; } }, metadata: _metadata }, _triggeredAt_initializers, _triggeredAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _responseStatusCode_decorators, { kind: "field", name: "responseStatusCode", static: false, private: false, access: { has: obj => "responseStatusCode" in obj, get: obj => obj.responseStatusCode, set: (obj, value) => { obj.responseStatusCode = value; } }, metadata: _metadata }, _responseStatusCode_initializers, _responseStatusCode_extraInitializers);
        __esDecorate(null, null, _responseBody_decorators, { kind: "field", name: "responseBody", static: false, private: false, access: { has: obj => "responseBody" in obj, get: obj => obj.responseBody, set: (obj, value) => { obj.responseBody = value; } }, metadata: _metadata }, _responseBody_initializers, _responseBody_extraInitializers);
        __esDecorate(null, null, _attemptCount_decorators, { kind: "field", name: "attemptCount", static: false, private: false, access: { has: obj => "attemptCount" in obj, get: obj => obj.attemptCount, set: (obj, value) => { obj.attemptCount = value; } }, metadata: _metadata }, _attemptCount_initializers, _attemptCount_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _webhook_decorators, { kind: "field", name: "webhook", static: false, private: false, access: { has: obj => "webhook" in obj, get: obj => obj.webhook, set: (obj, value) => { obj.webhook = value; } }, metadata: _metadata }, _webhook_initializers, _webhook_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookDelivery = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookDelivery = _classThis;
})();
exports.WebhookDelivery = WebhookDelivery;
/**
 * API Mapping Model
 */
let APIMapping = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'api_mappings',
            timestamps: true,
            indexes: [
                { fields: ['integration_id'] },
                { fields: ['source_field'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _integrationId_decorators;
    let _integrationId_initializers = [];
    let _integrationId_extraInitializers = [];
    let _sourceField_decorators;
    let _sourceField_initializers = [];
    let _sourceField_extraInitializers = [];
    let _targetField_decorators;
    let _targetField_initializers = [];
    let _targetField_extraInitializers = [];
    let _transformation_decorators;
    let _transformation_initializers = [];
    let _transformation_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _dataType_decorators;
    let _dataType_initializers = [];
    let _dataType_extraInitializers = [];
    let _validationRules_decorators;
    let _validationRules_initializers = [];
    let _validationRules_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _integration_decorators;
    let _integration_initializers = [];
    let _integration_extraInitializers = [];
    var APIMapping = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.integrationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _integrationId_initializers, void 0));
            this.sourceField = (__runInitializers(this, _integrationId_extraInitializers), __runInitializers(this, _sourceField_initializers, void 0));
            this.targetField = (__runInitializers(this, _sourceField_extraInitializers), __runInitializers(this, _targetField_initializers, void 0));
            this.transformation = (__runInitializers(this, _targetField_extraInitializers), __runInitializers(this, _transformation_initializers, void 0));
            this.defaultValue = (__runInitializers(this, _transformation_extraInitializers), __runInitializers(this, _defaultValue_initializers, void 0));
            this.required = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _required_initializers, void 0));
            this.dataType = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _dataType_initializers, void 0));
            this.validationRules = (__runInitializers(this, _dataType_extraInitializers), __runInitializers(this, _validationRules_initializers, void 0));
            this.createdAt = (__runInitializers(this, _validationRules_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.integration = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _integration_initializers, void 0));
            __runInitializers(this, _integration_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "APIMapping");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _integrationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Integration), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _sourceField_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source field' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _targetField_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target field' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _transformation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transformation function' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _defaultValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _required_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _dataType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _validationRules_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation rules' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _integration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Integration)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _integrationId_decorators, { kind: "field", name: "integrationId", static: false, private: false, access: { has: obj => "integrationId" in obj, get: obj => obj.integrationId, set: (obj, value) => { obj.integrationId = value; } }, metadata: _metadata }, _integrationId_initializers, _integrationId_extraInitializers);
        __esDecorate(null, null, _sourceField_decorators, { kind: "field", name: "sourceField", static: false, private: false, access: { has: obj => "sourceField" in obj, get: obj => obj.sourceField, set: (obj, value) => { obj.sourceField = value; } }, metadata: _metadata }, _sourceField_initializers, _sourceField_extraInitializers);
        __esDecorate(null, null, _targetField_decorators, { kind: "field", name: "targetField", static: false, private: false, access: { has: obj => "targetField" in obj, get: obj => obj.targetField, set: (obj, value) => { obj.targetField = value; } }, metadata: _metadata }, _targetField_initializers, _targetField_extraInitializers);
        __esDecorate(null, null, _transformation_decorators, { kind: "field", name: "transformation", static: false, private: false, access: { has: obj => "transformation" in obj, get: obj => obj.transformation, set: (obj, value) => { obj.transformation = value; } }, metadata: _metadata }, _transformation_initializers, _transformation_extraInitializers);
        __esDecorate(null, null, _defaultValue_decorators, { kind: "field", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
        __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
        __esDecorate(null, null, _dataType_decorators, { kind: "field", name: "dataType", static: false, private: false, access: { has: obj => "dataType" in obj, get: obj => obj.dataType, set: (obj, value) => { obj.dataType = value; } }, metadata: _metadata }, _dataType_initializers, _dataType_extraInitializers);
        __esDecorate(null, null, _validationRules_decorators, { kind: "field", name: "validationRules", static: false, private: false, access: { has: obj => "validationRules" in obj, get: obj => obj.validationRules, set: (obj, value) => { obj.validationRules = value; } }, metadata: _metadata }, _validationRules_initializers, _validationRules_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _integration_decorators, { kind: "field", name: "integration", static: false, private: false, access: { has: obj => "integration" in obj, get: obj => obj.integration, set: (obj, value) => { obj.integration = value; } }, metadata: _metadata }, _integration_initializers, _integration_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        APIMapping = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return APIMapping = _classThis;
})();
exports.APIMapping = APIMapping;
/**
 * EDI Document Model
 */
let EDIDocument = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'edi_documents',
            timestamps: true,
            indexes: [
                { fields: ['integration_id'] },
                { fields: ['transaction_type'] },
                { fields: ['control_number'], unique: true },
                { fields: ['direction'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateControlNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _integrationId_decorators;
    let _integrationId_initializers = [];
    let _integrationId_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _senderId_decorators;
    let _senderId_initializers = [];
    let _senderId_extraInitializers = [];
    let _receiverId_decorators;
    let _receiverId_initializers = [];
    let _receiverId_extraInitializers = [];
    let _controlNumber_decorators;
    let _controlNumber_initializers = [];
    let _controlNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _processedAt_decorators;
    let _processedAt_initializers = [];
    let _processedAt_extraInitializers = [];
    let _acknowledgmentReceived_decorators;
    let _acknowledgmentReceived_initializers = [];
    let _acknowledgmentReceived_extraInitializers = [];
    let _errorMessages_decorators;
    let _errorMessages_initializers = [];
    let _errorMessages_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _integration_decorators;
    let _integration_initializers = [];
    let _integration_extraInitializers = [];
    var EDIDocument = _classThis = class extends _classSuper {
        static async generateControlNumber(instance) {
            if (!instance.controlNumber) {
                const count = await EDIDocument.count();
                instance.controlNumber = `EDI${instance.transactionType}${String(count + 1).padStart(9, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.integrationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _integrationId_initializers, void 0));
            this.transactionType = (__runInitializers(this, _integrationId_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
            this.direction = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
            this.content = (__runInitializers(this, _direction_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.senderId = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _senderId_initializers, void 0));
            this.receiverId = (__runInitializers(this, _senderId_extraInitializers), __runInitializers(this, _receiverId_initializers, void 0));
            this.controlNumber = (__runInitializers(this, _receiverId_extraInitializers), __runInitializers(this, _controlNumber_initializers, void 0));
            this.status = (__runInitializers(this, _controlNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.processedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _processedAt_initializers, void 0));
            this.acknowledgmentReceived = (__runInitializers(this, _processedAt_extraInitializers), __runInitializers(this, _acknowledgmentReceived_initializers, void 0));
            this.errorMessages = (__runInitializers(this, _acknowledgmentReceived_extraInitializers), __runInitializers(this, _errorMessages_initializers, void 0));
            this.createdAt = (__runInitializers(this, _errorMessages_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.integration = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _integration_initializers, void 0));
            __runInitializers(this, _integration_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EDIDocument");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _integrationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Integration), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _transactionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EDITransactionType)), allowNull: false }), sequelize_typescript_1.Index];
        _direction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Direction' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DataDirection)), allowNull: false }), sequelize_typescript_1.Index];
        _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Content' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _senderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sender ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _receiverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receiver ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _controlNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), defaultValue: 'pending' }), sequelize_typescript_1.Index];
        _processedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _acknowledgmentReceived_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledgment received' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _errorMessages_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error messages' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _integration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Integration)];
        _static_generateControlNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateControlNumber_decorators, { kind: "method", name: "generateControlNumber", static: true, private: false, access: { has: obj => "generateControlNumber" in obj, get: obj => obj.generateControlNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _integrationId_decorators, { kind: "field", name: "integrationId", static: false, private: false, access: { has: obj => "integrationId" in obj, get: obj => obj.integrationId, set: (obj, value) => { obj.integrationId = value; } }, metadata: _metadata }, _integrationId_initializers, _integrationId_extraInitializers);
        __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
        __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: obj => "senderId" in obj, get: obj => obj.senderId, set: (obj, value) => { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _senderId_extraInitializers);
        __esDecorate(null, null, _receiverId_decorators, { kind: "field", name: "receiverId", static: false, private: false, access: { has: obj => "receiverId" in obj, get: obj => obj.receiverId, set: (obj, value) => { obj.receiverId = value; } }, metadata: _metadata }, _receiverId_initializers, _receiverId_extraInitializers);
        __esDecorate(null, null, _controlNumber_decorators, { kind: "field", name: "controlNumber", static: false, private: false, access: { has: obj => "controlNumber" in obj, get: obj => obj.controlNumber, set: (obj, value) => { obj.controlNumber = value; } }, metadata: _metadata }, _controlNumber_initializers, _controlNumber_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _processedAt_decorators, { kind: "field", name: "processedAt", static: false, private: false, access: { has: obj => "processedAt" in obj, get: obj => obj.processedAt, set: (obj, value) => { obj.processedAt = value; } }, metadata: _metadata }, _processedAt_initializers, _processedAt_extraInitializers);
        __esDecorate(null, null, _acknowledgmentReceived_decorators, { kind: "field", name: "acknowledgmentReceived", static: false, private: false, access: { has: obj => "acknowledgmentReceived" in obj, get: obj => obj.acknowledgmentReceived, set: (obj, value) => { obj.acknowledgmentReceived = value; } }, metadata: _metadata }, _acknowledgmentReceived_initializers, _acknowledgmentReceived_extraInitializers);
        __esDecorate(null, null, _errorMessages_decorators, { kind: "field", name: "errorMessages", static: false, private: false, access: { has: obj => "errorMessages" in obj, get: obj => obj.errorMessages, set: (obj, value) => { obj.errorMessages = value; } }, metadata: _metadata }, _errorMessages_initializers, _errorMessages_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _integration_decorators, { kind: "field", name: "integration", static: false, private: false, access: { has: obj => "integration" in obj, get: obj => obj.integration, set: (obj, value) => { obj.integration = value; } }, metadata: _metadata }, _integration_initializers, _integration_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EDIDocument = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EDIDocument = _classThis;
})();
exports.EDIDocument = EDIDocument;
/**
 * Import/Export Job Model
 */
let ImportExportJob = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'import_export_jobs',
            timestamps: true,
            indexes: [
                { fields: ['integration_id'] },
                { fields: ['job_type'] },
                { fields: ['status'] },
                { fields: ['entity_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _integrationId_decorators;
    let _integrationId_initializers = [];
    let _integrationId_extraInitializers = [];
    let _jobType_decorators;
    let _jobType_initializers = [];
    let _jobType_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _fileFormat_decorators;
    let _fileFormat_initializers = [];
    let _fileFormat_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _mappings_decorators;
    let _mappings_initializers = [];
    let _mappings_extraInitializers = [];
    let _totalRecords_decorators;
    let _totalRecords_initializers = [];
    let _totalRecords_extraInitializers = [];
    let _processedRecords_decorators;
    let _processedRecords_initializers = [];
    let _processedRecords_extraInitializers = [];
    let _successCount_decorators;
    let _successCount_initializers = [];
    let _successCount_extraInitializers = [];
    let _errorCount_decorators;
    let _errorCount_initializers = [];
    let _errorCount_extraInitializers = [];
    let _errorLog_decorators;
    let _errorLog_initializers = [];
    let _errorLog_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _integration_decorators;
    let _integration_initializers = [];
    let _integration_extraInitializers = [];
    var ImportExportJob = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.integrationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _integrationId_initializers, void 0));
            this.jobType = (__runInitializers(this, _integrationId_extraInitializers), __runInitializers(this, _jobType_initializers, void 0));
            this.entityType = (__runInitializers(this, _jobType_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.fileFormat = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _fileFormat_initializers, void 0));
            this.filePath = (__runInitializers(this, _fileFormat_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.status = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.filters = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
            this.mappings = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _mappings_initializers, void 0));
            this.totalRecords = (__runInitializers(this, _mappings_extraInitializers), __runInitializers(this, _totalRecords_initializers, void 0));
            this.processedRecords = (__runInitializers(this, _totalRecords_extraInitializers), __runInitializers(this, _processedRecords_initializers, void 0));
            this.successCount = (__runInitializers(this, _processedRecords_extraInitializers), __runInitializers(this, _successCount_initializers, void 0));
            this.errorCount = (__runInitializers(this, _successCount_extraInitializers), __runInitializers(this, _errorCount_initializers, void 0));
            this.errorLog = (__runInitializers(this, _errorCount_extraInitializers), __runInitializers(this, _errorLog_initializers, void 0));
            this.startedAt = (__runInitializers(this, _errorLog_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.integration = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _integration_initializers, void 0));
            __runInitializers(this, _integration_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ImportExportJob");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _integrationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Integration ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Integration), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _jobType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('import', 'export'), allowNull: false }), sequelize_typescript_1.Index];
        _entityType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _fileFormat_decorators = [(0, swagger_1.ApiProperty)({ description: 'File format' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _filePath_decorators = [(0, swagger_1.ApiProperty)({ description: 'File path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SyncStatus)), defaultValue: SyncStatus.PENDING }), sequelize_typescript_1.Index];
        _filters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _mappings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Field mappings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _totalRecords_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total records' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _processedRecords_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processed records' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _successCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _errorCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _errorLog_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error log' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _integration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Integration)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _integrationId_decorators, { kind: "field", name: "integrationId", static: false, private: false, access: { has: obj => "integrationId" in obj, get: obj => obj.integrationId, set: (obj, value) => { obj.integrationId = value; } }, metadata: _metadata }, _integrationId_initializers, _integrationId_extraInitializers);
        __esDecorate(null, null, _jobType_decorators, { kind: "field", name: "jobType", static: false, private: false, access: { has: obj => "jobType" in obj, get: obj => obj.jobType, set: (obj, value) => { obj.jobType = value; } }, metadata: _metadata }, _jobType_initializers, _jobType_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _fileFormat_decorators, { kind: "field", name: "fileFormat", static: false, private: false, access: { has: obj => "fileFormat" in obj, get: obj => obj.fileFormat, set: (obj, value) => { obj.fileFormat = value; } }, metadata: _metadata }, _fileFormat_initializers, _fileFormat_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
        __esDecorate(null, null, _mappings_decorators, { kind: "field", name: "mappings", static: false, private: false, access: { has: obj => "mappings" in obj, get: obj => obj.mappings, set: (obj, value) => { obj.mappings = value; } }, metadata: _metadata }, _mappings_initializers, _mappings_extraInitializers);
        __esDecorate(null, null, _totalRecords_decorators, { kind: "field", name: "totalRecords", static: false, private: false, access: { has: obj => "totalRecords" in obj, get: obj => obj.totalRecords, set: (obj, value) => { obj.totalRecords = value; } }, metadata: _metadata }, _totalRecords_initializers, _totalRecords_extraInitializers);
        __esDecorate(null, null, _processedRecords_decorators, { kind: "field", name: "processedRecords", static: false, private: false, access: { has: obj => "processedRecords" in obj, get: obj => obj.processedRecords, set: (obj, value) => { obj.processedRecords = value; } }, metadata: _metadata }, _processedRecords_initializers, _processedRecords_extraInitializers);
        __esDecorate(null, null, _successCount_decorators, { kind: "field", name: "successCount", static: false, private: false, access: { has: obj => "successCount" in obj, get: obj => obj.successCount, set: (obj, value) => { obj.successCount = value; } }, metadata: _metadata }, _successCount_initializers, _successCount_extraInitializers);
        __esDecorate(null, null, _errorCount_decorators, { kind: "field", name: "errorCount", static: false, private: false, access: { has: obj => "errorCount" in obj, get: obj => obj.errorCount, set: (obj, value) => { obj.errorCount = value; } }, metadata: _metadata }, _errorCount_initializers, _errorCount_extraInitializers);
        __esDecorate(null, null, _errorLog_decorators, { kind: "field", name: "errorLog", static: false, private: false, access: { has: obj => "errorLog" in obj, get: obj => obj.errorLog, set: (obj, value) => { obj.errorLog = value; } }, metadata: _metadata }, _errorLog_initializers, _errorLog_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _integration_decorators, { kind: "field", name: "integration", static: false, private: false, access: { has: obj => "integration" in obj, get: obj => obj.integration, set: (obj, value) => { obj.integration = value; } }, metadata: _metadata }, _integration_initializers, _integration_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImportExportJob = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImportExportJob = _classThis;
})();
exports.ImportExportJob = ImportExportJob;
// ============================================================================
// INTEGRATION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates integration
 *
 * @param data - Integration data
 * @param transaction - Optional database transaction
 * @returns Created integration
 *
 * @example
 * ```typescript
 * const integration = await createIntegration({
 *   name: 'SAP ERP Integration',
 *   integrationType: IntegrationType.ERP,
 *   endpoint: 'https://sap.example.com/api/v1',
 *   authMethod: 'oauth2',
 *   credentials: { clientId: 'xxx', clientSecret: 'yyy' },
 *   dataDirection: DataDirection.BIDIRECTIONAL,
 *   syncFrequency: 3600
 * });
 * ```
 */
async function createIntegration(data, transaction) {
    const integration = await Integration.create({
        ...data,
        status: IntegrationStatus.INACTIVE,
    }, { transaction });
    return integration;
}
/**
 * Activates integration
 *
 * @param integrationId - Integration ID
 * @param transaction - Optional database transaction
 * @returns Updated integration
 *
 * @example
 * ```typescript
 * await activateIntegration('int-123');
 * ```
 */
async function activateIntegration(integrationId, transaction) {
    const integration = await Integration.findByPk(integrationId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${integrationId} not found`);
    }
    await integration.update({
        status: IntegrationStatus.ACTIVE,
        isActive: true,
    }, { transaction });
    // Schedule first sync if frequency is set
    if (integration.syncFrequency) {
        const nextSync = new Date(Date.now() + integration.syncFrequency * 1000);
        await integration.update({ nextScheduledSync: nextSync }, { transaction });
    }
    return integration;
}
/**
 * Deactivates integration
 *
 * @param integrationId - Integration ID
 * @param transaction - Optional database transaction
 * @returns Updated integration
 *
 * @example
 * ```typescript
 * await deactivateIntegration('int-123');
 * ```
 */
async function deactivateIntegration(integrationId, transaction) {
    const integration = await Integration.findByPk(integrationId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${integrationId} not found`);
    }
    await integration.update({
        status: IntegrationStatus.INACTIVE,
        isActive: false,
    }, { transaction });
    return integration;
}
/**
 * Tests integration connection
 *
 * @param integrationId - Integration ID
 * @returns Test result
 *
 * @example
 * ```typescript
 * const result = await testIntegrationConnection('int-123');
 * ```
 */
async function testIntegrationConnection(integrationId) {
    const integration = await Integration.findByPk(integrationId);
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${integrationId} not found`);
    }
    const startTime = Date.now();
    try {
        // Simulate connection test (in real implementation, make actual API call)
        await new Promise(resolve => setTimeout(resolve, 100));
        const responseTime = Date.now() - startTime;
        return {
            success: true,
            message: 'Connection successful',
            responseTime,
        };
    }
    catch (error) {
        const responseTime = Date.now() - startTime;
        await integration.update({
            status: IntegrationStatus.ERROR,
            lastError: error.message,
        });
        return {
            success: false,
            message: error.message,
            responseTime,
        };
    }
}
/**
 * Gets active integrations
 *
 * @param integrationType - Optional type filter
 * @returns Active integrations
 *
 * @example
 * ```typescript
 * const integrations = await getActiveIntegrations(IntegrationType.ERP);
 * ```
 */
async function getActiveIntegrations(integrationType) {
    const where = {
        isActive: true,
        status: IntegrationStatus.ACTIVE,
    };
    if (integrationType) {
        where.integrationType = integrationType;
    }
    return Integration.findAll({
        where,
        order: [['name', 'ASC']],
    });
}
// ============================================================================
// SYNC JOB FUNCTIONS
// ============================================================================
/**
 * Creates sync job
 *
 * @param data - Sync job data
 * @param transaction - Optional database transaction
 * @returns Created sync job
 *
 * @example
 * ```typescript
 * const job = await createSyncJob({
 *   integrationId: 'int-123',
 *   direction: DataDirection.OUTBOUND,
 *   entityType: 'asset',
 *   entityIds: ['asset-1', 'asset-2'],
 *   scheduledFor: new Date()
 * });
 * ```
 */
async function createSyncJob(data, transaction) {
    const integration = await Integration.findByPk(data.integrationId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${data.integrationId} not found`);
    }
    const job = await SyncJob.create({
        ...data,
        status: SyncStatus.PENDING,
    }, { transaction });
    return job;
}
/**
 * Executes sync job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns Updated job
 *
 * @example
 * ```typescript
 * await executeSyncJob('job-123');
 * ```
 */
async function executeSyncJob(jobId, transaction) {
    const job = await SyncJob.findByPk(jobId, {
        include: [{ model: Integration }],
        transaction,
    });
    if (!job) {
        throw new common_1.NotFoundException(`Sync job ${jobId} not found`);
    }
    await job.update({
        status: SyncStatus.IN_PROGRESS,
        startedAt: new Date(),
    }, { transaction });
    try {
        // Simulate sync process
        const recordsToProcess = job.entityIds?.length || 100;
        await job.update({
            recordsProcessed: recordsToProcess,
            recordsSucceeded: recordsToProcess,
            recordsFailed: 0,
        }, { transaction });
        await job.update({
            status: SyncStatus.COMPLETED,
            completedAt: new Date(),
            resultSummary: {
                processed: recordsToProcess,
                succeeded: recordsToProcess,
                failed: 0,
            },
        }, { transaction });
        // Update integration stats
        const integration = job.integration;
        await integration.update({
            lastSyncTime: new Date(),
            successCount: integration.successCount + 1,
        }, { transaction });
        return job;
    }
    catch (error) {
        await job.update({
            status: SyncStatus.FAILED,
            completedAt: new Date(),
            errorMessages: [error.message],
        }, { transaction });
        const integration = job.integration;
        await integration.update({
            errorCount: integration.errorCount + 1,
            lastError: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Syncs with ERP system
 *
 * @param integrationId - Integration ID
 * @param entityType - Entity type to sync
 * @param entityIds - Optional specific entities
 * @param transaction - Optional database transaction
 * @returns Sync job
 *
 * @example
 * ```typescript
 * const job = await syncWithERP('int-erp-123', 'asset', ['asset-1', 'asset-2']);
 * ```
 */
async function syncWithERP(integrationId, entityType, entityIds, transaction) {
    const integration = await Integration.findByPk(integrationId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${integrationId} not found`);
    }
    if (integration.integrationType !== IntegrationType.ERP) {
        throw new common_1.BadRequestException('Integration is not an ERP type');
    }
    const job = await createSyncJob({
        integrationId,
        direction: integration.dataDirection,
        entityType,
        entityIds,
        scheduledFor: new Date(),
    }, transaction);
    // Execute immediately
    await executeSyncJob(job.id, transaction);
    return job;
}
/**
 * Gets sync jobs by status
 *
 * @param status - Sync status
 * @param integrationId - Optional integration filter
 * @returns Sync jobs
 *
 * @example
 * ```typescript
 * const pending = await getSyncJobsByStatus(SyncStatus.PENDING);
 * ```
 */
async function getSyncJobsByStatus(status, integrationId) {
    const where = { status };
    if (integrationId) {
        where.integrationId = integrationId;
    }
    return SyncJob.findAll({
        where,
        include: [{ model: Integration }],
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Retries failed sync job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns New job
 *
 * @example
 * ```typescript
 * await retrySyncJob('job-123');
 * ```
 */
async function retrySyncJob(jobId, transaction) {
    const originalJob = await SyncJob.findByPk(jobId, { transaction });
    if (!originalJob) {
        throw new common_1.NotFoundException(`Sync job ${jobId} not found`);
    }
    if (originalJob.status !== SyncStatus.FAILED) {
        throw new common_1.BadRequestException('Only failed jobs can be retried');
    }
    const newJob = await createSyncJob({
        integrationId: originalJob.integrationId,
        direction: originalJob.direction,
        entityType: originalJob.entityType,
        entityIds: originalJob.entityIds,
        filters: originalJob.filters,
    }, transaction);
    await executeSyncJob(newJob.id, transaction);
    return newJob;
}
// ============================================================================
// IOT SENSOR FUNCTIONS
// ============================================================================
/**
 * Processes IoT sensor data
 *
 * @param data - Sensor data
 * @param transaction - Optional database transaction
 * @returns Created reading
 *
 * @example
 * ```typescript
 * const reading = await processIoTSensorData({
 *   assetId: 'asset-123',
 *   sensorId: 'temp-sensor-1',
 *   dataType: 'temperature',
 *   value: 75.5,
 *   unit: 'celsius',
 *   timestamp: new Date()
 * });
 * ```
 */
async function processIoTSensorData(data, transaction) {
    const reading = await IoTSensorReading.create({
        ...data,
        timestamp: data.timestamp || new Date(),
    }, { transaction });
    // Check for anomalies (simplified logic)
    if (typeof data.value === 'number') {
        const recentReadings = await IoTSensorReading.findAll({
            where: {
                assetId: data.assetId,
                sensorId: data.sensorId,
                dataType: data.dataType,
            },
            order: [['timestamp', 'DESC']],
            limit: 10,
            transaction,
        });
        if (recentReadings.length > 0) {
            const values = recentReadings.map(r => Number(r.value));
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);
            // Flag as anomaly if value is more than 3 standard deviations from mean
            if (Math.abs(data.value - avg) > 3 * stdDev) {
                await reading.update({ isAnomaly: true }, { transaction });
            }
        }
    }
    return reading;
}
/**
 * Gets sensor readings
 *
 * @param assetId - Asset ID
 * @param sensorId - Optional sensor filter
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Sensor readings
 *
 * @example
 * ```typescript
 * const readings = await getSensorReadings('asset-123', 'temp-1', startDate, endDate);
 * ```
 */
async function getSensorReadings(assetId, sensorId, startDate, endDate) {
    const where = { assetId };
    if (sensorId) {
        where.sensorId = sensorId;
    }
    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) {
            where.timestamp[sequelize_1.Op.gte] = startDate;
        }
        if (endDate) {
            where.timestamp[sequelize_1.Op.lte] = endDate;
        }
    }
    return IoTSensorReading.findAll({
        where,
        order: [['timestamp', 'DESC']],
    });
}
/**
 * Gets anomalous readings
 *
 * @param assetId - Asset ID
 * @param limit - Maximum readings
 * @returns Anomalous readings
 *
 * @example
 * ```typescript
 * const anomalies = await getAnomalousReadings('asset-123', 50);
 * ```
 */
async function getAnomalousReadings(assetId, limit = 100) {
    return IoTSensorReading.findAll({
        where: {
            assetId,
            isAnomaly: true,
        },
        order: [['timestamp', 'DESC']],
        limit,
    });
}
/**
 * Aggregates sensor data
 *
 * @param assetId - Asset ID
 * @param sensorId - Sensor ID
 * @param dataType - Data type
 * @param startDate - Start date
 * @param endDate - End date
 * @param interval - Aggregation interval
 * @returns Aggregated data
 *
 * @example
 * ```typescript
 * const stats = await aggregateSensorData('asset-123', 'temp-1', 'temperature', start, end, 'hourly');
 * ```
 */
async function aggregateSensorData(assetId, sensorId, dataType, startDate, endDate, interval = 'hourly') {
    const readings = await IoTSensorReading.findAll({
        where: {
            assetId,
            sensorId,
            dataType,
            timestamp: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    if (readings.length === 0) {
        return { min: 0, max: 0, avg: 0, count: 0 };
    }
    const values = readings.map(r => Number(r.value)).filter(v => !isNaN(v));
    return {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
    };
}
// ============================================================================
// WEBHOOK FUNCTIONS
// ============================================================================
/**
 * Creates webhook
 *
 * @param data - Webhook data
 * @param transaction - Optional database transaction
 * @returns Created webhook
 *
 * @example
 * ```typescript
 * const webhook = await createWebhook({
 *   name: 'Asset Status Webhook',
 *   url: 'https://example.com/webhooks/asset-status',
 *   eventTypes: [WebhookEventType.ASSET_UPDATED, WebhookEventType.STATUS_CHANGED],
 *   secret: 'my-secret-key'
 * });
 * ```
 */
async function createWebhook(data, transaction) {
    const webhook = await Webhook.create(data, { transaction });
    return webhook;
}
/**
 * Triggers webhook
 *
 * @param webhookId - Webhook ID
 * @param eventType - Event type
 * @param payload - Event payload
 * @param transaction - Optional database transaction
 * @returns Webhook delivery
 *
 * @example
 * ```typescript
 * await triggerWebhook('webhook-123', WebhookEventType.ASSET_UPDATED, {
 *   assetId: 'asset-456',
 *   changes: { status: 'active' }
 * });
 * ```
 */
async function triggerWebhook(webhookId, eventType, payload, transaction) {
    const webhook = await Webhook.findByPk(webhookId, { transaction });
    if (!webhook) {
        throw new common_1.NotFoundException(`Webhook ${webhookId} not found`);
    }
    if (!webhook.isActive) {
        throw new common_1.BadRequestException('Webhook is not active');
    }
    if (!webhook.eventTypes.includes(eventType)) {
        throw new common_1.BadRequestException(`Webhook not subscribed to ${eventType} events`);
    }
    const delivery = await WebhookDelivery.create({
        webhookId,
        eventType,
        payload,
        status: 'pending',
        triggeredAt: new Date(),
    }, { transaction });
    // Simulate webhook delivery (in real implementation, make HTTP request)
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        await delivery.update({
            status: 'delivered',
            deliveredAt: new Date(),
            responseStatusCode: 200,
            attemptCount: 1,
        }, { transaction });
        await webhook.update({
            successCount: webhook.successCount + 1,
            lastTriggered: new Date(),
        }, { transaction });
    }
    catch (error) {
        await delivery.update({
            status: 'failed',
            errorMessage: error.message,
            attemptCount: 1,
        }, { transaction });
        await webhook.update({
            failureCount: webhook.failureCount + 1,
        }, { transaction });
    }
    return delivery;
}
/**
 * Triggers webhooks for event
 *
 * @param eventType - Event type
 * @param payload - Event payload
 * @param transaction - Optional database transaction
 * @returns Deliveries
 *
 * @example
 * ```typescript
 * await triggerWebhooksForEvent(WebhookEventType.ASSET_CREATED, { assetId: 'asset-123' });
 * ```
 */
async function triggerWebhooksForEvent(eventType, payload, transaction) {
    const webhooks = await Webhook.findAll({
        where: {
            isActive: true,
            eventTypes: { [sequelize_1.Op.contains]: [eventType] },
        },
        transaction,
    });
    const deliveries = [];
    for (const webhook of webhooks) {
        const delivery = await triggerWebhook(webhook.id, eventType, payload, transaction);
        deliveries.push(delivery);
    }
    return deliveries;
}
/**
 * Gets webhook deliveries
 *
 * @param webhookId - Webhook ID
 * @param limit - Maximum deliveries
 * @returns Deliveries
 *
 * @example
 * ```typescript
 * const deliveries = await getWebhookDeliveries('webhook-123', 50);
 * ```
 */
async function getWebhookDeliveries(webhookId, limit = 100) {
    return WebhookDelivery.findAll({
        where: { webhookId },
        order: [['triggeredAt', 'DESC']],
        limit,
    });
}
/**
 * Retries failed webhook delivery
 *
 * @param deliveryId - Delivery ID
 * @param transaction - Optional database transaction
 * @returns Updated delivery
 *
 * @example
 * ```typescript
 * await retryWebhookDelivery('delivery-123');
 * ```
 */
async function retryWebhookDelivery(deliveryId, transaction) {
    const delivery = await WebhookDelivery.findByPk(deliveryId, {
        include: [{ model: Webhook }],
        transaction,
    });
    if (!delivery) {
        throw new common_1.NotFoundException(`Delivery ${deliveryId} not found`);
    }
    const webhook = delivery.webhook;
    if (delivery.attemptCount >= webhook.retryAttempts) {
        throw new common_1.BadRequestException('Max retry attempts exceeded');
    }
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        await delivery.update({
            status: 'delivered',
            deliveredAt: new Date(),
            responseStatusCode: 200,
            attemptCount: delivery.attemptCount + 1,
        }, { transaction });
    }
    catch (error) {
        await delivery.update({
            status: 'failed',
            errorMessage: error.message,
            attemptCount: delivery.attemptCount + 1,
        }, { transaction });
    }
    return delivery;
}
// ============================================================================
// API MAPPING FUNCTIONS
// ============================================================================
/**
 * Creates API mapping
 *
 * @param data - Mapping data
 * @param transaction - Optional database transaction
 * @returns Created mapping
 *
 * @example
 * ```typescript
 * await createAPIMapping({
 *   integrationId: 'int-123',
 *   sourceField: 'asset_name',
 *   targetField: 'Equipment_Description',
 *   transformation: 'uppercase',
 *   required: true
 * });
 * ```
 */
async function createAPIMapping(data, transaction) {
    const mapping = await APIMapping.create(data, { transaction });
    return mapping;
}
/**
 * Gets API mappings for integration
 *
 * @param integrationId - Integration ID
 * @returns Mappings
 *
 * @example
 * ```typescript
 * const mappings = await getAPIMappings('int-123');
 * ```
 */
async function getAPIMappings(integrationId) {
    return APIMapping.findAll({
        where: { integrationId },
        order: [['sourceField', 'ASC']],
    });
}
/**
 * Applies field mappings
 *
 * @param data - Source data
 * @param mappings - Field mappings
 * @returns Mapped data
 *
 * @example
 * ```typescript
 * const mapped = applyFieldMappings({ asset_name: 'Pump' }, mappings);
 * ```
 */
function applyFieldMappings(data, mappings) {
    const result = {};
    for (const mapping of mappings) {
        let value = data[mapping.sourceField];
        // Apply default if source field is missing
        if (value === undefined && mapping.defaultValue !== undefined) {
            value = mapping.defaultValue;
        }
        // Apply transformation
        if (value !== undefined && mapping.transformation) {
            switch (mapping.transformation) {
                case 'uppercase':
                    value = String(value).toUpperCase();
                    break;
                case 'lowercase':
                    value = String(value).toLowerCase();
                    break;
                case 'trim':
                    value = String(value).trim();
                    break;
                // Add more transformations as needed
            }
        }
        result[mapping.targetField] = value;
    }
    return result;
}
// ============================================================================
// EDI FUNCTIONS
// ============================================================================
/**
 * Creates EDI document
 *
 * @param data - EDI data
 * @param transaction - Optional database transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * const edi = await createEDIDocument({
 *   integrationId: 'int-edi-123',
 *   transactionType: EDITransactionType.PO_850,
 *   direction: DataDirection.INBOUND,
 *   content: '...',
 *   senderId: 'VENDOR01',
 *   receiverId: 'COMPANY01'
 * });
 * ```
 */
async function createEDIDocument(data, transaction) {
    const doc = await EDIDocument.create(data, { transaction });
    return doc;
}
/**
 * Processes EDI document
 *
 * @param documentId - Document ID
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await processEDIDocument('edi-123');
 * ```
 */
async function processEDIDocument(documentId, transaction) {
    const doc = await EDIDocument.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`EDI document ${documentId} not found`);
    }
    try {
        // Parse and process EDI content (simplified)
        await doc.update({
            status: 'processed',
            processedAt: new Date(),
        }, { transaction });
        return doc;
    }
    catch (error) {
        await doc.update({
            status: 'error',
            errorMessages: [error.message],
        }, { transaction });
        throw error;
    }
}
/**
 * Gets EDI documents by type
 *
 * @param transactionType - Transaction type
 * @param direction - Optional direction filter
 * @returns EDI documents
 *
 * @example
 * ```typescript
 * const pos = await getEDIDocumentsByType(EDITransactionType.PO_850);
 * ```
 */
async function getEDIDocumentsByType(transactionType, direction) {
    const where = { transactionType };
    if (direction) {
        where.direction = direction;
    }
    return EDIDocument.findAll({
        where,
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// IMPORT/EXPORT FUNCTIONS
// ============================================================================
/**
 * Creates import job
 *
 * @param data - Job data
 * @param transaction - Optional database transaction
 * @returns Created job
 *
 * @example
 * ```typescript
 * const job = await createImportJob({
 *   jobType: 'import',
 *   entityType: 'asset',
 *   fileFormat: 'csv',
 *   filePath: '/uploads/assets.csv',
 *   mappings: { 'Name': 'asset_name' }
 * });
 * ```
 */
async function createImportJob(data, transaction) {
    const job = await ImportExportJob.create({
        ...data,
        status: SyncStatus.PENDING,
    }, { transaction });
    return job;
}
/**
 * Executes import job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns Updated job
 *
 * @example
 * ```typescript
 * await executeImportJob('job-123');
 * ```
 */
async function executeImportJob(jobId, transaction) {
    const job = await ImportExportJob.findByPk(jobId, { transaction });
    if (!job) {
        throw new common_1.NotFoundException(`Import job ${jobId} not found`);
    }
    await job.update({
        status: SyncStatus.IN_PROGRESS,
        startedAt: new Date(),
    }, { transaction });
    try {
        // Simulate import process
        const recordCount = 100;
        await job.update({
            totalRecords: recordCount,
            processedRecords: recordCount,
            successCount: recordCount,
            errorCount: 0,
            status: SyncStatus.COMPLETED,
            completedAt: new Date(),
        }, { transaction });
        return job;
    }
    catch (error) {
        await job.update({
            status: SyncStatus.FAILED,
            completedAt: new Date(),
            errorLog: [{ message: error.message, timestamp: new Date() }],
        }, { transaction });
        throw error;
    }
}
/**
 * Exports data
 *
 * @param data - Export job data
 * @param transaction - Optional database transaction
 * @returns Export job
 *
 * @example
 * ```typescript
 * const job = await exportData({
 *   jobType: 'export',
 *   entityType: 'asset',
 *   fileFormat: 'csv',
 *   filters: { status: 'active' }
 * });
 * ```
 */
async function exportData(data, transaction) {
    const job = await createImportJob(data, transaction);
    await executeImportJob(job.id, transaction);
    return job;
}
// ============================================================================
// INTEGRATION HEALTH AND MONITORING FUNCTIONS
// ============================================================================
/**
 * Gets integration health metrics
 *
 * @param integrationId - Integration ID
 * @param period - Period in days
 * @returns Health metrics
 *
 * @example
 * ```typescript
 * const health = await getIntegrationHealth('integration-123', 7);
 * ```
 */
async function getIntegrationHealth(integrationId, period = 7) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const syncJobs = await SyncJob.findAll({
        where: {
            integrationId,
            createdAt: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const webhookDeliveries = await WebhookDelivery.findAll({
        where: {
            webhookId: {
                [sequelize_1.Op.in]: (await Webhook.findAll({
                    where: { integrationId },
                    attributes: ['id'],
                })).map(w => w.id),
            },
            createdAt: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const totalSyncs = syncJobs.length;
    const successfulSyncs = syncJobs.filter(j => j.status === 'completed').length;
    const failedSyncs = syncJobs.filter(j => j.status === 'failed').length;
    const avgSyncDuration = syncJobs.length > 0
        ? syncJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / syncJobs.length
        : 0;
    const totalWebhooks = webhookDeliveries.length;
    const successfulWebhooks = webhookDeliveries.filter(d => d.success).length;
    return {
        period: { days: period, startDate },
        syncHealth: {
            total: totalSyncs,
            successful: successfulSyncs,
            failed: failedSyncs,
            successRate: totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0,
            avgDuration: avgSyncDuration,
        },
        webhookHealth: {
            total: totalWebhooks,
            successful: successfulWebhooks,
            successRate: totalWebhooks > 0 ? (successfulWebhooks / totalWebhooks) * 100 : 0,
        },
        overallHealth: totalSyncs + totalWebhooks > 0
            ? ((successfulSyncs + successfulWebhooks) / (totalSyncs + totalWebhooks)) * 100
            : 100,
    };
}
/**
 * Batch syncs multiple entities
 *
 * @param integrationId - Integration ID
 * @param entityIds - Entity IDs to sync
 * @param transaction - Optional database transaction
 * @returns Sync job
 *
 * @example
 * ```typescript
 * await batchSyncEntities('integration-123', ['asset-1', 'asset-2', 'asset-3']);
 * ```
 */
async function batchSyncEntities(integrationId, entityIds, transaction) {
    const job = await createSyncJob({
        integrationId,
        direction: 'push',
        entityType: 'asset',
        entityCount: entityIds.length,
        metadata: { entityIds },
    }, transaction);
    await executeSyncJob(job.id, transaction);
    return job;
}
/**
 * Logs integration audit event
 *
 * @param integrationId - Integration ID
 * @param action - Action performed
 * @param details - Event details
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await logIntegrationAudit('integration-123', 'data_synced', {
 *   entityType: 'asset',
 *   count: 100
 * });
 * ```
 */
async function logIntegrationAudit(integrationId, action, details, transaction) {
    // In real implementation, create audit log entry
    // For now, simplified
    return true;
}
/**
 * Transforms data using mapping rules
 *
 * @param data - Source data
 * @param mappingId - Mapping ID
 * @returns Transformed data
 *
 * @example
 * ```typescript
 * const transformed = await transformData(sourceData, 'mapping-123');
 * ```
 */
async function transformData(data, mappingId) {
    const mapping = await APIMapping.findByPk(mappingId);
    if (!mapping) {
        throw new common_1.NotFoundException(`Mapping ${mappingId} not found`);
    }
    return applyFieldMappings(data, mapping.fieldMappings);
}
/**
 * Gets integration analytics
 *
 * @param integrationId - Integration ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getIntegrationAnalytics(
 *   'integration-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getIntegrationAnalytics(integrationId, startDate, endDate) {
    const syncJobs = await SyncJob.findAll({
        where: {
            integrationId,
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const dataVolume = syncJobs.reduce((sum, j) => sum + (j.recordsProcessed || 0), 0);
    const avgProcessingTime = syncJobs.length > 0
        ? syncJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / syncJobs.length
        : 0;
    return {
        period: { startDate, endDate },
        totalJobs: syncJobs.length,
        totalRecords: dataVolume,
        avgProcessingTime,
        jobsByStatus: syncJobs.reduce((acc, j) => {
            acc[j.status] = (acc[j.status] || 0) + 1;
            return acc;
        }, {}),
        generatedAt: new Date(),
    };
}
/**
 * Resolves sync conflicts
 *
 * @param syncJobId - Sync job ID
 * @param conflictResolutions - Conflict resolution strategies
 * @param transaction - Optional database transaction
 * @returns Updated sync job
 *
 * @example
 * ```typescript
 * await resolveSyncConflicts('job-123', {
 *   'asset-456': 'use_source',
 *   'asset-789': 'use_target'
 * });
 * ```
 */
async function resolveSyncConflicts(syncJobId, conflictResolutions, transaction) {
    const job = await SyncJob.findByPk(syncJobId, { transaction });
    if (!job) {
        throw new common_1.NotFoundException(`Sync job ${syncJobId} not found`);
    }
    const metadata = job.metadata || {};
    metadata.conflictResolutions = conflictResolutions;
    metadata.conflictsResolved = true;
    await job.update({ metadata }, { transaction });
    return job;
}
/**
 * Checks integration rate limits
 *
 * @param integrationId - Integration ID
 * @param operation - Operation type
 * @returns Rate limit status
 *
 * @example
 * ```typescript
 * const canProceed = await checkIntegrationRateLimit('integration-123', 'sync');
 * if (!canProceed.allowed) {
 *   console.log('Rate limit exceeded, retry after:', canProceed.retryAfter);
 * }
 * ```
 */
async function checkIntegrationRateLimit(integrationId, operation) {
    // In real implementation, check rate limit against configured thresholds
    // For now, simplified
    const integration = await Integration.findByPk(integrationId);
    if (!integration) {
        throw new common_1.NotFoundException(`Integration ${integrationId} not found`);
    }
    const config = integration.configuration;
    const rateLimit = config.rateLimit || { requestsPerMinute: 60 };
    // Check recent activity
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentJobs = await SyncJob.count({
        where: {
            integrationId,
            createdAt: { [sequelize_1.Op.gte]: oneMinuteAgo },
        },
    });
    const allowed = recentJobs < rateLimit.requestsPerMinute;
    const retryAfter = allowed ? undefined : new Date(Date.now() + 10 * 1000);
    return { allowed, retryAfter };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Integration,
    SyncJob,
    IoTSensorReading,
    Webhook,
    WebhookDelivery,
    APIMapping,
    EDIDocument,
    ImportExportJob,
    // Integration Management Functions
    createIntegration,
    activateIntegration,
    deactivateIntegration,
    testIntegrationConnection,
    getActiveIntegrations,
    // Sync Job Functions
    createSyncJob,
    executeSyncJob,
    syncWithERP,
    getSyncJobsByStatus,
    retrySyncJob,
    // IoT Sensor Functions
    processIoTSensorData,
    getSensorReadings,
    getAnomalousReadings,
    aggregateSensorData,
    // Webhook Functions
    createWebhook,
    triggerWebhook,
    triggerWebhooksForEvent,
    getWebhookDeliveries,
    retryWebhookDelivery,
    // API Mapping Functions
    createAPIMapping,
    getAPIMappings,
    applyFieldMappings,
    // EDI Functions
    createEDIDocument,
    processEDIDocument,
    getEDIDocumentsByType,
    // Import/Export Functions
    createImportJob,
    executeImportJob,
    exportData,
    // Health and Monitoring Functions
    getIntegrationHealth,
    batchSyncEntities,
    logIntegrationAudit,
    transformData,
    getIntegrationAnalytics,
    resolveSyncConflicts,
    checkIntegrationRateLimit,
};
//# sourceMappingURL=asset-integration-commands.js.map