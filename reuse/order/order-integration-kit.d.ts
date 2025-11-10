/**
 * LOC: ORD-INTGRT-001
 * File: /reuse/order/order-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - xml2js
 *
 * DOWNSTREAM (imported by):
 *   - Order integration services
 *   - EDI processors
 *   - External system adapters
 *   - Webhook handlers
 *   - Marketplace integrations
 */
/**
 * EDI segment types for X12 transactions
 */
export declare enum EDISegmentType {
    ISA = "ISA",// Interchange Control Header
    GS = "GS",// Functional Group Header
    ST = "ST",// Transaction Set Header
    BEG = "BEG",// Beginning Segment for Purchase Order
    REF = "REF",// Reference Identification
    PER = "PER",// Administrative Communications Contact
    DTM = "DTM",// Date/Time Reference
    N1 = "N1",// Name
    N3 = "N3",// Address Information
    N4 = "N4",// Geographic Location
    PO1 = "PO1",// Baseline Item Data
    CTT = "CTT",// Transaction Totals
    SE = "SE",// Transaction Set Trailer
    GE = "GE",// Functional Group Trailer
    IEA = "IEA",// Interchange Control Trailer
    BAK = "BAK",// Beginning Segment for Purchase Order Acknowledgment
    BSN = "BSN",// Beginning Segment for Ship Notice
    HL = "HL",// Hierarchical Level
    TD5 = "TD5",// Carrier Details
    BIG = "BIG"
}
/**
 * EDI transaction set types
 */
export declare enum EDITransactionSet {
    PO850 = "850",// Purchase Order
    PO_ACK_855 = "855",// Purchase Order Acknowledgment
    ASN_856 = "856",// Advanced Ship Notice
    INVOICE_810 = "810"
}
/**
 * EDI document structure
 */
export interface EDIDocument {
    transactionSet: EDITransactionSet;
    senderId: string;
    receiverId: string;
    controlNumber: string;
    date: Date;
    segments: EDISegment[];
    metadata?: Record<string, any>;
}
/**
 * Individual EDI segment
 */
export interface EDISegment {
    type: EDISegmentType;
    elements: string[];
    subelements?: string[][];
}
/**
 * Purchase Order (850) structure
 */
export interface EDI850PurchaseOrder {
    poNumber: string;
    poDate: Date;
    buyerId: string;
    vendorId: string;
    shipToAddress: Address;
    billToAddress: Address;
    lineItems: PurchaseOrderLineItem[];
    totalAmount: number;
    currency: string;
    paymentTerms?: string;
    requestedDeliveryDate?: Date;
    specialInstructions?: string;
}
/**
 * Purchase Order Acknowledgment (855) structure
 */
export interface EDI855POAcknowledgment {
    poNumber: string;
    ackDate: Date;
    vendorId: string;
    buyerId: string;
    acknowledgmentType: 'ACCEPT' | 'REJECT' | 'CHANGE';
    lineItems: POAcknowledgmentLineItem[];
    estimatedShipDate?: Date;
    comments?: string;
}
/**
 * Advanced Ship Notice (856) structure
 */
export interface EDI856ShipNotice {
    asnNumber: string;
    shipDate: Date;
    poNumber: string;
    vendorId: string;
    buyerId: string;
    carrier: CarrierInfo;
    trackingNumber: string;
    packages: ShipmentPackage[];
    estimatedDeliveryDate?: Date;
}
/**
 * Invoice (810) structure
 */
export interface EDI810Invoice {
    invoiceNumber: string;
    invoiceDate: Date;
    poNumber: string;
    vendorId: string;
    buyerId: string;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    currency: string;
    paymentTerms: string;
    dueDate: Date;
}
/**
 * Address structure
 */
export interface Address {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contactName?: string;
    phone?: string;
    email?: string;
}
/**
 * Purchase order line item
 */
export interface PurchaseOrderLineItem {
    lineNumber: number;
    productId: string;
    sku: string;
    description: string;
    quantity: number;
    unitPrice: number;
    uom: string;
    totalPrice: number;
    requestedDeliveryDate?: Date;
}
/**
 * PO Acknowledgment line item
 */
export interface POAcknowledgmentLineItem {
    lineNumber: number;
    productId: string;
    sku: string;
    orderedQuantity: number;
    confirmedQuantity: number;
    status: 'ACCEPTED' | 'BACKORDERED' | 'REJECTED';
    estimatedShipDate?: Date;
    reason?: string;
}
/**
 * Shipment package information
 */
export interface ShipmentPackage {
    packageNumber: number;
    trackingNumber: string;
    weight: number;
    weightUOM: string;
    dimensions: PackageDimensions;
    contents: PackageContent[];
}
/**
 * Package dimensions
 */
export interface PackageDimensions {
    length: number;
    width: number;
    height: number;
    uom: string;
}
/**
 * Package contents
 */
export interface PackageContent {
    lineNumber: number;
    productId: string;
    sku: string;
    quantity: number;
}
/**
 * Invoice line item
 */
export interface InvoiceLineItem {
    lineNumber: number;
    productId: string;
    sku: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    taxAmount: number;
}
/**
 * Carrier information
 */
export interface CarrierInfo {
    scac?: string;
    name: string;
    serviceLevel: string;
    trackingUrl?: string;
}
/**
 * Webhook configuration
 */
export interface WebhookConfig {
    id: string;
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    headers?: Record<string, string>;
    retryPolicy: RetryPolicy;
}
/**
 * Webhook event
 */
export interface WebhookEvent {
    id: string;
    type: string;
    timestamp: Date;
    orderId: string;
    data: any;
    signature?: string;
}
/**
 * Retry policy for webhooks and API calls
 */
export interface RetryPolicy {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
/**
 * Marketplace order
 */
export interface MarketplaceOrder {
    marketplaceOrderId: string;
    marketplace: 'AMAZON' | 'EBAY' | 'SHOPIFY' | 'WALMART' | 'ETSY';
    purchaseDate: Date;
    orderStatus: string;
    buyer: MarketplaceBuyer;
    shippingAddress: Address;
    items: MarketplaceOrderItem[];
    totalAmount: number;
    currency: string;
    shippingService: string;
    fulfillmentChannel?: string;
}
/**
 * Marketplace buyer information
 */
export interface MarketplaceBuyer {
    buyerId?: string;
    name: string;
    email?: string;
}
/**
 * Marketplace order item
 */
export interface MarketplaceOrderItem {
    orderItemId: string;
    sku: string;
    title: string;
    quantity: number;
    price: number;
    tax?: number;
    shippingPrice?: number;
    productId?: string;
}
/**
 * ERP system types
 */
export declare enum ERPSystem {
    SAP = "SAP",
    ORACLE = "ORACLE",
    NETSUITE = "NETSUITE",
    DYNAMICS = "DYNAMICS",
    EPICOR = "EPICOR"
}
/**
 * ERP order sync configuration
 */
export interface ERPSyncConfig {
    system: ERPSystem;
    endpoint: string;
    credentials: ERPCredentials;
    mappings: FieldMapping[];
    syncInterval?: number;
}
/**
 * ERP credentials
 */
export interface ERPCredentials {
    username?: string;
    password?: string;
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    tenantId?: string;
}
/**
 * Field mapping for data transformation
 */
export interface FieldMapping {
    sourceField: string;
    targetField: string;
    transform?: (value: any) => any;
    defaultValue?: any;
}
/**
 * WMS (Warehouse Management System) order
 */
export interface WMSOrder {
    wmsOrderId: string;
    externalOrderId: string;
    warehouseId: string;
    orderType: 'SALES_ORDER' | 'TRANSFER_ORDER' | 'RETURN_ORDER';
    priority: number;
    items: WMSOrderItem[];
    shippingAddress: Address;
    carrier?: string;
    serviceLevel?: string;
    requestedShipDate?: Date;
}
/**
 * WMS order item
 */
export interface WMSOrderItem {
    lineNumber: number;
    sku: string;
    quantity: number;
    lotNumber?: string;
    serialNumbers?: string[];
    expirationDate?: Date;
}
/**
 * Payment gateway transaction
 */
export interface PaymentTransaction {
    transactionId: string;
    orderId: string;
    gateway: 'STRIPE' | 'PAYPAL' | 'SQUARE' | 'AUTHORIZE_NET' | 'BRAINTREE';
    type: 'AUTHORIZE' | 'CAPTURE' | 'SALE' | 'REFUND' | 'VOID';
    amount: number;
    currency: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    gatewayResponse?: Record<string, any>;
    timestamp: Date;
}
/**
 * Shipping carrier types
 */
export declare enum ShippingCarrier {
    USPS = "USPS",
    UPS = "UPS",
    FEDEX = "FEDEX",
    DHL = "DHL",
    CANADA_POST = "CANADA_POST"
}
/**
 * Shipping label request
 */
export interface ShippingLabelRequest {
    orderId: string;
    carrier: ShippingCarrier;
    serviceLevel: string;
    fromAddress: Address;
    toAddress: Address;
    packages: ShipmentPackage[];
    insuranceAmount?: number;
    signatureRequired?: boolean;
}
/**
 * Shipping label response
 */
export interface ShippingLabelResponse {
    trackingNumber: string;
    labelUrl: string;
    carrier: ShippingCarrier;
    cost: number;
    currency: string;
    estimatedDeliveryDate?: Date;
}
/**
 * Integration health status
 */
export interface IntegrationHealth {
    integration: string;
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    lastChecked: Date;
    latency?: number;
    errorRate?: number;
    details?: Record<string, any>;
}
/**
 * Data transformation result
 */
export interface TransformationResult<T> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
    warnings?: string[];
}
/**
 * Validation error
 */
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}
/**
 * 1. Parse EDI 850 Purchase Order document into structured data
 *
 * @param ediContent - Raw EDI 850 document content
 * @returns Parsed purchase order structure
 *
 * @example
 * ```typescript
 * const edi850 = parseEDI850PurchaseOrder(rawEDIContent);
 * console.log(edi850.poNumber, edi850.lineItems);
 * ```
 */
export declare function parseEDI850PurchaseOrder(ediContent: string): EDI850PurchaseOrder;
/**
 * 2. Generate EDI 850 Purchase Order document from structured data
 *
 * @param po - Purchase order data
 * @param senderId - Sender identifier
 * @param receiverId - Receiver identifier
 * @returns EDI 850 formatted string
 *
 * @example
 * ```typescript
 * const ediDocument = generateEDI850PurchaseOrder(purchaseOrder, 'BUYER001', 'VENDOR001');
 * ```
 */
export declare function generateEDI850PurchaseOrder(po: EDI850PurchaseOrder, senderId: string, receiverId: string): string;
/**
 * 3. Validate EDI 850 Purchase Order structure
 *
 * @param po - Purchase order to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = validateEDI850PurchaseOrder(purchaseOrder);
 * if (!result.success) console.error(result.errors);
 * ```
 */
export declare function validateEDI850PurchaseOrder(po: EDI850PurchaseOrder): TransformationResult<EDI850PurchaseOrder>;
/**
 * 4. Generate EDI 855 Purchase Order Acknowledgment
 *
 * @param ack - PO acknowledgment data
 * @param senderId - Sender identifier
 * @param receiverId - Receiver identifier
 * @returns EDI 855 formatted string
 *
 * @example
 * ```typescript
 * const edi855 = generateEDI855POAcknowledgment(acknowledgment, 'VENDOR001', 'BUYER001');
 * ```
 */
export declare function generateEDI855POAcknowledgment(ack: EDI855POAcknowledgment, senderId: string, receiverId: string): string;
/**
 * 5. Parse EDI 855 Purchase Order Acknowledgment
 *
 * @param ediContent - Raw EDI 855 document
 * @returns Parsed PO acknowledgment structure
 *
 * @example
 * ```typescript
 * const acknowledgment = parseEDI855POAcknowledgment(rawEDIContent);
 * ```
 */
export declare function parseEDI855POAcknowledgment(ediContent: string): EDI855POAcknowledgment;
/**
 * 6. Create PO acknowledgment from purchase order
 *
 * @param po - Original purchase order
 * @param confirmations - Line item confirmations
 * @returns PO acknowledgment structure
 *
 * @example
 * ```typescript
 * const ack = createPOAcknowledgment(purchaseOrder, lineConfirmations);
 * ```
 */
export declare function createPOAcknowledgment(po: EDI850PurchaseOrder, confirmations: Array<{
    lineNumber: number;
    confirmedQuantity: number;
    status: 'ACCEPTED' | 'BACKORDERED' | 'REJECTED';
}>): EDI855POAcknowledgment;
/**
 * 7. Generate EDI 856 Advanced Ship Notice
 *
 * @param asn - Ship notice data
 * @param senderId - Sender identifier
 * @param receiverId - Receiver identifier
 * @returns EDI 856 formatted string
 *
 * @example
 * ```typescript
 * const edi856 = generateEDI856ShipNotice(shipNotice, 'VENDOR001', 'BUYER001');
 * ```
 */
export declare function generateEDI856ShipNotice(asn: EDI856ShipNotice, senderId: string, receiverId: string): string;
/**
 * 8. Parse EDI 856 Advanced Ship Notice
 *
 * @param ediContent - Raw EDI 856 document
 * @returns Parsed ship notice structure
 *
 * @example
 * ```typescript
 * const asn = parseEDI856ShipNotice(rawEDIContent);
 * ```
 */
export declare function parseEDI856ShipNotice(ediContent: string): EDI856ShipNotice;
/**
 * 9. Create ASN from shipment information
 *
 * @param orderId - Order identifier
 * @param packages - Shipment packages
 * @param carrier - Carrier information
 * @param trackingNumber - Tracking number
 * @returns ASN structure
 *
 * @example
 * ```typescript
 * const asn = createASNFromShipment(orderId, packages, carrier, tracking);
 * ```
 */
export declare function createASNFromShipment(orderId: string, packages: ShipmentPackage[], carrier: CarrierInfo, trackingNumber: string): EDI856ShipNotice;
/**
 * 10. Generate EDI 810 Invoice
 *
 * @param invoice - Invoice data
 * @param senderId - Sender identifier
 * @param receiverId - Receiver identifier
 * @returns EDI 810 formatted string
 *
 * @example
 * ```typescript
 * const edi810 = generateEDI810Invoice(invoice, 'VENDOR001', 'BUYER001');
 * ```
 */
export declare function generateEDI810Invoice(invoice: EDI810Invoice, senderId: string, receiverId: string): string;
/**
 * 11. Parse EDI 810 Invoice
 *
 * @param ediContent - Raw EDI 810 document
 * @returns Parsed invoice structure
 *
 * @example
 * ```typescript
 * const invoice = parseEDI810Invoice(rawEDIContent);
 * ```
 */
export declare function parseEDI810Invoice(ediContent: string): EDI810Invoice;
/**
 * 12. Create invoice from order and shipment
 *
 * @param order - Original order
 * @param shipment - Shipment information
 * @param taxRate - Tax rate to apply
 * @returns Invoice structure
 *
 * @example
 * ```typescript
 * const invoice = createInvoiceFromOrder(order, shipment, 0.08);
 * ```
 */
export declare function createInvoiceFromOrder(order: EDI850PurchaseOrder, shipment: EDI856ShipNotice, taxRate?: number): EDI810Invoice;
/**
 * 13. Register webhook for order events
 *
 * @param config - Webhook configuration
 * @returns Webhook registration result
 *
 * @example
 * ```typescript
 * const webhook = registerWebhook({
 *   url: 'https://example.com/webhook',
 *   events: ['order.created', 'order.shipped'],
 *   secret: 'secret-key'
 * });
 * ```
 */
export declare function registerWebhook(config: Partial<WebhookConfig>): WebhookConfig;
/**
 * 14. Generate webhook signature for payload verification
 *
 * @param payload - Webhook payload
 * @param secret - Webhook secret
 * @returns HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, webhookSecret);
 * ```
 */
export declare function generateWebhookSignature(payload: any, secret: string): string;
/**
 * 15. Verify webhook signature
 *
 * @param payload - Webhook payload
 * @param signature - Provided signature
 * @param secret - Webhook secret
 * @returns True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(payload, signature, secret);
 * ```
 */
export declare function verifyWebhookSignature(payload: any, signature: string, secret: string): boolean;
/**
 * 16. Send webhook event with retry logic
 *
 * @param webhook - Webhook configuration
 * @param event - Event data
 * @returns Promise resolving to success status
 *
 * @example
 * ```typescript
 * await sendWebhookEvent(webhook, { type: 'order.created', data: order });
 * ```
 */
export declare function sendWebhookEvent(webhook: WebhookConfig, event: Partial<WebhookEvent>): Promise<boolean>;
/**
 * 17. Parse webhook event from request
 *
 * @param requestBody - Request body
 * @param signature - Request signature header
 * @param secret - Webhook secret
 * @returns Parsed webhook event if valid
 *
 * @example
 * ```typescript
 * const event = parseWebhookEvent(req.body, req.headers['x-signature'], secret);
 * ```
 */
export declare function parseWebhookEvent(requestBody: any, signature: string, secret: string): WebhookEvent | null;
/**
 * 18. Parse Amazon order
 *
 * @param amazonOrder - Amazon order data
 * @returns Standardized marketplace order
 *
 * @example
 * ```typescript
 * const order = parseAmazonOrder(amazonOrderData);
 * ```
 */
export declare function parseAmazonOrder(amazonOrder: any): MarketplaceOrder;
/**
 * 19. Parse Shopify order
 *
 * @param shopifyOrder - Shopify order data
 * @returns Standardized marketplace order
 *
 * @example
 * ```typescript
 * const order = parseShopifyOrder(shopifyOrderData);
 * ```
 */
export declare function parseShopifyOrder(shopifyOrder: any): MarketplaceOrder;
/**
 * 20. Transform marketplace order to internal order format
 *
 * @param marketplaceOrder - Marketplace order
 * @returns Internal order format
 *
 * @example
 * ```typescript
 * const internalOrder = transformMarketplaceOrder(marketplaceOrder);
 * ```
 */
export declare function transformMarketplaceOrder(marketplaceOrder: MarketplaceOrder): any;
/**
 * 21. Submit fulfillment to marketplace
 *
 * @param marketplace - Marketplace identifier
 * @param orderId - Marketplace order ID
 * @param trackingNumber - Shipment tracking number
 * @param carrier - Carrier name
 * @returns Fulfillment confirmation
 *
 * @example
 * ```typescript
 * await submitMarketplaceFulfillment('AMAZON', orderId, tracking, 'UPS');
 * ```
 */
export declare function submitMarketplaceFulfillment(marketplace: string, orderId: string, trackingNumber: string, carrier: string): Promise<{
    success: boolean;
    confirmationId?: string;
}>;
/**
 * 22. Sync order to ERP system
 *
 * @param erpConfig - ERP configuration
 * @param order - Order data
 * @returns Sync result with ERP order ID
 *
 * @example
 * ```typescript
 * const result = await syncOrderToERP(erpConfig, order);
 * ```
 */
export declare function syncOrderToERP(erpConfig: ERPSyncConfig, order: any): Promise<{
    success: boolean;
    erpOrderId?: string;
    errors?: string[];
}>;
/**
 * 23. Fetch order status from ERP
 *
 * @param erpConfig - ERP configuration
 * @param erpOrderId - ERP order identifier
 * @returns Order status from ERP
 *
 * @example
 * ```typescript
 * const status = await fetchERPOrderStatus(erpConfig, erpOrderId);
 * ```
 */
export declare function fetchERPOrderStatus(erpConfig: ERPSyncConfig, erpOrderId: string): Promise<any>;
/**
 * 24. Transform data using field mappings
 *
 * @param sourceData - Source data object
 * @param mappings - Field mappings
 * @returns Transformed data
 *
 * @example
 * ```typescript
 * const transformed = transformDataWithMappings(data, mappings);
 * ```
 */
export declare function transformDataWithMappings(sourceData: any, mappings: FieldMapping[]): any;
/**
 * 25. Create ERP authentication token
 *
 * @param erpSystem - ERP system type
 * @param credentials - ERP credentials
 * @returns Authentication token
 *
 * @example
 * ```typescript
 * const token = await createERPAuthToken('SAP', credentials);
 * ```
 */
export declare function createERPAuthToken(erpSystem: ERPSystem, credentials: ERPCredentials): Promise<string>;
/**
 * 26. Submit order to WMS for fulfillment
 *
 * @param wmsEndpoint - WMS API endpoint
 * @param order - Order data
 * @returns WMS order confirmation
 *
 * @example
 * ```typescript
 * const wmsOrder = await submitOrderToWMS(endpoint, order);
 * ```
 */
export declare function submitOrderToWMS(wmsEndpoint: string, order: any): Promise<WMSOrder>;
/**
 * 27. Fetch fulfillment status from WMS
 *
 * @param wmsEndpoint - WMS API endpoint
 * @param wmsOrderId - WMS order identifier
 * @returns Fulfillment status
 *
 * @example
 * ```typescript
 * const status = await fetchWMSFulfillmentStatus(endpoint, wmsOrderId);
 * ```
 */
export declare function fetchWMSFulfillmentStatus(wmsEndpoint: string, wmsOrderId: string): Promise<any>;
/**
 * 28. Cancel order in WMS
 *
 * @param wmsEndpoint - WMS API endpoint
 * @param wmsOrderId - WMS order identifier
 * @returns Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelWMSOrder(endpoint, wmsOrderId);
 * ```
 */
export declare function cancelWMSOrder(wmsEndpoint: string, wmsOrderId: string): Promise<{
    success: boolean;
    message?: string;
}>;
/**
 * 29. Process payment authorization
 *
 * @param gateway - Payment gateway
 * @param orderId - Order identifier
 * @param amount - Payment amount
 * @param currency - Currency code
 * @returns Payment transaction result
 *
 * @example
 * ```typescript
 * const payment = await authorizePayment('STRIPE', orderId, 99.99, 'USD');
 * ```
 */
export declare function authorizePayment(gateway: PaymentTransaction['gateway'], orderId: string, amount: number, currency: string): Promise<PaymentTransaction>;
/**
 * 30. Capture authorized payment
 *
 * @param gateway - Payment gateway
 * @param transactionId - Authorization transaction ID
 * @param amount - Amount to capture
 * @returns Capture transaction result
 *
 * @example
 * ```typescript
 * const capture = await capturePayment('STRIPE', authTxnId, 99.99);
 * ```
 */
export declare function capturePayment(gateway: PaymentTransaction['gateway'], transactionId: string, amount: number): Promise<PaymentTransaction>;
/**
 * 31. Process refund
 *
 * @param gateway - Payment gateway
 * @param transactionId - Original transaction ID
 * @param amount - Refund amount
 * @returns Refund transaction result
 *
 * @example
 * ```typescript
 * const refund = await processRefund('STRIPE', txnId, 50.00);
 * ```
 */
export declare function processRefund(gateway: PaymentTransaction['gateway'], transactionId: string, amount: number): Promise<PaymentTransaction>;
/**
 * 32. Create shipping label
 *
 * @param request - Shipping label request
 * @returns Shipping label with tracking
 *
 * @example
 * ```typescript
 * const label = await createShippingLabel(labelRequest);
 * ```
 */
export declare function createShippingLabel(request: ShippingLabelRequest): Promise<ShippingLabelResponse>;
/**
 * 33. Track shipment status
 *
 * @param carrier - Shipping carrier
 * @param trackingNumber - Tracking number
 * @returns Shipment tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackShipment('UPS', trackingNumber);
 * ```
 */
export declare function trackShipment(carrier: ShippingCarrier, trackingNumber: string): Promise<any>;
/**
 * 34. Calculate shipping rates
 *
 * @param fromAddress - Origin address
 * @param toAddress - Destination address
 * @param packages - Package details
 * @returns Available shipping rates
 *
 * @example
 * ```typescript
 * const rates = await calculateShippingRates(from, to, packages);
 * ```
 */
export declare function calculateShippingRates(fromAddress: Address, toAddress: Address, packages: ShipmentPackage[]): Promise<Array<{
    carrier: ShippingCarrier;
    service: string;
    rate: number;
    estimatedDays: number;
}>>;
/**
 * 35. Validate and transform order data
 *
 * @param rawData - Raw order data
 * @param schema - Validation schema
 * @returns Transformation result
 *
 * @example
 * ```typescript
 * const result = validateAndTransformOrder(rawData, schema);
 * ```
 */
export declare function validateAndTransformOrder<T>(rawData: any, schema: any): TransformationResult<T>;
/**
 * 36. Check integration health
 *
 * @param integrationName - Integration identifier
 * @param endpoint - Integration endpoint
 * @returns Health check result
 *
 * @example
 * ```typescript
 * const health = await checkIntegrationHealth('ERP', erpEndpoint);
 * ```
 */
export declare function checkIntegrationHealth(integrationName: string, endpoint: string): Promise<IntegrationHealth>;
/**
 * 37. Log integration event for monitoring
 *
 * @param integration - Integration name
 * @param eventType - Event type
 * @param data - Event data
 * @returns Event log entry
 *
 * @example
 * ```typescript
 * logIntegrationEvent('EDI', 'PO_RECEIVED', { poNumber: 'PO123' });
 * ```
 */
export declare function logIntegrationEvent(integration: string, eventType: string, data: any): any;
declare const _default: {
    parseEDI850PurchaseOrder: typeof parseEDI850PurchaseOrder;
    generateEDI850PurchaseOrder: typeof generateEDI850PurchaseOrder;
    validateEDI850PurchaseOrder: typeof validateEDI850PurchaseOrder;
    generateEDI855POAcknowledgment: typeof generateEDI855POAcknowledgment;
    parseEDI855POAcknowledgment: typeof parseEDI855POAcknowledgment;
    createPOAcknowledgment: typeof createPOAcknowledgment;
    generateEDI856ShipNotice: typeof generateEDI856ShipNotice;
    parseEDI856ShipNotice: typeof parseEDI856ShipNotice;
    createASNFromShipment: typeof createASNFromShipment;
    generateEDI810Invoice: typeof generateEDI810Invoice;
    parseEDI810Invoice: typeof parseEDI810Invoice;
    createInvoiceFromOrder: typeof createInvoiceFromOrder;
    registerWebhook: typeof registerWebhook;
    generateWebhookSignature: typeof generateWebhookSignature;
    verifyWebhookSignature: typeof verifyWebhookSignature;
    sendWebhookEvent: typeof sendWebhookEvent;
    parseWebhookEvent: typeof parseWebhookEvent;
    parseAmazonOrder: typeof parseAmazonOrder;
    parseShopifyOrder: typeof parseShopifyOrder;
    transformMarketplaceOrder: typeof transformMarketplaceOrder;
    submitMarketplaceFulfillment: typeof submitMarketplaceFulfillment;
    syncOrderToERP: typeof syncOrderToERP;
    fetchERPOrderStatus: typeof fetchERPOrderStatus;
    transformDataWithMappings: typeof transformDataWithMappings;
    createERPAuthToken: typeof createERPAuthToken;
    submitOrderToWMS: typeof submitOrderToWMS;
    fetchWMSFulfillmentStatus: typeof fetchWMSFulfillmentStatus;
    cancelWMSOrder: typeof cancelWMSOrder;
    authorizePayment: typeof authorizePayment;
    capturePayment: typeof capturePayment;
    processRefund: typeof processRefund;
    createShippingLabel: typeof createShippingLabel;
    trackShipment: typeof trackShipment;
    calculateShippingRates: typeof calculateShippingRates;
    validateAndTransformOrder: typeof validateAndTransformOrder;
    checkIntegrationHealth: typeof checkIntegrationHealth;
    logIntegrationEvent: typeof logIntegrationEvent;
};
export default _default;
//# sourceMappingURL=order-integration-kit.d.ts.map