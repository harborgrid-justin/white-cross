/**
 * LOC: ORD-RETREF-001
 * File: /reuse/order/order-returns-refunds-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Return controllers
 *   - Refund services
 *   - RMA processors
 *   - Warehouse systems
 */
import { Model } from 'sequelize-typescript';
/**
 * Return authorization status workflow
 */
export declare enum ReturnAuthStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
/**
 * Return request status tracking
 */
export declare enum ReturnStatus {
    REQUESTED = "REQUESTED",
    AUTHORIZED = "AUTHORIZED",
    LABEL_GENERATED = "LABEL_GENERATED",
    IN_TRANSIT = "IN_TRANSIT",
    RECEIVED = "RECEIVED",
    INSPECTING = "INSPECTING",
    INSPECTION_PASSED = "INSPECTION_PASSED",
    INSPECTION_FAILED = "INSPECTION_FAILED",
    RESTOCKING = "RESTOCKING",
    RESTOCKED = "RESTOCKED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
/**
 * Return reason codes for classification
 */
export declare enum ReturnReasonCode {
    DEFECTIVE = "DEFECTIVE",
    DAMAGED_IN_SHIPPING = "DAMAGED_IN_SHIPPING",
    WRONG_ITEM = "WRONG_ITEM",
    NOT_AS_DESCRIBED = "NOT_AS_DESCRIBED",
    CUSTOMER_REMORSE = "CUSTOMER_REMORSE",
    CHANGED_MIND = "CHANGED_MIND",
    FOUND_BETTER_PRICE = "FOUND_BETTER_PRICE",
    NO_LONGER_NEEDED = "NO_LONGER_NEEDED",
    ORDERED_BY_MISTAKE = "ORDERED_BY_MISTAKE",
    ARRIVED_TOO_LATE = "ARRIVED_TOO_LATE",
    SIZE_FIT_ISSUE = "SIZE_FIT_ISSUE",
    WARRANTY_CLAIM = "WARRANTY_CLAIM",
    RECALL = "RECALL",
    OTHER = "OTHER"
}
/**
 * Refund method types
 */
export declare enum RefundMethod {
    ORIGINAL_PAYMENT = "ORIGINAL_PAYMENT",
    STORE_CREDIT = "STORE_CREDIT",
    GIFT_CARD = "GIFT_CARD",
    EXCHANGE = "EXCHANGE",
    MANUAL_CHECK = "MANUAL_CHECK",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH = "CASH"
}
/**
 * Refund status workflow
 */
export declare enum RefundStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
/**
 * Return item condition after inspection
 */
export declare enum ItemCondition {
    NEW_UNOPENED = "NEW_UNOPENED",
    NEW_OPENED = "NEW_OPENED",
    LIKE_NEW = "LIKE_NEW",
    GOOD = "GOOD",
    ACCEPTABLE = "ACCEPTABLE",
    DAMAGED = "DAMAGED",
    DEFECTIVE = "DEFECTIVE",
    NOT_RESALEABLE = "NOT_RESALEABLE"
}
/**
 * Restocking disposition
 */
export declare enum RestockingDisposition {
    RETURN_TO_STOCK = "RETURN_TO_STOCK",
    RETURN_TO_VENDOR = "RETURN_TO_VENDOR",
    REFURBISH = "REFURBISH",
    SALVAGE = "SALVAGE",
    SCRAP = "SCRAP",
    QUARANTINE = "QUARANTINE"
}
/**
 * RMA type classifications
 */
export declare enum RMAType {
    STANDARD_RETURN = "STANDARD_RETURN",
    WARRANTY_RETURN = "WARRANTY_RETURN",
    ADVANCED_REPLACEMENT = "ADVANCED_REPLACEMENT",
    CROSS_SHIP = "CROSS_SHIP",
    DOA = "DOA",
    RECALL = "RECALL"
}
export interface ReturnLineItem {
    orderLineId: string;
    itemId: string;
    itemSku: string;
    itemDescription: string;
    quantityOrdered: number;
    quantityReturned: number;
    unitPrice: number;
    returnReasonCode: ReturnReasonCode;
    reasonDescription?: string;
    serialNumbers?: string[];
    lotNumbers?: string[];
    images?: string[];
}
export interface RefundCalculation {
    subtotal: number;
    taxRefund: number;
    shippingRefund: number;
    restockingFee: number;
    adjustments: number;
    totalRefund: number;
    originalPaymentAmount: number;
    breakdownByPaymentMethod: Array<{
        paymentMethod: string;
        paymentId: string;
        refundAmount: number;
    }>;
}
export interface InspectionResult {
    inspectedBy: string;
    inspectionDate: Date;
    itemsPassed: number;
    itemsFailed: number;
    overallStatus: 'PASSED' | 'FAILED' | 'PARTIAL';
    lineInspections: Array<{
        returnLineId: string;
        quantityInspected: number;
        quantityPassed: number;
        quantityFailed: number;
        condition: ItemCondition;
        defects: string[];
        notes: string;
        disposition: RestockingDisposition;
    }>;
    photos: string[];
    notes: string;
}
export interface RestockingOperation {
    warehouseId: string;
    locationId: string;
    itemId: string;
    quantity: number;
    condition: ItemCondition;
    disposition: RestockingDisposition;
    restockedBy: string;
    restockedAt: Date;
    serialNumbers?: string[];
    lotNumbers?: string[];
}
export interface WarrantyValidation {
    isValid: boolean;
    warrantyId?: string;
    warrantyType: 'MANUFACTURER' | 'EXTENDED' | 'STORE' | 'NONE';
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    daysRemaining?: number;
    coverageDetails?: Record<string, any>;
    validationErrors?: string[];
}
export interface AdvancedReplacementRequest {
    originalOrderId: string;
    defectiveItemId: string;
    defectiveSerialNumber?: string;
    replacementItemId: string;
    shippingAddress: any;
    shippingMethod: string;
    creditCardHold?: {
        amount: number;
        authorizationId: string;
        expiresAt: Date;
    };
    requireReturnTracking: boolean;
    returnDeadlineDays: number;
}
/**
 * Return request creation DTO
 */
export declare class CreateReturnRequestDto {
    orderId: string;
    rmaType: RMAType;
    lineItems: ReturnLineItem[];
    customerComments?: string;
    preferredRefundMethod?: RefundMethod;
    exchangeItemIds?: string[];
}
/**
 * Return authorization DTO
 */
export declare class AuthorizeReturnDto {
    authorizationStatus: ReturnAuthStatus;
    authorizedBy: string;
    authorizationNotes?: string;
    expirationDays?: number;
    restockingFeePercent?: number;
}
/**
 * Return inspection DTO
 */
export declare class RecordInspectionDto {
    inspectedBy: string;
    lineInspections: Array<{
        returnLineId: string;
        quantityPassed: number;
        quantityFailed: number;
        condition: ItemCondition;
        disposition: RestockingDisposition;
        defects?: string[];
        notes?: string;
    }>;
    inspectionNotes?: string;
    photos?: string[];
}
/**
 * Refund processing DTO
 */
export declare class ProcessRefundDto {
    refundMethod: RefundMethod;
    refundAmountOverride?: number;
    refundNotes?: string;
    storeCreditAccountId?: string;
    processedBy: string;
}
/**
 * Return request header model
 */
export declare class ReturnRequest extends Model {
    returnId: string;
    rmaNumber: string;
    orderId: string;
    customerId: string;
    rmaType: RMAType;
    returnStatus: ReturnStatus;
    authorizationStatus: ReturnAuthStatus;
    requestDate: Date;
    authorizationDate: Date;
    expirationDate: Date;
    authorizedBy: string;
    authorizationNotes: string;
    customerComments: string;
    returnShippingAddress: Record<string, any>;
    shippingLabelUrl: string;
    trackingNumber: string;
    carrier: string;
    receivedDate: Date;
    receivedBy: string;
    inspectionResult: InspectionResult;
    restockingFeePercent: number;
    restockingFeeAmount: number;
    refundCalculation: RefundCalculation;
    preferredRefundMethod: RefundMethod;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    lines: ReturnLine[];
    refunds: Refund[];
}
/**
 * Return line model
 */
export declare class ReturnLine extends Model {
    returnLineId: string;
    returnId: string;
    orderLineId: string;
    itemId: string;
    itemSku: string;
    itemDescription: string;
    quantityOrdered: number;
    quantityReturned: number;
    quantityReceived: number;
    quantityPassed: number;
    quantityFailed: number;
    unitPrice: number;
    returnReasonCode: ReturnReasonCode;
    reasonDescription: string;
    itemCondition: ItemCondition;
    restockingDisposition: RestockingDisposition;
    serialNumbers: string[];
    lotNumbers: string[];
    defects: string[];
    inspectionNotes: string;
    images: string[];
    returnRequest: ReturnRequest;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Refund transaction model
 */
export declare class Refund extends Model {
    refundId: string;
    refundNumber: string;
    returnId: string;
    orderId: string;
    refundStatus: RefundStatus;
    refundMethod: RefundMethod;
    refundAmount: number;
    taxRefund: number;
    shippingRefund: number;
    restockingFee: number;
    adjustments: number;
    totalRefund: number;
    originalPaymentMethodId: string;
    storeCreditAccountId: string;
    gatewayTransactionId: string;
    refundNotes: string;
    processedDate: Date;
    processedBy: string;
    approvedBy: string;
    createdBy: string;
    returnRequest: ReturnRequest;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Generate unique RMA number with prefix and sequence
 *
 * @param prefix - RMA number prefix (e.g., 'RMA', 'RTN')
 * @param sequence - Sequence number
 * @param length - Total length of numeric portion
 * @returns Formatted RMA number
 *
 * @example
 * generateRMANumber('RMA', 12345, 8) // Returns: 'RMA00012345'
 */
export declare function generateRMANumber(prefix: string | undefined, sequence: number, length?: number): string;
/**
 * Create return request from customer
 *
 * @param returnData - Return request data
 * @param userId - User ID creating the request
 * @returns Created return request
 *
 * @example
 * const returnRequest = await createReturnRequest(returnDto, 'user-123');
 */
export declare function createReturnRequest(returnData: CreateReturnRequestDto, userId: string): Promise<ReturnRequest>;
/**
 * Authorize return request (approve or reject)
 *
 * @param returnId - Return request ID
 * @param authData - Authorization data
 * @returns Updated return request
 *
 * @example
 * const authorized = await authorizeReturnRequest('ret-123', authDto);
 */
export declare function authorizeReturnRequest(returnId: string, authData: AuthorizeReturnDto): Promise<ReturnRequest>;
/**
 * Validate return eligibility based on return window and order status
 *
 * @param orderId - Order ID
 * @param returnWindowDays - Return window in days
 * @returns Eligibility result
 *
 * @example
 * const eligible = await validateReturnEligibility('ord-123', 30);
 */
export declare function validateReturnEligibility(orderId: string, returnWindowDays?: number): Promise<{
    isEligible: boolean;
    reasons: string[];
}>;
/**
 * Check return reason code validity and auto-approve rules
 *
 * @param reasonCode - Return reason code
 * @param orderAge - Order age in days
 * @returns Validation result with auto-approval flag
 *
 * @example
 * const result = await validateReturnReason(ReturnReasonCode.DEFECTIVE, 5);
 */
export declare function validateReturnReason(reasonCode: ReturnReasonCode, orderAge: number): {
    isValid: boolean;
    requiresApproval: boolean;
    autoApprove: boolean;
    notes: string;
};
/**
 * Calculate restocking fee based on return reason and condition
 *
 * @param returnReasonCode - Return reason
 * @param itemCondition - Item condition
 * @param subtotal - Order subtotal
 * @param feePercent - Restocking fee percentage override
 * @returns Restocking fee amount
 *
 * @example
 * const fee = calculateRestockingFee(ReturnReasonCode.CHANGED_MIND, ItemCondition.NEW_OPENED, 100);
 */
export declare function calculateRestockingFee(returnReasonCode: ReturnReasonCode, itemCondition: ItemCondition, subtotal: number, feePercent?: number): number;
/**
 * Generate return shipping label for authorized return
 *
 * @param returnId - Return request ID
 * @param carrier - Shipping carrier
 * @param serviceLevel - Service level
 * @returns Shipping label details
 *
 * @example
 * const label = await generateReturnShippingLabel('ret-123', 'UPS', 'GROUND');
 */
export declare function generateReturnShippingLabel(returnId: string, carrier?: string, serviceLevel?: string): Promise<{
    labelUrl: string;
    trackingNumber: string;
    carrier: string;
}>;
/**
 * Update return tracking status from carrier webhook
 *
 * @param trackingNumber - Tracking number
 * @param status - Tracking status
 * @param location - Current location
 * @returns Updated return request
 *
 * @example
 * await updateReturnTracking('1Z999AA10123456784', 'IN_TRANSIT', 'Memphis, TN');
 */
export declare function updateReturnTracking(trackingNumber: string, status: string, location?: string): Promise<ReturnRequest>;
/**
 * Record return receipt at warehouse
 *
 * @param returnId - Return request ID
 * @param receivedBy - User ID receiving the return
 * @param notes - Receipt notes
 * @returns Updated return request
 *
 * @example
 * await recordReturnReceipt('ret-123', 'user-456', 'All items received');
 */
export declare function recordReturnReceipt(returnId: string, receivedBy: string, notes?: string): Promise<ReturnRequest>;
/**
 * Perform return inspection and quality check
 *
 * @param returnId - Return request ID
 * @param inspectionData - Inspection data
 * @returns Inspection result
 *
 * @example
 * const result = await performReturnInspection('ret-123', inspectionDto);
 */
export declare function performReturnInspection(returnId: string, inspectionData: RecordInspectionDto): Promise<InspectionResult>;
/**
 * Validate item condition and determine disposition
 *
 * @param condition - Item condition
 * @param returnReason - Return reason code
 * @returns Recommended disposition
 *
 * @example
 * const disposition = determineRestockingDisposition(ItemCondition.LIKE_NEW, ReturnReasonCode.CHANGED_MIND);
 */
export declare function determineRestockingDisposition(condition: ItemCondition, returnReason: ReturnReasonCode): RestockingDisposition;
/**
 * Quality check with photo verification
 *
 * @param returnLineId - Return line ID
 * @param photos - Array of photo URLs
 * @param defects - List of defects found
 * @returns Quality check result
 *
 * @example
 * const qc = await performQualityCheck('line-123', ['url1', 'url2'], ['scratch on screen']);
 */
export declare function performQualityCheck(returnLineId: string, photos: string[], defects: string[]): Promise<{
    passed: boolean;
    condition: ItemCondition;
    notes: string;
}>;
/**
 * Process restocking for approved returns
 *
 * @param returnId - Return request ID
 * @param warehouseId - Warehouse ID
 * @param userId - User performing restocking
 * @returns Restocking operations
 *
 * @example
 * const operations = await processRestocking('ret-123', 'wh-001', 'user-789');
 */
export declare function processRestocking(returnId: string, warehouseId: string, userId: string): Promise<RestockingOperation[]>;
/**
 * Create return-to-vendor (RTV) request for defective items
 *
 * @param returnId - Return request ID
 * @param vendorId - Vendor ID
 * @param userId - User creating RTV
 * @returns RTV request
 *
 * @example
 * const rtv = await createReturnToVendor('ret-123', 'vendor-456', 'user-789');
 */
export declare function createReturnToVendor(returnId: string, vendorId: string, userId: string): Promise<any>;
/**
 * Track serial numbers through return process
 *
 * @param returnLineId - Return line ID
 * @param serialNumbers - Array of serial numbers
 * @returns Serial tracking result
 *
 * @example
 * await trackReturnSerialNumbers('line-123', ['SN001', 'SN002']);
 */
export declare function trackReturnSerialNumbers(returnLineId: string, serialNumbers: string[]): Promise<{
    tracked: number;
    duplicates: string[];
    invalid: string[];
}>;
/**
 * Calculate refund amounts with fees and taxes
 *
 * @param returnId - Return request ID
 * @param includeShipping - Include shipping refund
 * @returns Refund calculation
 *
 * @example
 * const calculation = await calculateRefundAmount('ret-123', true);
 */
export declare function calculateRefundAmount(returnId: string, includeShipping?: boolean): Promise<RefundCalculation>;
/**
 * Process refund to original payment method
 *
 * @param returnId - Return request ID
 * @param refundData - Refund processing data
 * @returns Created refund
 *
 * @example
 * const refund = await processRefund('ret-123', refundDto);
 */
export declare function processRefund(returnId: string, refundData: ProcessRefundDto): Promise<Refund>;
/**
 * Process partial refund for partial returns
 *
 * @param returnId - Return request ID
 * @param lineRefunds - Line-specific refund amounts
 * @param userId - User processing refund
 * @returns Partial refund
 *
 * @example
 * const refund = await processPartialRefund('ret-123', [{lineId: 'ln-1', amount: 50}], 'user-789');
 */
export declare function processPartialRefund(returnId: string, lineRefunds: Array<{
    returnLineId: string;
    refundAmount: number;
}>, userId: string): Promise<Refund>;
/**
 * Validate warranty coverage for return
 *
 * @param orderId - Order ID
 * @param itemId - Item ID
 * @param serialNumber - Serial number
 * @returns Warranty validation result
 *
 * @example
 * const warranty = await validateWarrantyCoverage('ord-123', 'item-456', 'SN001');
 */
export declare function validateWarrantyCoverage(orderId: string, itemId: string, serialNumber?: string): Promise<WarrantyValidation>;
/**
 * Create advanced replacement order
 *
 * @param request - Advanced replacement request
 * @param userId - User creating replacement
 * @returns Replacement order and return
 *
 * @example
 * const replacement = await createAdvancedReplacement(requestDto, 'user-123');
 */
export declare function createAdvancedReplacement(request: AdvancedReplacementRequest, userId: string): Promise<{
    replacementOrderId: string;
    returnId: string;
    holdAmount?: number;
}>;
//# sourceMappingURL=order-returns-refunds-kit.d.ts.map