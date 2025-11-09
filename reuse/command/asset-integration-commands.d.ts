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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Integration Type
 */
export declare enum IntegrationType {
    ERP = "erp",
    CMMS = "cmms",
    IOT = "iot",
    API = "api",
    WEBHOOK = "webhook",
    EDI = "edi",
    DATABASE = "database",
    FILE = "file",
    MESSAGE_QUEUE = "message_queue",
    CLOUD_SERVICE = "cloud_service"
}
/**
 * Sync Status
 */
export declare enum SyncStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    PARTIAL = "partial",
    CANCELLED = "cancelled"
}
/**
 * Integration Status
 */
export declare enum IntegrationStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ERROR = "error",
    MAINTENANCE = "maintenance",
    TESTING = "testing"
}
/**
 * Data Direction
 */
export declare enum DataDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound",
    BIDIRECTIONAL = "bidirectional"
}
/**
 * Webhook Event Type
 */
export declare enum WebhookEventType {
    ASSET_CREATED = "asset.created",
    ASSET_UPDATED = "asset.updated",
    ASSET_DELETED = "asset.deleted",
    MAINTENANCE_DUE = "maintenance.due",
    INSPECTION_COMPLETED = "inspection.completed",
    ALERT_TRIGGERED = "alert.triggered",
    STATUS_CHANGED = "status.changed",
    CUSTOM = "custom"
}
/**
 * EDI Transaction Type
 */
export declare enum EDITransactionType {
    PO_850 = "850",
    PO_ACK_855 = "855",
    INVOICE_810 = "810",
    SHIP_NOTICE_856 = "856",
    INVENTORY_846 = "846",
    PRICE_CATALOG_832 = "832"
}
/**
 * Integration Data
 */
export interface IntegrationData {
    name: string;
    integrationType: IntegrationType;
    endpoint: string;
    authMethod?: string;
    credentials?: Record<string, any>;
    config?: Record<string, any>;
    syncFrequency?: number;
    dataDirection: DataDirection;
    isActive?: boolean;
    retryAttempts?: number;
    timeout?: number;
}
/**
 * Sync Job Data
 */
export interface SyncJobData {
    integrationId: string;
    direction: DataDirection;
    entityType: string;
    entityIds?: string[];
    filters?: Record<string, any>;
    scheduledFor?: Date;
}
/**
 * IoT Sensor Data
 */
export interface IoTSensorData {
    assetId: string;
    sensorId: string;
    dataType: string;
    value: any;
    unit?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}
/**
 * Webhook Data
 */
export interface WebhookData {
    name: string;
    url: string;
    eventTypes: WebhookEventType[];
    secret?: string;
    headers?: Record<string, string>;
    retryAttempts?: number;
    isActive?: boolean;
}
/**
 * API Mapping Data
 */
export interface APIMappingData {
    integrationId: string;
    sourceField: string;
    targetField: string;
    transformation?: string;
    defaultValue?: any;
    required?: boolean;
}
/**
 * EDI Document Data
 */
export interface EDIDocumentData {
    integrationId: string;
    transactionType: EDITransactionType;
    direction: DataDirection;
    content: string;
    senderId: string;
    receiverId: string;
    controlNumber?: string;
}
/**
 * Import/Export Job Data
 */
export interface ImportExportJobData {
    integrationId?: string;
    jobType: 'import' | 'export';
    entityType: string;
    fileFormat: string;
    filePath?: string;
    filters?: Record<string, any>;
    mappings?: Record<string, string>;
}
/**
 * Integration Model
 */
export declare class Integration extends Model {
    id: string;
    integrationCode: string;
    name: string;
    description?: string;
    integrationType: IntegrationType;
    status: IntegrationStatus;
    endpoint: string;
    authMethod?: string;
    credentials?: Record<string, any>;
    config?: Record<string, any>;
    dataDirection: DataDirection;
    syncFrequency?: number;
    lastSyncTime?: Date;
    nextScheduledSync?: Date;
    isActive: boolean;
    retryAttempts: number;
    timeout: number;
    successCount: number;
    errorCount: number;
    lastError?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    syncJobs?: SyncJob[];
    mappings?: APIMapping[];
    static generateIntegrationCode(instance: Integration): Promise<void>;
}
/**
 * Sync Job Model
 */
export declare class SyncJob extends Model {
    id: string;
    integrationId: string;
    status: SyncStatus;
    direction: DataDirection;
    entityType: string;
    entityIds?: string[];
    filters?: Record<string, any>;
    scheduledFor?: Date;
    startedAt?: Date;
    completedAt?: Date;
    recordsProcessed: number;
    recordsSucceeded: number;
    recordsFailed: number;
    errorMessages?: string[];
    resultSummary?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    integration?: Integration;
}
/**
 * IoT Sensor Reading Model
 */
export declare class IoTSensorReading extends Model {
    id: string;
    assetId: string;
    sensorId: string;
    dataType: string;
    value: any;
    unit?: string;
    timestamp: Date;
    quality?: string;
    metadata?: Record<string, any>;
    isAnomaly: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Webhook Model
 */
export declare class Webhook extends Model {
    id: string;
    webhookCode: string;
    name: string;
    url: string;
    eventTypes: WebhookEventType[];
    secret?: string;
    headers?: Record<string, string>;
    isActive: boolean;
    retryAttempts: number;
    successCount: number;
    failureCount: number;
    lastTriggered?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    deliveries?: WebhookDelivery[];
    static generateWebhookCode(instance: Webhook): Promise<void>;
}
/**
 * Webhook Delivery Model
 */
export declare class WebhookDelivery extends Model {
    id: string;
    webhookId: string;
    eventType: WebhookEventType;
    payload: Record<string, any>;
    status: string;
    triggeredAt: Date;
    deliveredAt?: Date;
    responseStatusCode?: number;
    responseBody?: string;
    attemptCount: number;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
    webhook?: Webhook;
}
/**
 * API Mapping Model
 */
export declare class APIMapping extends Model {
    id: string;
    integrationId: string;
    sourceField: string;
    targetField: string;
    transformation?: string;
    defaultValue?: any;
    required: boolean;
    dataType?: string;
    validationRules?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    integration?: Integration;
}
/**
 * EDI Document Model
 */
export declare class EDIDocument extends Model {
    id: string;
    integrationId: string;
    transactionType: EDITransactionType;
    direction: DataDirection;
    content: string;
    senderId: string;
    receiverId: string;
    controlNumber?: string;
    status: string;
    processedAt?: Date;
    acknowledgmentReceived: boolean;
    errorMessages?: string[];
    createdAt: Date;
    updatedAt: Date;
    integration?: Integration;
    static generateControlNumber(instance: EDIDocument): Promise<void>;
}
/**
 * Import/Export Job Model
 */
export declare class ImportExportJob extends Model {
    id: string;
    integrationId?: string;
    jobType: 'import' | 'export';
    entityType: string;
    fileFormat: string;
    filePath?: string;
    status: SyncStatus;
    filters?: Record<string, any>;
    mappings?: Record<string, string>;
    totalRecords: number;
    processedRecords: number;
    successCount: number;
    errorCount: number;
    errorLog?: Record<string, any>[];
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    integration?: Integration;
}
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
export declare function createIntegration(data: IntegrationData, transaction?: Transaction): Promise<Integration>;
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
export declare function activateIntegration(integrationId: string, transaction?: Transaction): Promise<Integration>;
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
export declare function deactivateIntegration(integrationId: string, transaction?: Transaction): Promise<Integration>;
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
export declare function testIntegrationConnection(integrationId: string): Promise<{
    success: boolean;
    message: string;
    responseTime: number;
}>;
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
export declare function getActiveIntegrations(integrationType?: IntegrationType): Promise<Integration[]>;
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
export declare function createSyncJob(data: SyncJobData, transaction?: Transaction): Promise<SyncJob>;
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
export declare function executeSyncJob(jobId: string, transaction?: Transaction): Promise<SyncJob>;
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
export declare function syncWithERP(integrationId: string, entityType: string, entityIds?: string[], transaction?: Transaction): Promise<SyncJob>;
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
export declare function getSyncJobsByStatus(status: SyncStatus, integrationId?: string): Promise<SyncJob[]>;
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
export declare function retrySyncJob(jobId: string, transaction?: Transaction): Promise<SyncJob>;
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
export declare function processIoTSensorData(data: IoTSensorData, transaction?: Transaction): Promise<IoTSensorReading>;
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
export declare function getSensorReadings(assetId: string, sensorId?: string, startDate?: Date, endDate?: Date): Promise<IoTSensorReading[]>;
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
export declare function getAnomalousReadings(assetId: string, limit?: number): Promise<IoTSensorReading[]>;
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
export declare function aggregateSensorData(assetId: string, sensorId: string, dataType: string, startDate: Date, endDate: Date, interval?: 'hourly' | 'daily' | 'weekly'): Promise<{
    min: number;
    max: number;
    avg: number;
    count: number;
}>;
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
export declare function createWebhook(data: WebhookData, transaction?: Transaction): Promise<Webhook>;
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
export declare function triggerWebhook(webhookId: string, eventType: WebhookEventType, payload: Record<string, any>, transaction?: Transaction): Promise<WebhookDelivery>;
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
export declare function triggerWebhooksForEvent(eventType: WebhookEventType, payload: Record<string, any>, transaction?: Transaction): Promise<WebhookDelivery[]>;
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
export declare function getWebhookDeliveries(webhookId: string, limit?: number): Promise<WebhookDelivery[]>;
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
export declare function retryWebhookDelivery(deliveryId: string, transaction?: Transaction): Promise<WebhookDelivery>;
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
export declare function createAPIMapping(data: APIMappingData, transaction?: Transaction): Promise<APIMapping>;
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
export declare function getAPIMappings(integrationId: string): Promise<APIMapping[]>;
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
export declare function applyFieldMappings(data: Record<string, any>, mappings: APIMapping[]): Record<string, any>;
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
export declare function createEDIDocument(data: EDIDocumentData, transaction?: Transaction): Promise<EDIDocument>;
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
export declare function processEDIDocument(documentId: string, transaction?: Transaction): Promise<EDIDocument>;
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
export declare function getEDIDocumentsByType(transactionType: EDITransactionType, direction?: DataDirection): Promise<EDIDocument[]>;
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
export declare function createImportJob(data: ImportExportJobData, transaction?: Transaction): Promise<ImportExportJob>;
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
export declare function executeImportJob(jobId: string, transaction?: Transaction): Promise<ImportExportJob>;
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
export declare function exportData(data: ImportExportJobData, transaction?: Transaction): Promise<ImportExportJob>;
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
export declare function getIntegrationHealth(integrationId: string, period?: number): Promise<Record<string, any>>;
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
export declare function batchSyncEntities(integrationId: string, entityIds: string[], transaction?: Transaction): Promise<SyncJob>;
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
export declare function logIntegrationAudit(integrationId: string, action: string, details: Record<string, any>, transaction?: Transaction): Promise<boolean>;
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
export declare function transformData(data: Record<string, any>, mappingId: string): Promise<Record<string, any>>;
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
export declare function getIntegrationAnalytics(integrationId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
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
export declare function resolveSyncConflicts(syncJobId: string, conflictResolutions: Record<string, string>, transaction?: Transaction): Promise<SyncJob>;
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
export declare function checkIntegrationRateLimit(integrationId: string, operation: string): Promise<{
    allowed: boolean;
    retryAfter?: Date;
}>;
declare const _default: {
    Integration: typeof Integration;
    SyncJob: typeof SyncJob;
    IoTSensorReading: typeof IoTSensorReading;
    Webhook: typeof Webhook;
    WebhookDelivery: typeof WebhookDelivery;
    APIMapping: typeof APIMapping;
    EDIDocument: typeof EDIDocument;
    ImportExportJob: typeof ImportExportJob;
    createIntegration: typeof createIntegration;
    activateIntegration: typeof activateIntegration;
    deactivateIntegration: typeof deactivateIntegration;
    testIntegrationConnection: typeof testIntegrationConnection;
    getActiveIntegrations: typeof getActiveIntegrations;
    createSyncJob: typeof createSyncJob;
    executeSyncJob: typeof executeSyncJob;
    syncWithERP: typeof syncWithERP;
    getSyncJobsByStatus: typeof getSyncJobsByStatus;
    retrySyncJob: typeof retrySyncJob;
    processIoTSensorData: typeof processIoTSensorData;
    getSensorReadings: typeof getSensorReadings;
    getAnomalousReadings: typeof getAnomalousReadings;
    aggregateSensorData: typeof aggregateSensorData;
    createWebhook: typeof createWebhook;
    triggerWebhook: typeof triggerWebhook;
    triggerWebhooksForEvent: typeof triggerWebhooksForEvent;
    getWebhookDeliveries: typeof getWebhookDeliveries;
    retryWebhookDelivery: typeof retryWebhookDelivery;
    createAPIMapping: typeof createAPIMapping;
    getAPIMappings: typeof getAPIMappings;
    applyFieldMappings: typeof applyFieldMappings;
    createEDIDocument: typeof createEDIDocument;
    processEDIDocument: typeof processEDIDocument;
    getEDIDocumentsByType: typeof getEDIDocumentsByType;
    createImportJob: typeof createImportJob;
    executeImportJob: typeof executeImportJob;
    exportData: typeof exportData;
    getIntegrationHealth: typeof getIntegrationHealth;
    batchSyncEntities: typeof batchSyncEntities;
    logIntegrationAudit: typeof logIntegrationAudit;
    transformData: typeof transformData;
    getIntegrationAnalytics: typeof getIntegrationAnalytics;
    resolveSyncConflicts: typeof resolveSyncConflicts;
    checkIntegrationRateLimit: typeof checkIntegrationRateLimit;
};
export default _default;
//# sourceMappingURL=asset-integration-commands.d.ts.map