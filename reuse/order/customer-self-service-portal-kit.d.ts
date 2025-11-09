/**
 * LOC: WC-ORD-CSSSVC-001
 * File: /reuse/order/customer-self-service-portal-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Customer portal controllers
 *   - Self-service API endpoints
 *   - Mobile app services
 *   - Customer notification services
 */
import { Cache } from 'cache-manager';
/**
 * Order tracking status for customer view
 */
export declare enum CustomerOrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    IN_TRANSIT = "in_transit",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    PARTIALLY_DELIVERED = "partially_delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned",
    REFUNDED = "refunded",
    ON_HOLD = "on_hold",
    FAILED = "failed"
}
/**
 * Shipment tracking event types
 */
export declare enum TrackingEventType {
    LABEL_CREATED = "label_created",
    PICKED_UP = "picked_up",
    IN_TRANSIT = "in_transit",
    ARRIVED_AT_FACILITY = "arrived_at_facility",
    DEPARTED_FACILITY = "departed_facility",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERY_ATTEMPTED = "delivery_attempted",
    DELIVERED = "delivered",
    EXCEPTION = "exception",
    DELAYED = "delayed",
    RETURNED_TO_SENDER = "returned_to_sender"
}
/**
 * Delivery window preferences
 */
export declare enum DeliveryWindow {
    MORNING = "morning",// 8am-12pm
    AFTERNOON = "afternoon",// 12pm-5pm
    EVENING = "evening",// 5pm-8pm
    BUSINESS_HOURS = "business_hours",// 9am-5pm
    ANYTIME = "anytime"
}
/**
 * Order modification types
 */
export declare enum ModificationType {
    CHANGE_ADDRESS = "change_address",
    CHANGE_DELIVERY_DATE = "change_delivery_date",
    ADD_ITEMS = "add_items",
    REMOVE_ITEMS = "remove_items",
    UPDATE_QUANTITIES = "update_quantities",
    CHANGE_PAYMENT_METHOD = "change_payment_method",
    CHANGE_SPECIAL_INSTRUCTIONS = "change_special_instructions"
}
/**
 * Cancellation reasons
 */
export declare enum CancellationReason {
    CUSTOMER_REQUEST = "customer_request",
    ORDERED_BY_MISTAKE = "ordered_by_mistake",
    FOUND_BETTER_PRICE = "found_better_price",
    CHANGED_MIND = "changed_mind",
    DELIVERY_TOO_LATE = "delivery_too_late",
    ITEM_NO_LONGER_NEEDED = "item_no_longer_needed",
    ORDERED_DUPLICATE = "ordered_duplicate",
    OTHER = "other"
}
/**
 * Communication channel preferences
 */
export declare enum CommunicationChannel {
    EMAIL = "email",
    SMS = "sms",
    PHONE = "phone",
    PUSH_NOTIFICATION = "push_notification",
    IN_APP = "in_app",
    PORTAL_ONLY = "portal_only"
}
/**
 * Notification event types
 */
export declare enum NotificationEvent {
    ORDER_CONFIRMED = "order_confirmed",
    ORDER_SHIPPED = "order_shipped",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    DELAYED = "delayed",
    CANCELLED = "cancelled",
    REFUND_PROCESSED = "refund_processed",
    INVOICE_READY = "invoice_ready",
    BACK_IN_STOCK = "back_in_stock"
}
/**
 * Order history filter criteria
 */
export interface OrderHistoryFilter {
    customerId: string;
    startDate?: Date;
    endDate?: Date;
    status?: CustomerOrderStatus[];
    minAmount?: number;
    maxAmount?: number;
    searchTerm?: string;
    itemCategory?: string;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'amount' | 'status';
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Order tracking details
 */
export interface OrderTrackingDetails {
    orderId: string;
    orderNumber: string;
    status: CustomerOrderStatus;
    placedAt: Date;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    trackingNumber?: string;
    carrier?: string;
    shipments: ShipmentTrackingInfo[];
    currentLocation?: string;
    deliveryProgress: number;
    canCancel: boolean;
    canModify: boolean;
    canReturn: boolean;
}
/**
 * Shipment tracking information
 */
export interface ShipmentTrackingInfo {
    shipmentId: string;
    trackingNumber: string;
    carrier: string;
    status: string;
    items: Array<{
        itemId: string;
        description: string;
        quantity: number;
    }>;
    trackingEvents: TrackingEvent[];
    estimatedDelivery?: Date;
    currentLocation?: string;
}
/**
 * Tracking event
 */
export interface TrackingEvent {
    eventType: TrackingEventType;
    timestamp: Date;
    location: string;
    description: string;
    city?: string;
    stateProvince?: string;
    country?: string;
}
/**
 * Order detail view for customers
 */
export interface CustomerOrderDetail {
    orderId: string;
    orderNumber: string;
    status: CustomerOrderStatus;
    placedAt: Date;
    subtotal: number;
    tax: number;
    shippingFee: number;
    discount: number;
    total: number;
    currency: string;
    lineItems: OrderLineItem[];
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: PaymentMethodInfo;
    invoiceUrl?: string;
    trackingNumbers: string[];
    specialInstructions?: string;
    estimatedDelivery?: Date;
    deliveryWindow?: DeliveryWindow;
}
/**
 * Order line item
 */
export interface OrderLineItem {
    lineItemId: string;
    productId: string;
    sku: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    imageUrl?: string;
    status: string;
    shipmentId?: string;
    canReorder: boolean;
}
/**
 * Address information
 */
export interface Address {
    name: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
}
/**
 * Payment method info (sanitized for customer view)
 */
export interface PaymentMethodInfo {
    type: 'credit_card' | 'debit_card' | 'paypal' | 'net_terms' | 'check' | 'wire_transfer';
    lastFourDigits?: string;
    cardBrand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    accountName?: string;
}
/**
 * Proof of delivery information
 */
export interface ProofOfDelivery {
    orderId: string;
    shipmentId: string;
    deliveredAt: Date;
    recipientName: string;
    recipientSignature?: string;
    photoUrl?: string;
    location: {
        latitude?: number;
        longitude?: number;
        address: string;
    };
    deliveryNotes?: string;
    driverId?: string;
    driverName?: string;
}
/**
 * Order template
 */
export interface OrderTemplate {
    templateId: string;
    customerId: string;
    name: string;
    description?: string;
    items: Array<{
        productId: string;
        sku: string;
        quantity: number;
    }>;
    shippingAddress?: Address;
    deliveryInstructions?: string;
    createdAt: Date;
    lastUsedAt?: Date;
    useCount: number;
}
/**
 * Modification request
 */
export interface ModificationRequest {
    orderId: string;
    customerId: string;
    modificationType: ModificationType;
    requestedChanges: Record<string, any>;
    reason?: string;
    requestedAt: Date;
}
/**
 * Cancellation request
 */
export interface CancellationRequest {
    orderId: string;
    customerId: string;
    reason: CancellationReason;
    reasonDetails?: string;
    requestFullRefund: boolean;
    restockItems: boolean;
    requestedAt: Date;
}
/**
 * Communication preferences
 */
export interface CommunicationPreferences {
    customerId: string;
    channels: {
        channel: CommunicationChannel;
        enabled: boolean;
        address?: string;
    }[];
    eventSubscriptions: {
        event: NotificationEvent;
        enabled: boolean;
    }[];
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone: string;
}
/**
 * 1. Retrieves real-time order status with caching.
 * Uses intelligent caching with 5-minute TTL for active orders.
 */
export declare function getOrderStatus(orderId: string, customerId: string, cacheManager?: Cache): Promise<OrderTrackingDetails>;
/**
 * 2. Retrieves status for multiple orders in batch (optimized query).
 * Reduces N+1 queries with single batch fetch.
 */
export declare function getMultipleOrderStatuses(orderIds: string[], customerId: string): Promise<Map<string, OrderTrackingDetails>>;
/**
 * 3. Calculates delivery progress percentage based on shipment events.
 */
export declare function calculateDeliveryProgress(status: CustomerOrderStatus, trackingEvents: TrackingEvent[]): number;
/**
 * 4. Determines if order can be cancelled by customer.
 * Business rules: can cancel if not yet shipped and within cancellation window.
 */
export declare function canCustomerCancelOrder(status: CustomerOrderStatus, placedAt: Date, cancellationWindowHours?: number): boolean;
/**
 * 5. Determines if order can be modified by customer.
 */
export declare function canCustomerModifyOrder(status: CustomerOrderStatus, placedAt: Date, modificationWindowHours?: number): boolean;
/**
 * 6. Subscribes customer to real-time order status updates via webhook.
 */
export declare function subscribeToOrderUpdates(orderId: string, customerId: string, webhookUrl: string, eventTypes: TrackingEventType[]): Promise<{
    subscriptionId: string;
    expiresAt: Date;
}>;
/**
 * 7. Retrieves paginated order history with advanced filtering.
 * Optimized with indexed queries and result limiting.
 */
export declare function getOrderHistory(filter: OrderHistoryFilter): Promise<{
    orders: CustomerOrderDetail[];
    total: number;
    page: number;
    pages: number;
}>;
/**
 * 8. Searches order history by product name, SKU, or order number.
 */
export declare function searchOrderHistory(customerId: string, searchTerm: string, limit?: number): Promise<CustomerOrderDetail[]>;
/**
 * 9. Groups order history by time period for analytics.
 */
export declare function groupOrdersByPeriod(orders: CustomerOrderDetail[], period: 'day' | 'week' | 'month' | 'quarter' | 'year'): Map<string, {
    orders: CustomerOrderDetail[];
    totalSpent: number;
    orderCount: number;
}>;
/**
 * 10. Calculates customer order statistics and insights.
 */
export declare function calculateOrderStatistics(orders: CustomerOrderDetail[]): {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    mostOrderedCategories: string[];
    orderFrequency: number;
    lastOrderDate?: Date;
    firstOrderDate?: Date;
};
/**
 * 11. Exports order history to CSV format.
 */
export declare function exportOrderHistoryToCSV(orders: CustomerOrderDetail[]): string;
/**
 * 12. Retrieves complete order details with authorization check.
 */
export declare function getOrderDetail(orderId: string, customerId: string): Promise<CustomerOrderDetail>;
/**
 * 14. Retrieves line item details with product information.
 */
export declare function getOrderLineItems(orderId: string, customerId: string): Promise<OrderLineItem[]>;
/**
 * 15. Retrieves order timeline with all status changes.
 */
export declare function getOrderTimeline(orderId: string, customerId: string): Promise<Array<{
    timestamp: Date;
    event: string;
    description: string;
    actor?: string;
}>>;
/**
 * 16. Retrieves order documents (invoice, packing slip, etc.).
 */
export declare function getOrderDocuments(orderId: string, customerId: string): Promise<Array<{
    documentType: string;
    url: string;
    generatedAt: Date;
}>>;
/**
 * 17. Retrieves shipment tracking details from carrier API.
 */
export declare function getShipmentTracking(trackingNumber: string, carrier: string): Promise<ShipmentTrackingInfo>;
/**
 * 18. Retrieves all shipments for an order.
 */
export declare function getOrderShipments(orderId: string, customerId: string): Promise<ShipmentTrackingInfo[]>;
/**
 * 19. Parses and normalizes tracking events from different carriers.
 */
export declare function normalizeTrackingEvent(carrierEvent: any, carrier: string): TrackingEvent;
/**
 * 20. Estimates delivery date based on carrier and service level.
 */
export declare function estimateDeliveryDate(shippedAt: Date, carrier: string, serviceLevel: string, originZip: string, destinationZip: string): Date;
/**
 * 21. Checks for shipment delays and exceptions.
 */
export declare function detectShipmentDelays(trackingInfo: ShipmentTrackingInfo, expectedDelivery: Date): {
    isDelayed: boolean;
    delayHours: number;
    reason?: string;
};
/**
 * 22. Updates delivery instructions for pending shipments.
 */
export declare function updateDeliveryInstructions(orderId: string, customerId: string, instructions: string): Promise<{
    success: boolean;
    updatedShipments: string[];
}>;
/**
 * 23. Requests delivery date change for order.
 */
export declare function requestDeliveryDateChange(orderId: string, customerId: string, newDeliveryDate: Date, reason?: string): Promise<{
    approved: boolean;
    newEstimatedDelivery?: Date;
    additionalFee?: number;
}>;
/**
 * 24. Sets delivery window preference.
 */
export declare function setDeliveryWindow(orderId: string, customerId: string, deliveryWindow: DeliveryWindow): Promise<{
    success: boolean;
    carrierSupported: boolean;
}>;
/**
 * 25. Requests delivery hold at carrier location.
 */
export declare function requestDeliveryHold(orderId: string, customerId: string, holdLocation?: string): Promise<{
    success: boolean;
    holdLocationAddress?: string;
    holdUntil?: Date;
}>;
/**
 * 26. Submits order modification request.
 */
export declare function submitOrderModification(request: ModificationRequest): Promise<{
    requestId: string;
    status: 'pending' | 'approved' | 'rejected';
    requiresApproval: boolean;
    additionalCost?: number;
}>;
/**
 * 27. Updates shipping address for pending orders.
 */
export declare function updateShippingAddress(orderId: string, customerId: string, newAddress: Address): Promise<{
    success: boolean;
    validationErrors?: string[];
}>;
/**
 * 28. Adds items to existing order (if allowed).
 */
export declare function addItemsToOrder(orderId: string, customerId: string, items: Array<{
    productId: string;
    quantity: number;
}>): Promise<{
    success: boolean;
    newLineItems?: string[];
    additionalCost?: number;
}>;
/**
 * 29. Removes items from order (if allowed).
 */
export declare function removeItemsFromOrder(orderId: string, customerId: string, lineItemIds: string[]): Promise<{
    success: boolean;
    refundAmount?: number;
}>;
/**
 * 30. Submits order cancellation request.
 */
export declare function submitCancellationRequest(request: CancellationRequest): Promise<{
    requestId: string;
    status: 'pending' | 'approved' | 'rejected';
    estimatedRefundAmount: number;
    refundMethod: string;
    processingTime: string;
}>;
/**
 * 31. Processes approved cancellation.
 */
export declare function processCancellation(orderId: string, requestId: string): Promise<{
    success: boolean;
    refundId?: string;
}>;
/**
 * 32. Calculates cancellation fee based on order status.
 */
export declare function calculateCancellationFee(orderTotal: number, status: CustomerOrderStatus, placedAt: Date): number;
/**
 * 33. Retrieves cancellation status and refund details.
 */
export declare function getCancellationStatus(orderId: string, customerId: string): Promise<{
    cancelled: boolean;
    cancelledAt?: Date;
    reason?: string;
    refundAmount?: number;
    refundStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    refundedAt?: Date;
}>;
/**
 * 34. Generates and retrieves invoice PDF.
 */
export declare function generateInvoicePDF(orderId: string, customerId: string): Promise<{
    url: string;
    expiresAt: Date;
}>;
/**
 * 35. Emails invoice to customer.
 */
export declare function emailInvoice(orderId: string, customerId: string, emailAddress?: string): Promise<{
    success: boolean;
    sentTo: string;
}>;
/**
 * 36. Retrieves proof of delivery for completed order.
 */
export declare function getProofOfDelivery(orderId: string, customerId: string): Promise<ProofOfDelivery | null>;
/**
 * 37. Downloads proof of delivery document.
 */
export declare function downloadProofOfDelivery(orderId: string, customerId: string, format: 'pdf' | 'image'): Promise<{
    url: string;
    expiresAt: Date;
}>;
/**
 * 38. Creates reorder from previous order.
 */
export declare function reorderFromPreviousOrder(sourceOrderId: string, customerId: string, options?: {
    excludeUnavailableItems?: boolean;
    useCurrentPricing?: boolean;
    updateQuantities?: Map<string, number>;
}): Promise<{
    newOrderId: string;
    itemsAdded: number;
    itemsUnavailable: number;
    unavailableItems?: string[];
    priceDifference?: number;
}>;
/**
 * 39. Adds frequently ordered items to cart with one click.
 */
export declare function quickReorderFrequentItems(customerId: string, itemLimit?: number): Promise<{
    cartId: string;
    itemsAdded: number;
    totalValue: number;
}>;
/**
 * 40. Retrieves customer's reorder suggestions based on purchase history.
 */
export declare function getReorderSuggestions(customerId: string, limit?: number): Promise<Array<{
    productId: string;
    sku: string;
    description: string;
    lastOrderedAt: Date;
    orderFrequency: number;
    averageQuantity: number;
    currentPrice: number;
    inStock: boolean;
}>>;
/**
 * 41. Creates order template from cart or order.
 */
export declare function createOrderTemplate(customerId: string, name: string, items: Array<{
    productId: string;
    quantity: number;
}>, description?: string): Promise<{
    templateId: string;
}>;
/**
 * 42. Retrieves customer's order templates.
 */
export declare function getOrderTemplates(customerId: string): Promise<OrderTemplate[]>;
/**
 * Bonus: Updates customer communication preferences.
 */
export declare function updateCommunicationPreferences(customerId: string, preferences: Partial<CommunicationPreferences>): Promise<{
    success: boolean;
}>;
/**
 * Bonus: Retrieves customer communication preferences.
 */
export declare function getCommunicationPreferences(customerId: string): Promise<CommunicationPreferences>;
export declare const CustomerSelfServicePortalKit: {
    getOrderStatus: typeof getOrderStatus;
    getMultipleOrderStatuses: typeof getMultipleOrderStatuses;
    calculateDeliveryProgress: typeof calculateDeliveryProgress;
    canCustomerCancelOrder: typeof canCustomerCancelOrder;
    canCustomerModifyOrder: typeof canCustomerModifyOrder;
    subscribeToOrderUpdates: typeof subscribeToOrderUpdates;
    getOrderHistory: typeof getOrderHistory;
    searchOrderHistory: typeof searchOrderHistory;
    groupOrdersByPeriod: typeof groupOrdersByPeriod;
    calculateOrderStatistics: typeof calculateOrderStatistics;
    exportOrderHistoryToCSV: typeof exportOrderHistoryToCSV;
    getOrderDetail: typeof getOrderDetail;
    getOrderLineItems: typeof getOrderLineItems;
    getOrderTimeline: typeof getOrderTimeline;
    getOrderDocuments: typeof getOrderDocuments;
    getShipmentTracking: typeof getShipmentTracking;
    getOrderShipments: typeof getOrderShipments;
    normalizeTrackingEvent: typeof normalizeTrackingEvent;
    estimateDeliveryDate: typeof estimateDeliveryDate;
    detectShipmentDelays: typeof detectShipmentDelays;
    updateDeliveryInstructions: typeof updateDeliveryInstructions;
    requestDeliveryDateChange: typeof requestDeliveryDateChange;
    setDeliveryWindow: typeof setDeliveryWindow;
    requestDeliveryHold: typeof requestDeliveryHold;
    submitOrderModification: typeof submitOrderModification;
    updateShippingAddress: typeof updateShippingAddress;
    addItemsToOrder: typeof addItemsToOrder;
    removeItemsFromOrder: typeof removeItemsFromOrder;
    submitCancellationRequest: typeof submitCancellationRequest;
    processCancellation: typeof processCancellation;
    calculateCancellationFee: typeof calculateCancellationFee;
    getCancellationStatus: typeof getCancellationStatus;
    generateInvoicePDF: typeof generateInvoicePDF;
    emailInvoice: typeof emailInvoice;
    getProofOfDelivery: typeof getProofOfDelivery;
    downloadProofOfDelivery: typeof downloadProofOfDelivery;
    reorderFromPreviousOrder: typeof reorderFromPreviousOrder;
    quickReorderFrequentItems: typeof quickReorderFrequentItems;
    getReorderSuggestions: typeof getReorderSuggestions;
    createOrderTemplate: typeof createOrderTemplate;
    getOrderTemplates: typeof getOrderTemplates;
    updateCommunicationPreferences: typeof updateCommunicationPreferences;
    getCommunicationPreferences: typeof getCommunicationPreferences;
};
//# sourceMappingURL=customer-self-service-portal-kit.d.ts.map