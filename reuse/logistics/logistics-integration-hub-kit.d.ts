/**
 * LOC: LOGISTICS-INTEG-HUB-001
 * File: /reuse/logistics/logistics-integration-hub-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - xml-js
 *   - crypto
 *   - axios
 *
 * DOWNSTREAM (imported by):
 *   - Logistics controllers
 *   - EDI services
 *   - Carrier management
 *   - 3PL integrations
 *   - WMS synchronization
 */
/**
 * EDI Document Type enumeration
 */
export declare enum EDIDocumentType {
    PURCHASE_ORDER = "850",// Inbound PO
    SHIPMENT_NOTICE = "856",// ASN/Packing List
    INVOICE = "810",// Invoice
    SHIPMENT_STATUS = "214",// Shipment Status
    PURCHASE_ORDER_ACK = "855",// PO Acknowledgment
    DELIVERY_RECEIPT = "997",// Delivery Receipt
    FORECAST = "830",// Forecast
    INVENTORY_STATUS = "846"
}
/**
 * Integration provider types
 */
export declare enum IntegrationProvider {
    CARRIER_FedEx = "FEDEX",
    CARRIER_UPS = "UPS",
    CARRIER_XPO = "XPO",
    3,
    PL_FLEXPORT = "FLEXPORT",
    3,
    PL_ONFLEET = "ONFLEET",
    WMS_INFOR = "INFOR",
    WMS_MANHATTAN = "MANHATTAN",
    TMS_JDA = "JDA"
}
/**
 * Integration status enumeration
 */
export declare enum IntegrationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    MAPPED = "MAPPED",
    VALIDATED = "VALIDATED",
    TRANSMITTED = "TRANSMITTED",
    RECEIVED = "RECEIVED",
    ERROR = "ERROR",
    RETRY = "RETRY",
    COMPLETED = "COMPLETED"
}
/**
 * EDI Document interface
 */
export interface EDIDocument {
    documentId: string;
    documentType: EDIDocumentType;
    senderCode: string;
    recipientCode: string;
    documentDate: Date;
    referenceNumber: string;
    version: string;
    lineItems: EDILineItem[];
    metadata?: Record<string, any>;
}
/**
 * EDI Line Item interface
 */
export interface EDILineItem {
    lineSequence: number;
    itemCode: string;
    description: string;
    quantity: number;
    unitOfMeasure: string;
    price?: number;
    amount?: number;
    shipDate?: Date;
    carrierCode?: string;
    trackingNumber?: string;
}
/**
 * Carrier Integration interface
 */
export interface CarrierIntegration {
    carrierId: string;
    carrierName: string;
    apiEndpoint: string;
    authToken: string;
    provider: IntegrationProvider;
    supportedServices: string[];
    apiVersion: string;
    rateLimit: number;
    timeout: number;
}
/**
 * 3PL Integration interface
 */
export interface ThirdPartyLogisticsIntegration {
    partnerId: string;
    partnerName: string;
    apiEndpoint: string;
    webhookUrl: string;
    authType: 'API_KEY' | 'OAUTH2' | 'BASIC';
    syncFrequency: number;
    capabilities: string[];
}
/**
 * WMS Synchronization interface
 */
export interface WMSSynchronization {
    wmsId: string;
    wmsName: string;
    systemType: string;
    apiEndpoint: string;
    credentials: Record<string, string>;
    lastSyncTime: Date;
    syncInterval: number;
    inventoryMappings: InventoryMapping[];
}
/**
 * Inventory Mapping interface
 */
export interface InventoryMapping {
    externalSkuId: string;
    internalSkuId: string;
    warehouseCode: string;
    binLocation: string;
    quantity: number;
    reserved: number;
    available: number;
    lastUpdated: Date;
}
/**
 * Data Transformation Rule interface
 */
export interface DataTransformationRule {
    ruleId: string;
    sourceField: string;
    targetField: string;
    transformationType: 'MAP' | 'CALCULATE' | 'AGGREGATE' | 'FILTER' | 'SPLIT';
    transformationLogic: string;
    active: boolean;
}
/**
 * Integration Monitoring interface
 */
export interface IntegrationMonitoring {
    monitoringId: string;
    integrationId: string;
    status: IntegrationStatus;
    messageCount: number;
    successCount: number;
    errorCount: number;
    lastMessageTime: Date;
    avgProcessingTime: number;
    metrics: IntegrationMetrics;
}
/**
 * Integration Metrics interface
 */
export interface IntegrationMetrics {
    throughput: number;
    latency: number;
    errorRate: number;
    uptime: number;
    dataQuality: number;
}
/**
 * Integration Error interface
 */
export interface IntegrationError {
    errorId: string;
    integrationId: string;
    errorCode: string;
    errorMessage: string;
    stackTrace?: string;
    documentId?: string;
    timestamp: Date;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    retryCount: number;
    lastRetryTime?: Date;
}
/**
 * API Request/Response interface
 */
export interface APITransaction {
    transactionId: string;
    provider: IntegrationProvider;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    request: Record<string, any>;
    response: Record<string, any>;
    statusCode: number;
    processingTime: number;
    timestamp: Date;
}
/**
 * Function 1: Parse EDI 850 Purchase Order document
 * Converts inbound EDI 850 format to internal PO structure
 */
export declare function parseEDI850Document(ediContent: string): EDIDocument;
/**
 * Function 2: Parse EDI 856 Shipment Notice (ASN)
 * Processes advanced shipping notifications
 */
export declare function parseEDI856Document(ediContent: string): EDIDocument;
/**
 * Function 3: Parse EDI 810 Invoice document
 * Processes inbound invoice EDI documents
 */
export declare function parseEDI810Document(ediContent: string): EDIDocument;
/**
 * Function 4: Parse EDI 214 Shipment Status document
 * Extracts tracking and status updates from carriers
 */
export declare function parseEDI214Document(ediContent: string): EDIDocument;
/**
 * Function 5: Generate EDI 850 Purchase Order
 * Formats internal PO data to EDI 850 transmission format
 */
export declare function generateEDI850Document(order: any): string;
/**
 * Function 6: Generate EDI 856 Shipment Notice (ASN)
 * Creates ASN document from shipment data
 */
export declare function generateEDI856Document(shipment: any): string;
/**
 * Function 7: Validate EDI document structure
 * Ensures EDI document compliance with X12 standards
 */
export declare function validateEDIDocumentStructure(ediContent: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Function 8: Map EDI document to database schema
 * Transforms EDI structure to internal storage format
 */
export declare function mapEDIToDatabase(ediDocument: EDIDocument): Record<string, any>;
/**
 * Function 9: Integrate with FedEx Shipping API
 * Real-time shipment creation and tracking
 * REST: POST /logistics/carriers/fedex/shipments
 */
export declare function integrateFedExShipping(shipmentData: any, carrier: CarrierIntegration): Promise<APITransaction>;
/**
 * Function 10: Integrate with UPS Tracking API
 * Real-time shipment status tracking
 * REST: GET /logistics/carriers/ups/tracking/:trackingNumber
 */
export declare function integrateUPSTracking(trackingNumber: string, carrier: CarrierIntegration): Promise<APITransaction>;
/**
 * Function 11: Integrate with 3PL Flexport API
 * Freight forwarding and international logistics
 * REST: POST /logistics/3pl/flexport/shipments
 */
export declare function integrate3PLFlexport(shipmentData: any, integration: ThirdPartyLogisticsIntegration): Promise<APITransaction>;
/**
 * Function 12: Integrate with Onfleet Last-Mile Delivery
 * Real-time last-mile routing and tracking
 * REST: POST /logistics/3pl/onfleet/deliveries
 */
export declare function integrate3PLOnfleet(deliveryData: any, integration: ThirdPartyLogisticsIntegration): Promise<APITransaction>;
/**
 * Function 13: Integrate with WMS Inventory Synchronization
 * Real-time inventory level sync with warehouse systems
 * REST: PUT /logistics/wms/inventory/sync
 */
export declare function integrateWMSInventorySync(inventory: InventoryMapping[], wms: WMSSynchronization): Promise<APITransaction>;
/**
 * Function 14: Handle Carrier Webhook Callbacks
 * Processes inbound webhooks from shipping carriers
 * REST: POST /logistics/webhooks/carrier
 */
export declare function handleCarrierWebhookCallback(webhookData: any): {
    processed: boolean;
    documentId: string;
};
/**
 * Function 15: Authenticate API requests with carrier providers
 * Manages OAuth2 and API key-based authentication
 */
export declare function authenticateCarrierAPI(provider: IntegrationProvider, credentials: Record<string, string>): string;
/**
 * Function 16: Transform ERP Order to EDI 850 format
 * Converts internal order structure to EDI transmission format
 */
export declare function transformERPOrderToEDI850(order: any): EDIDocument;
/**
 * Function 17: Map Shipment data to WMS format
 * Transforms carrier shipment data to WMS compatible structure
 */
export declare function mapShipmentToWMSFormat(shipment: any): Record<string, any>;
/**
 * Function 18: Normalize supplier data from multiple sources
 * Consolidates supplier information from various integrations
 */
export declare function normalizeSupplierData(externalData: any, source: string): Record<string, any>;
/**
 * Function 19: Apply data transformation rule
 * Executes custom transformation rules on data fields
 */
export declare function applyDataTransformationRule(data: Record<string, any>, rule: DataTransformationRule): Record<string, any>;
/**
 * Function 20: Convert ISO 8601 timestamps to EDI format
 * Standardizes date/time formatting for EDI compatibility
 */
export declare function convertTimestampToEDIFormat(timestamp: Date): string;
/**
 * Function 21: Deduplicate integration messages
 * Prevents processing of duplicate messages using idempotency keys
 */
export declare function deduplicateIntegrationMessage(message: any): {
    isDuplicate: boolean;
    messageHash: string;
};
/**
 * Function 22: Calculate dimensional weight for shipping
 * Computes chargeable weight based on package dimensions
 */
export declare function calculateDimensionalWeight(length: number, width: number, height: number, divisor?: number): number;
/**
 * Function 23: Enrich logistics data with reference information
 * Adds contextual data from master files
 */
export declare function enrichLogisticsDataWithReferences(shipment: any, references: any): Record<string, any>;
/**
 * Function 24: Create integration monitoring record
 * Initializes monitoring for new integration
 */
export declare function createIntegrationMonitoring(integrationId: string): IntegrationMonitoring;
/**
 * Function 25: Update integration metrics
 * Recalculates performance metrics for active integrations
 */
export declare function updateIntegrationMetrics(monitoring: IntegrationMonitoring, newMessageTime: number): IntegrationMonitoring;
/**
 * Function 26: Track API call performance
 * Monitors response times and status codes
 */
export declare function trackAPICallPerformance(transaction: APITransaction): Record<string, any>;
/**
 * Function 27: Generate integration health report
 * Aggregates metrics across all integrations
 */
export declare function generateIntegrationHealthReport(monitorings: IntegrationMonitoring[]): Record<string, any>;
/**
 * Function 28: Monitor EDI transmission queue
 * Tracks pending EDI documents for transmission
 */
export declare function monitorEDITransmissionQueue(queue: EDIDocument[]): Record<string, any>;
/**
 * Function 29: Alert on integration degradation
 * Triggers alerts when performance drops below thresholds
 */
export declare function alertOnIntegrationDegradation(monitoring: IntegrationMonitoring, thresholds: any): {
    alert: boolean;
    severity: string;
};
/**
 * Function 30: Create SLA compliance report
 * Measures integration compliance against SLA requirements
 */
export declare function createSLAComplianceReport(monitoring: IntegrationMonitoring, slaRequirements: any): Record<string, any>;
/**
 * Function 31: Log integration event for audit trail
 * Records all integration activity for compliance
 */
export declare function logIntegrationEvent(integrationId: string, eventType: string, details: any): Record<string, any>;
/**
 * Function 32: Create integration error record
 * Logs errors for tracking and resolution
 */
export declare function createIntegrationError(integrationId: string, errorCode: string, message: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): IntegrationError;
/**
 * Function 33: Implement exponential backoff retry strategy
 * Retries failed API calls with increasing delays
 */
export declare function calculateExponentialBackoffDelay(retryCount: number, baseDelay?: number, maxDelay?: number): number;
/**
 * Function 34: Queue message for retry with dead-letter handling
 * Manages failed messages and dead-letter queue
 */
export declare function queueMessageForRetry(message: any, error: IntegrationError): {
    queued: boolean;
    deadLetterQueue: boolean;
};
/**
 * Function 35: Implement circuit breaker pattern
 * Prevents cascading failures by stopping requests to failing services
 */
export declare function evaluateCircuitBreakerState(errorCount: number, errorThreshold?: number, timeWindowMs?: number): 'CLOSED' | 'OPEN' | 'HALF_OPEN';
/**
 * Function 36: Resolve integration conflicts
 * Handles conflicts between multiple data sources
 */
export declare function resolveIntegrationConflict(sourceA: any, sourceB: any, conflictResolutionStrategy: 'LATEST' | 'AUTHORITATIVE' | 'MERGE'): any;
/**
 * Function 37: Implement rollback mechanism
 * Reverts failed integrations to previous state
 */
export declare function implementRollbackMechanism(transactionId: string, previousState: any): {
    rolledBack: boolean;
    transactionId: string;
};
/**
 * Function 38: Generate error recovery action plan
 * Recommends corrective actions based on error patterns
 */
export declare function generateErrorRecoveryActionPlan(error: IntegrationError, recentErrors: IntegrationError[]): Record<string, any>;
/**
 * REST API Endpoint Specifications
 *
 * EDI PROCESSING:
 *   POST   /api/v1/logistics/edi/850/parse              - Parse EDI 850 document
 *   POST   /api/v1/logistics/edi/856/parse              - Parse EDI 856 document
 *   POST   /api/v1/logistics/edi/generate               - Generate EDI documents
 *   GET    /api/v1/logistics/edi/{documentId}           - Retrieve EDI document
 *   PUT    /api/v1/logistics/edi/{documentId}/validate  - Validate EDI document
 *
 * CARRIER INTEGRATION:
 *   POST   /api/v1/logistics/carriers/fedex/shipments   - Create FedEx shipment
 *   GET    /api/v1/logistics/carriers/ups/tracking      - Track UPS shipment
 *   POST   /api/v1/logistics/carriers/xpo/shipments     - Create XPO shipment
 *
 * 3PL INTEGRATION:
 *   POST   /api/v1/logistics/3pl/flexport/shipments     - Create Flexport shipment
 *   POST   /api/v1/logistics/3pl/onfleet/deliveries     - Create Onfleet delivery
 *
 * WMS SYNCHRONIZATION:
 *   PUT    /api/v1/logistics/wms/inventory/sync         - Sync inventory levels
 *   GET    /api/v1/logistics/wms/inventory/{warehouseId} - Get WMS inventory
 *
 * MONITORING:
 *   GET    /api/v1/logistics/monitoring/health          - Integration health status
 *   GET    /api/v1/logistics/monitoring/metrics         - Performance metrics
 *   GET    /api/v1/logistics/monitoring/sla-report      - SLA compliance report
 *   POST   /api/v1/logistics/monitoring/errors          - Log error
 *
 * WEBHOOKS:
 *   POST   /api/v1/logistics/webhooks/carrier           - Receive carrier updates
 *   POST   /api/v1/logistics/webhooks/3pl               - Receive 3PL updates
 *   POST   /api/v1/logistics/webhooks/wms               - Receive WMS updates
 */
//# sourceMappingURL=logistics-integration-hub-kit.d.ts.map