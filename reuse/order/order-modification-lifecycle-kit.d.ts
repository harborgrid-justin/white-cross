/**
 * LOC: WC-ORD-MODLIF-001
 * File: /reuse/order/order-modification-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Workflow engines
 *   - Audit systems
 */
/**
 * Order status enumeration
 */
export declare enum OrderStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    ON_HOLD = "ON_HOLD",
    PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Order modification type enumeration
 */
export declare enum OrderModificationType {
    QUANTITY_CHANGE = "QUANTITY_CHANGE",
    PRICE_ADJUSTMENT = "PRICE_ADJUSTMENT",
    DATE_CHANGE = "DATE_CHANGE",
    CUSTOMER_CHANGE = "CUSTOMER_CHANGE",
    ADDRESS_CHANGE = "ADDRESS_CHANGE",
    PAYMENT_METHOD_CHANGE = "PAYMENT_METHOD_CHANGE",
    SHIPPING_METHOD_CHANGE = "SHIPPING_METHOD_CHANGE",
    LINE_ITEM_ADDITION = "LINE_ITEM_ADDITION",
    LINE_ITEM_REMOVAL = "LINE_ITEM_REMOVAL",
    DISCOUNT_APPLICATION = "DISCOUNT_APPLICATION",
    TAX_ADJUSTMENT = "TAX_ADJUSTMENT",
    NOTES_UPDATE = "NOTES_UPDATE"
}
/**
 * Change approval status
 */
export declare enum ChangeApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    AUTO_APPROVED = "AUTO_APPROVED"
}
/**
 * Hold reason enumeration
 */
export declare enum HoldReason {
    PAYMENT_VERIFICATION = "PAYMENT_VERIFICATION",
    FRAUD_CHECK = "FRAUD_CHECK",
    INVENTORY_CHECK = "INVENTORY_CHECK",
    CUSTOMER_REQUEST = "CUSTOMER_REQUEST",
    ADDRESS_VERIFICATION = "ADDRESS_VERIFICATION",
    CREDIT_LIMIT_EXCEEDED = "CREDIT_LIMIT_EXCEEDED",
    MANUAL_REVIEW = "MANUAL_REVIEW",
    REGULATORY_COMPLIANCE = "REGULATORY_COMPLIANCE",
    OTHER = "OTHER"
}
/**
 * Cancellation reason enumeration
 */
export declare enum CancellationReason {
    CUSTOMER_REQUEST = "CUSTOMER_REQUEST",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    FRAUD_DETECTED = "FRAUD_DETECTED",
    DUPLICATE_ORDER = "DUPLICATE_ORDER",
    SHIPPING_ISSUE = "SHIPPING_ISSUE",
    PRICING_ERROR = "PRICING_ERROR",
    CUSTOMER_UNAVAILABLE = "CUSTOMER_UNAVAILABLE",
    REGULATORY_RESTRICTION = "REGULATORY_RESTRICTION",
    OTHER = "OTHER"
}
/**
 * Order line item interface
 */
export interface OrderLineItem {
    lineItemId: string;
    productId: string;
    sku: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    metadata?: Record<string, any>;
    version: number;
    modifiedAt?: Date;
    modifiedBy?: string;
}
/**
 * Order modification record
 */
export interface OrderModification {
    modificationId: string;
    orderId: string;
    type: OrderModificationType;
    timestamp: Date;
    modifiedBy: string;
    modifiedByRole: string;
    previousValue: any;
    newValue: any;
    reason?: string;
    approvalStatus: ChangeApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Order amendment
 */
export interface OrderAmendment {
    amendmentId: string;
    orderId: string;
    amendmentNumber: string;
    createdAt: Date;
    createdBy: string;
    modifications: OrderModification[];
    status: ChangeApprovalStatus;
    effectiveDate?: Date;
    notes?: string;
    requiresCustomerApproval: boolean;
    customerApprovedAt?: Date;
    totalImpact: {
        priceDelta: number;
        quantityDelta: number;
        taxDelta: number;
    };
}
/**
 * Order hold record
 */
export interface OrderHold {
    holdId: string;
    orderId: string;
    reason: HoldReason;
    description: string;
    placedAt: Date;
    placedBy: string;
    releasedAt?: Date;
    releasedBy?: string;
    releaseNotes?: string;
    expiresAt?: Date;
    autoRelease: boolean;
    notificationsSent: string[];
}
/**
 * Order cancellation record
 */
export interface OrderCancellation {
    cancellationId: string;
    orderId: string;
    reason: CancellationReason;
    description: string;
    cancelledAt: Date;
    cancelledBy: string;
    refundAmount?: number;
    refundProcessed: boolean;
    restockingFee?: number;
    partialCancellation: boolean;
    cancelledLineItems?: string[];
    customerNotified: boolean;
}
/**
 * Order state transition
 */
export interface OrderStateTransition {
    transitionId: string;
    orderId: string;
    fromStatus: OrderStatus;
    toStatus: OrderStatus;
    timestamp: Date;
    triggeredBy: string;
    triggeredBySystem: boolean;
    reason?: string;
    validationsPassed: boolean;
    validationErrors?: string[];
    rollbackAvailable: boolean;
}
/**
 * Order version
 */
export interface OrderVersion {
    versionId: string;
    orderId: string;
    versionNumber: number;
    createdAt: Date;
    createdBy: string;
    snapshot: any;
    changesSummary: string;
    tags?: string[];
    restorable: boolean;
}
/**
 * Order audit entry
 */
export interface OrderAuditEntry {
    auditId: string;
    orderId: string;
    timestamp: Date;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
    }>;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
/**
 * Complete order interface
 */
export interface Order {
    orderId: string;
    orderNumber: string;
    customerId: string;
    status: OrderStatus;
    lineItems: OrderLineItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    shippingCost: number;
    total: number;
    currency: string;
    orderDate: Date;
    requestedDeliveryDate?: Date;
    shippingAddress: any;
    billingAddress: any;
    paymentMethod: string;
    shippingMethod: string;
    notes?: string;
    metadata?: Record<string, any>;
    version: number;
    currentHold?: OrderHold;
    modifications: OrderModification[];
    amendments: OrderAmendment[];
    stateHistory: OrderStateTransition[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}
/**
 * DTO for quantity modification
 */
export declare class ModifyQuantityDto {
    lineItemId: string;
    newQuantity: number;
    reason?: string;
    requiresApproval?: boolean;
}
/**
 * DTO for price adjustment
 */
export declare class AdjustPriceDto {
    lineItemId: string;
    newPrice: number;
    reason: string;
    overrideApproval?: boolean;
}
/**
 * DTO for date change
 */
export declare class ChangeDateDto {
    newDeliveryDate: Date;
    reason?: string;
    notifyCustomer?: boolean;
}
/**
 * DTO for customer change
 */
export declare class ChangeCustomerDto {
    newCustomerId: string;
    transferReason: string;
    updateBillingAddress?: boolean;
    updateShippingAddress?: boolean;
}
/**
 * DTO for creating amendment
 */
export declare class CreateAmendmentDto {
    modifications: Partial<OrderModification>[];
    notes?: string;
    requiresCustomerApproval?: boolean;
    effectiveDate?: Date;
}
/**
 * DTO for cancellation request
 */
export declare class CancelOrderDto {
    reason: CancellationReason;
    description: string;
    lineItemIds?: string[];
    processRefund?: boolean;
    restockingFeePercent?: number;
    notifyCustomer?: boolean;
}
/**
 * DTO for placing order on hold
 */
export declare class PlaceHoldDto {
    reason: HoldReason;
    description: string;
    autoReleaseDuration?: number;
    notifyUsers?: string[];
}
/**
 * DTO for releasing hold
 */
export declare class ReleaseHoldDto {
    releaseNotes?: string;
    resumeProcessing?: boolean;
}
/**
 * DTO for state transition
 */
export declare class TransitionStateDto {
    targetStatus: OrderStatus;
    reason?: string;
    skipValidations?: boolean;
}
/**
 * DTO for approval decision
 */
export declare class ApprovalDecisionDto {
    decision: ChangeApprovalStatus;
    notes?: string;
    conditions?: string[];
}
/**
 * DTO for order clone
 */
export declare class CloneOrderDto {
    newCustomerId?: string;
    includeModifications?: boolean;
    resetToDraft?: boolean;
    tags?: string[];
}
/**
 * DTO for archival
 */
export declare class ArchiveOrderDto {
    reason?: string;
    createBackup?: boolean;
    retentionDays?: number;
}
/**
 * 1. Modifies line item quantity in an order.
 *
 * @param {Order} order - Order to modify
 * @param {ModifyQuantityDto} dto - Modification details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const modifiedOrder = await modifyLineItemQuantity(order, {
 *   lineItemId: 'line-123',
 *   newQuantity: 5,
 *   reason: 'Customer requested increase'
 * }, 'user-456');
 * ```
 */
export declare function modifyLineItemQuantity(order: Order, dto: ModifyQuantityDto, userId: string): Promise<Order>;
/**
 * 2. Adjusts price for a line item.
 *
 * @param {Order} order - Order to modify
 * @param {AdjustPriceDto} dto - Price adjustment details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const adjusted = await adjustLineItemPrice(order, {
 *   lineItemId: 'line-123',
 *   newPrice: 99.99,
 *   reason: 'Price match guarantee'
 * }, 'user-456');
 * ```
 */
export declare function adjustLineItemPrice(order: Order, dto: AdjustPriceDto, userId: string): Promise<Order>;
/**
 * 3. Changes the requested delivery date for an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeDateDto} dto - Date change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await changeDeliveryDate(order, {
 *   newDeliveryDate: new Date('2024-02-01'),
 *   reason: 'Customer unavailable on original date',
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
export declare function changeDeliveryDate(order: Order, dto: ChangeDateDto, userId: string): Promise<Order>;
/**
 * 4. Changes the customer associated with an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeCustomerDto} dto - Customer change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const transferred = await changeOrderCustomer(order, {
 *   newCustomerId: 'cust-789',
 *   transferReason: 'Order placed by assistant on behalf of customer',
 *   updateBillingAddress: true
 * }, 'user-456');
 * ```
 */
export declare function changeOrderCustomer(order: Order, dto: ChangeCustomerDto, userId: string): Promise<Order>;
/**
 * 5. Adds a new line item to an existing order.
 *
 * @param {Order} order - Order to modify
 * @param {Partial<OrderLineItem>} lineItem - Line item to add
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await addLineItemToOrder(order, {
 *   productId: 'prod-789',
 *   sku: 'SKU-789',
 *   name: 'Additional Product',
 *   quantity: 2,
 *   unitPrice: 49.99
 * }, 'user-456');
 * ```
 */
export declare function addLineItemToOrder(order: Order, lineItem: Partial<OrderLineItem>, userId: string): Promise<Order>;
/**
 * 6. Removes a line item from an order.
 *
 * @param {Order} order - Order to modify
 * @param {string} lineItemId - Line item ID to remove
 * @param {string} reason - Removal reason
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await removeLineItemFromOrder(
 *   order,
 *   'line-123',
 *   'Product discontinued',
 *   'user-456'
 * );
 * ```
 */
export declare function removeLineItemFromOrder(order: Order, lineItemId: string, reason: string, userId: string): Promise<Order>;
/**
 * 7. Updates order notes or special instructions.
 *
 * @param {Order} order - Order to modify
 * @param {string} notes - New notes
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await updateOrderNotes(
 *   order,
 *   'Please ring doorbell twice and leave at side door',
 *   'user-456'
 * );
 * ```
 */
export declare function updateOrderNotes(order: Order, notes: string, userId: string): Promise<Order>;
/**
 * 8. Creates a formal amendment to an order.
 *
 * @param {Order} order - Order to amend
 * @param {CreateAmendmentDto} dto - Amendment details
 * @param {string} userId - User creating amendment
 * @returns {Promise<OrderAmendment>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createOrderAmendment(order, {
 *   modifications: [mod1, mod2],
 *   notes: 'Customer requested changes to delivery',
 *   requiresCustomerApproval: true
 * }, 'user-456');
 * ```
 */
export declare function createOrderAmendment(order: Order, dto: CreateAmendmentDto, userId: string): Promise<OrderAmendment>;
/**
 * 9. Approves a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to approve
 * @param {ApprovalDecisionDto} dto - Approval details
 * @param {string} approverId - User approving
 * @returns {Promise<OrderAmendment>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveAmendment(amendment, {
 *   decision: ChangeApprovalStatus.APPROVED,
 *   notes: 'All changes look good'
 * }, 'approver-789');
 * ```
 */
export declare function approveAmendment(amendment: OrderAmendment, dto: ApprovalDecisionDto, approverId: string): Promise<OrderAmendment>;
/**
 * 10. Rejects a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to reject
 * @param {string} reason - Rejection reason
 * @param {string} approverId - User rejecting
 * @returns {Promise<OrderAmendment>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectAmendment(
 *   amendment,
 *   'Price change exceeds allowed threshold',
 *   'approver-789'
 * );
 * ```
 */
export declare function rejectAmendment(amendment: OrderAmendment, reason: string, approverId: string): Promise<OrderAmendment>;
/**
 * 11. Gets customer approval for an amendment.
 *
 * @param {OrderAmendment} amendment - Amendment requiring approval
 * @param {boolean} approved - Customer approval decision
 * @returns {Promise<OrderAmendment>} Updated amendment
 *
 * @example
 * ```typescript
 * const updated = await getCustomerApproval(amendment, true);
 * ```
 */
export declare function getCustomerApproval(amendment: OrderAmendment, approved: boolean): Promise<OrderAmendment>;
/**
 * 12. Applies an approved amendment to the order.
 *
 * @param {Order} order - Order to apply amendment to
 * @param {OrderAmendment} amendment - Approved amendment
 * @param {string} userId - User applying amendment
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const updated = await applyAmendmentToOrder(order, amendment, 'user-456');
 * ```
 */
export declare function applyAmendmentToOrder(order: Order, amendment: OrderAmendment, userId: string): Promise<Order>;
/**
 * 13. Calculates the financial impact of proposed changes.
 *
 * @param {OrderModification[]} modifications - Proposed modifications
 * @returns {object} Impact summary
 *
 * @example
 * ```typescript
 * const impact = calculateChangeImpact([mod1, mod2, mod3]);
 * console.log(`Price delta: $${impact.priceDelta}`);
 * ```
 */
export declare function calculateChangeImpact(modifications: OrderModification[]): {
    priceDelta: number;
    quantityDelta: number;
    taxDelta: number;
    affectedLineItems: string[];
};
/**
 * 14. Generates change notification for customer.
 *
 * @param {Order} order - Modified order
 * @param {OrderAmendment} amendment - Amendment details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = generateChangeNotification(order, amendment);
 * await emailService.send(notification);
 * ```
 */
export declare function generateChangeNotification(order: Order, amendment: OrderAmendment): {
    to: string;
    subject: string;
    body: string;
    priority: string;
};
/**
 * 15. Cancels an entire order.
 *
 * @param {Order} order - Order to cancel
 * @param {CancelOrderDto} dto - Cancellation details
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await cancelOrder(order, {
 *   reason: CancellationReason.CUSTOMER_REQUEST,
 *   description: 'Customer no longer needs items',
 *   processRefund: true,
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
export declare function cancelOrder(order: Order, dto: CancelOrderDto, userId: string): Promise<OrderCancellation>;
/**
 * 16. Partially cancels specific line items.
 *
 * @param {Order} order - Order to partially cancel
 * @param {CancelOrderDto} dto - Cancellation details with line items
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await partialCancelOrder(order, {
 *   reason: CancellationReason.OUT_OF_STOCK,
 *   description: 'Items no longer available',
 *   lineItemIds: ['line-123', 'line-456'],
 *   processRefund: true
 * }, 'user-456');
 * ```
 */
export declare function partialCancelOrder(order: Order, dto: CancelOrderDto, userId: string): Promise<OrderCancellation>;
/**
 * 17. Processes refund for cancelled order.
 *
 * @param {OrderCancellation} cancellation - Cancellation to process refund for
 * @param {string} refundMethod - Payment method for refund
 * @returns {Promise<object>} Refund details
 *
 * @example
 * ```typescript
 * const refund = await processRefund(cancellation, 'original_payment_method');
 * ```
 */
export declare function processRefund(cancellation: OrderCancellation, refundMethod: string): Promise<{
    refundId: string;
    amount: number;
    method: string;
    processedAt: Date;
    status: string;
}>;
/**
 * 18. Calculates cancellation restocking fee.
 *
 * @param {number} orderTotal - Original order total
 * @param {number} feePercentage - Fee percentage (0-1)
 * @param {OrderStatus} currentStatus - Current order status
 * @returns {object} Fee breakdown
 *
 * @example
 * ```typescript
 * const fee = calculateRestockingFee(500.00, 0.15, OrderStatus.PROCESSING);
 * // Returns: { originalAmount: 500, fee: 75, refundAmount: 425 }
 * ```
 */
export declare function calculateRestockingFee(orderTotal: number, feePercentage: number, currentStatus: OrderStatus): {
    originalAmount: number;
    fee: number;
    refundAmount: number;
    feeWaived: boolean;
    waiverReason?: string;
};
/**
 * 19. Validates if an order can be cancelled.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCancellationEligibility(order);
 * if (!result.canCancel) {
 *   console.error(result.reason);
 * }
 * ```
 */
export declare function validateCancellationEligibility(order: Order): {
    canCancel: boolean;
    reason?: string;
    requiresApproval: boolean;
    estimatedRefund: number;
};
/**
 * 20. Sends cancellation notification to customer.
 *
 * @param {Order} order - Cancelled order
 * @param {OrderCancellation} cancellation - Cancellation details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendCancellationNotification(order, cancellation);
 * ```
 */
export declare function sendCancellationNotification(order: Order, cancellation: OrderCancellation): {
    to: string;
    subject: string;
    body: string;
    includeRefundInfo: boolean;
};
/**
 * 21. Restocks inventory for cancelled items.
 *
 * @param {Order} order - Cancelled order
 * @param {string[]} lineItemIds - Line items to restock
 * @returns {Promise<object>} Restock summary
 *
 * @example
 * ```typescript
 * const restocked = await restockCancelledItems(order, ['line-123', 'line-456']);
 * ```
 */
export declare function restockCancelledItems(order: Order, lineItemIds?: string[]): Promise<{
    restockedItems: Array<{
        productId: string;
        quantity: number;
    }>;
    totalItemsRestocked: number;
    restockedAt: Date;
}>;
/**
 * 22. Places an order on hold.
 *
 * @param {Order} order - Order to hold
 * @param {PlaceHoldDto} dto - Hold details
 * @param {string} userId - User placing hold
 * @returns {Promise<OrderHold>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeOrderOnHold(order, {
 *   reason: HoldReason.PAYMENT_VERIFICATION,
 *   description: 'Verifying payment method',
 *   autoReleaseDuration: 120
 * }, 'user-456');
 * ```
 */
export declare function placeOrderOnHold(order: Order, dto: PlaceHoldDto, userId: string): Promise<OrderHold>;
/**
 * 23. Releases an order from hold.
 *
 * @param {Order} order - Order to release
 * @param {ReleaseHoldDto} dto - Release details
 * @param {string} userId - User releasing hold
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const released = await releaseOrderHold(order, {
 *   releaseNotes: 'Payment verified successfully',
 *   resumeProcessing: true
 * }, 'user-456');
 * ```
 */
export declare function releaseOrderHold(order: Order, dto: ReleaseHoldDto, userId: string): Promise<Order>;
/**
 * 24. Auto-releases expired holds.
 *
 * @param {Order[]} orders - Orders to check for expired holds
 * @returns {Promise<Order[]>} Auto-released orders
 *
 * @example
 * ```typescript
 * const released = await autoReleaseExpiredHolds(ordersOnHold);
 * ```
 */
export declare function autoReleaseExpiredHolds(orders: Order[]): Promise<Order[]>;
/**
 * 25. Extends hold duration.
 *
 * @param {OrderHold} hold - Hold to extend
 * @param {number} additionalMinutes - Minutes to add
 * @param {string} reason - Extension reason
 * @returns {Promise<OrderHold>} Updated hold
 *
 * @example
 * ```typescript
 * const extended = await extendHoldDuration(hold, 60, 'Awaiting additional documentation');
 * ```
 */
export declare function extendHoldDuration(hold: OrderHold, additionalMinutes: number, reason: string): Promise<OrderHold>;
/**
 * 26. Gets all orders currently on hold.
 *
 * @param {Order[]} orders - All orders
 * @param {HoldReason} filterByReason - Optional reason filter
 * @returns {Order[]} Orders on hold
 *
 * @example
 * ```typescript
 * const onHold = getOrdersOnHold(allOrders, HoldReason.PAYMENT_VERIFICATION);
 * ```
 */
export declare function getOrdersOnHold(orders: Order[], filterByReason?: HoldReason): Order[];
/**
 * 27. Sends hold notification to stakeholders.
 *
 * @param {Order} order - Order on hold
 * @param {OrderHold} hold - Hold details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendHoldNotification(order, hold);
 * ```
 */
export declare function sendHoldNotification(order: Order, hold: OrderHold): {
    recipients: string[];
    subject: string;
    body: string;
    priority: string;
};
/**
 * 28. Validates if order can be placed on hold.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHoldEligibility(order);
 * ```
 */
export declare function validateHoldEligibility(order: Order): {
    canHold: boolean;
    reason?: string;
};
/**
 * 29. Transitions order to a new status.
 *
 * @param {Order} order - Order to transition
 * @param {TransitionStateDto} dto - Transition details
 * @param {string} userId - User triggering transition
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const transitioned = await transitionOrderStatus(order, {
 *   targetStatus: OrderStatus.PROCESSING,
 *   reason: 'Payment confirmed'
 * }, 'user-456');
 * ```
 */
export declare function transitionOrderStatus(order: Order, dto: TransitionStateDto, userId: string): Promise<Order>;
/**
 * 30. Validates if a state transition is allowed.
 *
 * @param {OrderStatus} fromStatus - Current status
 * @param {OrderStatus} toStatus - Target status
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateStateTransition(
 *   OrderStatus.PENDING,
 *   OrderStatus.PROCESSING
 * );
 * ```
 */
export declare function validateStateTransition(fromStatus: OrderStatus, toStatus: OrderStatus): {
    valid: boolean;
    reason?: string;
};
/**
 * 31. Gets order lifecycle timeline.
 *
 * @param {Order} order - Order to get timeline for
 * @returns {object[]} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = getOrderLifecycleTimeline(order);
 * ```
 */
export declare function getOrderLifecycleTimeline(order: Order): Array<{
    timestamp: Date;
    event: string;
    status?: OrderStatus;
    actor: string;
    description: string;
}>;
/**
 * 32. Checks if order can be rolled back to previous state.
 *
 * @param {Order} order - Order to check
 * @returns {object} Rollback information
 *
 * @example
 * ```typescript
 * const rollback = canRollbackOrder(order);
 * if (rollback.canRollback) {
 *   console.log(`Can rollback to: ${rollback.targetStatus}`);
 * }
 * ```
 */
export declare function canRollbackOrder(order: Order): {
    canRollback: boolean;
    targetStatus?: OrderStatus;
    lastTransition?: OrderStateTransition;
    reason?: string;
};
/**
 * 33. Performs rollback to previous order state.
 *
 * @param {Order} order - Order to rollback
 * @param {string} reason - Rollback reason
 * @param {string} userId - User performing rollback
 * @returns {Promise<Order>} Rolled back order
 *
 * @example
 * ```typescript
 * const rolledBack = await rollbackOrderState(
 *   order,
 *   'Incorrect status change',
 *   'user-456'
 * );
 * ```
 */
export declare function rollbackOrderState(order: Order, reason: string, userId: string): Promise<Order>;
/**
 * 34. Gets current lifecycle stage details.
 *
 * @param {Order} order - Order to analyze
 * @returns {object} Lifecycle stage information
 *
 * @example
 * ```typescript
 * const stage = getCurrentLifecycleStage(order);
 * console.log(`Current stage: ${stage.stageName}`);
 * ```
 */
export declare function getCurrentLifecycleStage(order: Order): {
    stageName: string;
    stageNumber: number;
    totalStages: number;
    progressPercentage: number;
    nextStage?: string;
    estimatedCompletionDate?: Date;
};
/**
 * 35. Generates state machine diagram for order.
 *
 * @param {Order} order - Order to generate diagram for
 * @returns {string} Mermaid diagram syntax
 *
 * @example
 * ```typescript
 * const diagram = generateStateMachineDiagram(order);
 * console.log(diagram);
 * ```
 */
export declare function generateStateMachineDiagram(order: Order): string;
/**
 * 36. Creates audit entry for order action.
 *
 * @param {Order} order - Order being audited
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {any} changes - Changes made
 * @returns {Promise<OrderAuditEntry>} Audit entry
 *
 * @example
 * ```typescript
 * const audit = await createOrderAuditEntry(
 *   order,
 *   'UPDATE_QUANTITY',
 *   'user-456',
 *   { field: 'quantity', oldValue: 1, newValue: 2 }
 * );
 * ```
 */
export declare function createOrderAuditEntry(order: Order, action: string, userId: string, changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
}>): Promise<OrderAuditEntry>;
/**
 * 37. Gets complete audit trail for an order.
 *
 * @param {Order} order - Order to get audit trail for
 * @param {Date} fromDate - Optional start date
 * @param {Date} toDate - Optional end date
 * @returns {Promise<OrderAuditEntry[]>} Audit entries
 *
 * @example
 * ```typescript
 * const trail = await getOrderAuditTrail(order, startDate, endDate);
 * ```
 */
export declare function getOrderAuditTrail(order: Order, fromDate?: Date, toDate?: Date): Promise<OrderAuditEntry[]>;
/**
 * 38. Creates version snapshot of order.
 *
 * @param {Order} order - Order to snapshot
 * @param {string} changesSummary - Summary of changes
 * @param {string} userId - User creating version
 * @returns {Promise<OrderVersion>} Version record
 *
 * @example
 * ```typescript
 * const version = await createOrderVersion(
 *   order,
 *   'Updated quantities and delivery date',
 *   'user-456'
 * );
 * ```
 */
export declare function createOrderVersion(order: Order, changesSummary: string, userId: string): Promise<OrderVersion>;
/**
 * 39. Restores order from a specific version.
 *
 * @param {OrderVersion} version - Version to restore from
 * @param {string} userId - User performing restoration
 * @returns {Promise<Order>} Restored order
 *
 * @example
 * ```typescript
 * const restored = await restoreOrderVersion(version, 'user-456');
 * ```
 */
export declare function restoreOrderVersion(version: OrderVersion, userId: string): Promise<Order>;
/**
 * 40. Clones an existing order.
 *
 * @param {Order} order - Order to clone
 * @param {CloneOrderDto} dto - Clone options
 * @param {string} userId - User cloning order
 * @returns {Promise<Order>} Cloned order
 *
 * @example
 * ```typescript
 * const clone = await cloneOrder(originalOrder, {
 *   resetToDraft: true,
 *   includeModifications: false
 * }, 'user-456');
 * ```
 */
export declare function cloneOrder(order: Order, dto: CloneOrderDto, userId: string): Promise<Order>;
/**
 * 41. Archives an order.
 *
 * @param {Order} order - Order to archive
 * @param {ArchiveOrderDto} dto - Archive options
 * @param {string} userId - User archiving
 * @returns {Promise<Order>} Archived order
 *
 * @example
 * ```typescript
 * const archived = await archiveOrder(order, {
 *   reason: 'Order completed over 90 days ago',
 *   createBackup: true,
 *   retentionDays: 2555
 * }, 'user-456');
 * ```
 */
export declare function archiveOrder(order: Order, dto: ArchiveOrderDto, userId: string): Promise<Order>;
/**
 * 42. Generates comprehensive order modification report.
 *
 * @param {Order} order - Order to generate report for
 * @returns {object} Modification report
 *
 * @example
 * ```typescript
 * const report = generateModificationReport(order);
 * console.log(`Total modifications: ${report.totalModifications}`);
 * ```
 */
export declare function generateModificationReport(order: Order): {
    orderId: string;
    orderNumber: string;
    totalModifications: number;
    modificationsByType: Record<OrderModificationType, number>;
    totalAmendments: number;
    pendingApprovals: number;
    priceImpact: number;
    lastModifiedAt: Date;
    lastModifiedBy: string;
    modificationTimeline: Array<{
        date: Date;
        type: OrderModificationType;
        description: string;
    }>;
};
declare const _default: {
    modifyLineItemQuantity: typeof modifyLineItemQuantity;
    adjustLineItemPrice: typeof adjustLineItemPrice;
    changeDeliveryDate: typeof changeDeliveryDate;
    changeOrderCustomer: typeof changeOrderCustomer;
    addLineItemToOrder: typeof addLineItemToOrder;
    removeLineItemFromOrder: typeof removeLineItemFromOrder;
    updateOrderNotes: typeof updateOrderNotes;
    createOrderAmendment: typeof createOrderAmendment;
    approveAmendment: typeof approveAmendment;
    rejectAmendment: typeof rejectAmendment;
    getCustomerApproval: typeof getCustomerApproval;
    applyAmendmentToOrder: typeof applyAmendmentToOrder;
    calculateChangeImpact: typeof calculateChangeImpact;
    generateChangeNotification: typeof generateChangeNotification;
    cancelOrder: typeof cancelOrder;
    partialCancelOrder: typeof partialCancelOrder;
    processRefund: typeof processRefund;
    calculateRestockingFee: typeof calculateRestockingFee;
    validateCancellationEligibility: typeof validateCancellationEligibility;
    sendCancellationNotification: typeof sendCancellationNotification;
    restockCancelledItems: typeof restockCancelledItems;
    placeOrderOnHold: typeof placeOrderOnHold;
    releaseOrderHold: typeof releaseOrderHold;
    autoReleaseExpiredHolds: typeof autoReleaseExpiredHolds;
    extendHoldDuration: typeof extendHoldDuration;
    getOrdersOnHold: typeof getOrdersOnHold;
    sendHoldNotification: typeof sendHoldNotification;
    validateHoldEligibility: typeof validateHoldEligibility;
    transitionOrderStatus: typeof transitionOrderStatus;
    validateStateTransition: typeof validateStateTransition;
    getOrderLifecycleTimeline: typeof getOrderLifecycleTimeline;
    canRollbackOrder: typeof canRollbackOrder;
    rollbackOrderState: typeof rollbackOrderState;
    getCurrentLifecycleStage: typeof getCurrentLifecycleStage;
    generateStateMachineDiagram: typeof generateStateMachineDiagram;
    createOrderAuditEntry: typeof createOrderAuditEntry;
    getOrderAuditTrail: typeof getOrderAuditTrail;
    createOrderVersion: typeof createOrderVersion;
    restoreOrderVersion: typeof restoreOrderVersion;
    cloneOrder: typeof cloneOrder;
    archiveOrder: typeof archiveOrder;
    generateModificationReport: typeof generateModificationReport;
};
export default _default;
//# sourceMappingURL=order-modification-lifecycle-kit.d.ts.map