/**
 * LOC: POS-TXN-001
 * File: /reuse/retail/pos-transaction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - POS controllers
 *   - Transaction services
 *   - Payment processors
 *   - Receipt generators
 */
/**
 * Transaction status enumeration
 */
export declare enum TransactionStatus {
    PENDING = "PENDING",
    AUTHORIZED = "AUTHORIZED",
    CAPTURED = "CAPTURED",
    COMPLETED = "COMPLETED",
    VOIDED = "VOIDED",
    REFUNDED = "REFUNDED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
/**
 * Payment method types
 */
export declare enum PaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    MOBILE_PAYMENT = "MOBILE_PAYMENT",
    GIFT_CARD = "GIFT_CARD",
    STORE_CREDIT = "STORE_CREDIT",
    CHECK = "CHECK",
    EBT = "EBT"
}
/**
 * Transaction type enumeration
 */
export declare enum TransactionType {
    SALE = "SALE",
    RETURN = "RETURN",
    EXCHANGE = "EXCHANGE",
    VOID = "VOID",
    REFUND = "REFUND",
    NO_SALE = "NO_SALE",
    PAYOUT = "PAYOUT"
}
/**
 * Line item in a transaction
 */
export interface TransactionLineItem {
    lineItemId: string;
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    taxRate: number;
    discounts: AppliedDiscount[];
    modifiers?: ProductModifier[];
    metadata?: Record<string, any>;
}
/**
 * Applied discount information
 */
export interface AppliedDiscount {
    discountId: string;
    code?: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BOGO' | 'TIERED';
    amount: number;
    description: string;
}
/**
 * Product modifier (e.g., size, color, customization)
 */
export interface ProductModifier {
    modifierId: string;
    name: string;
    value: string;
    priceAdjustment: number;
}
/**
 * Payment tender information
 */
export interface PaymentTender {
    tenderId: string;
    method: PaymentMethod;
    amount: number;
    reference?: string;
    cardLast4?: string;
    cardBrand?: string;
    authorizationCode?: string;
    processorResponse?: Record<string, any>;
    timestamp: Date;
}
/**
 * Complete POS transaction
 */
export interface POSTransaction {
    transactionId: string;
    transactionNumber: string;
    storeId: string;
    registerId: string;
    cashierId: string;
    customerId?: string;
    type: TransactionType;
    status: TransactionStatus;
    lineItems: TransactionLineItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    total: number;
    tenders: PaymentTender[];
    changeAmount?: number;
    createdAt: Date;
    completedAt?: Date;
    voidedAt?: Date;
    voidReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Transaction builder configuration
 */
export interface TransactionBuilderConfig {
    storeId: string;
    registerId: string;
    cashierId: string;
    customerId?: string;
    taxRate?: number;
    autoCalculateTax?: boolean;
}
/**
 * Tax calculation configuration
 */
export interface TaxConfig {
    defaultRate: number;
    categoryRates?: Record<string, number>;
    jurisdictionRates?: Record<string, number>;
    taxExemptCategories?: string[];
}
/**
 * Receipt configuration
 */
export interface ReceiptConfig {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    taxId?: string;
    footerMessage?: string;
    includeBarcode?: boolean;
}
/**
 * Transaction search criteria
 */
export interface TransactionSearchCriteria {
    storeId?: string;
    registerId?: string;
    cashierId?: string;
    customerId?: string;
    status?: TransactionStatus[];
    dateFrom?: Date;
    dateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
    transactionNumber?: string;
}
/**
 * Refund request
 */
export interface RefundRequest {
    originalTransactionId: string;
    lineItems?: string[];
    amount?: number;
    reason: string;
    refundMethod: PaymentMethod;
    processedBy: string;
}
/**
 * Transaction batch for settlement
 */
export interface TransactionBatch {
    batchId: string;
    storeId: string;
    registerId?: string;
    openedAt: Date;
    closedAt?: Date;
    transactions: POSTransaction[];
    totalSales: number;
    totalRefunds: number;
    totalVoids: number;
    netAmount: number;
    tenderBreakdown: Record<PaymentMethod, number>;
}
/**
 * 1. Creates a new POS transaction builder instance.
 *
 * @param {TransactionBuilderConfig} config - Transaction configuration
 * @returns {POSTransaction} New transaction object
 *
 * @example
 * ```typescript
 * const transaction = createTransaction({
 *   storeId: 'STORE-001',
 *   registerId: 'REG-01',
 *   cashierId: 'CASHIER-123',
 *   customerId: 'CUST-456',
 *   taxRate: 0.0825
 * });
 * ```
 */
export declare function createTransaction(config: TransactionBuilderConfig): POSTransaction;
/**
 * 2. Adds a line item to the transaction.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {Partial<TransactionLineItem>} item - Line item details
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = addLineItem(transaction, {
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   name: 'Premium Coffee',
 *   quantity: 2,
 *   unitPrice: 4.99,
 *   taxRate: 0.0825
 * });
 * ```
 */
export declare function addLineItem(transaction: POSTransaction, item: Partial<TransactionLineItem>): POSTransaction;
/**
 * 3. Removes a line item from the transaction.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {string} lineItemId - Line item ID to remove
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = removeLineItem(transaction, 'line-item-123');
 * ```
 */
export declare function removeLineItem(transaction: POSTransaction, lineItemId: string): POSTransaction;
/**
 * 4. Updates line item quantity.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {string} lineItemId - Line item ID
 * @param {number} quantity - New quantity
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = updateLineItemQuantity(transaction, 'line-item-123', 3);
 * ```
 */
export declare function updateLineItemQuantity(transaction: POSTransaction, lineItemId: string, quantity: number): POSTransaction;
/**
 * 5. Applies discount to specific line item.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {string} lineItemId - Line item ID
 * @param {AppliedDiscount} discount - Discount to apply
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = applyLineItemDiscount(transaction, 'line-item-123', {
 *   discountId: 'DISC-001',
 *   code: 'SAVE10',
 *   type: 'PERCENTAGE',
 *   amount: 0.10,
 *   description: '10% off'
 * });
 * ```
 */
export declare function applyLineItemDiscount(transaction: POSTransaction, lineItemId: string, discount: AppliedDiscount): POSTransaction;
/**
 * 6. Applies transaction-level discount.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {AppliedDiscount} discount - Discount to apply
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = applyTransactionDiscount(transaction, {
 *   discountId: 'DISC-002',
 *   type: 'FIXED_AMOUNT',
 *   amount: 5.00,
 *   description: '$5 off entire order'
 * });
 * ```
 */
export declare function applyTransactionDiscount(transaction: POSTransaction, discount: AppliedDiscount): POSTransaction;
/**
 * 7. Recalculates all transaction totals.
 *
 * @param {POSTransaction} transaction - Transaction to recalculate
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = recalculateTransaction(transaction);
 * ```
 */
export declare function recalculateTransaction(transaction: POSTransaction): POSTransaction;
/**
 * 8. Validates transaction before completion.
 *
 * @param {POSTransaction} transaction - Transaction to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTransaction(transaction);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateTransaction(transaction: POSTransaction): {
    valid: boolean;
    errors: string[];
};
/**
 * 9. Adds payment tender to transaction.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {Partial<PaymentTender>} tender - Payment tender details
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = addPaymentTender(transaction, {
 *   method: PaymentMethod.CREDIT_CARD,
 *   amount: 50.00,
 *   cardLast4: '1234',
 *   cardBrand: 'VISA',
 *   authorizationCode: 'AUTH123'
 * });
 * ```
 */
export declare function addPaymentTender(transaction: POSTransaction, tender: Partial<PaymentTender>): POSTransaction;
/**
 * 10. Processes split payment across multiple tenders.
 *
 * @param {POSTransaction} transaction - Transaction to update
 * @param {Partial<PaymentTender>[]} tenders - Multiple payment tenders
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = processSplitPayment(transaction, [
 *   { method: PaymentMethod.CREDIT_CARD, amount: 30.00 },
 *   { method: PaymentMethod.CASH, amount: 20.00 }
 * ]);
 * ```
 */
export declare function processSplitPayment(transaction: POSTransaction, tenders: Partial<PaymentTender>[]): POSTransaction;
/**
 * 11. Calculates change amount for cash payment.
 *
 * @param {number} transactionTotal - Total amount due
 * @param {number} cashTendered - Cash amount provided
 * @returns {number} Change amount
 *
 * @example
 * ```typescript
 * const change = calculateChange(47.53, 50.00);
 * // Returns: 2.47
 * ```
 */
export declare function calculateChange(transactionTotal: number, cashTendered: number): number;
/**
 * 12. Validates payment tender amounts.
 *
 * @param {POSTransaction} transaction - Transaction to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePaymentTenders(transaction);
 * if (!result.valid) {
 *   console.error(result.message);
 * }
 * ```
 */
export declare function validatePaymentTenders(transaction: POSTransaction): {
    valid: boolean;
    message?: string;
    shortfall?: number;
    overpayment?: number;
};
/**
 * 13. Completes transaction after payment validation.
 *
 * @param {POSTransaction} transaction - Transaction to complete
 * @returns {POSTransaction} Completed transaction
 *
 * @example
 * ```typescript
 * const completed = completeTransaction(transaction);
 * ```
 */
export declare function completeTransaction(transaction: POSTransaction): POSTransaction;
/**
 * 14. Authorizes payment without capturing.
 *
 * @param {POSTransaction} transaction - Transaction to authorize
 * @param {PaymentTender} tender - Payment tender
 * @returns {POSTransaction} Authorized transaction
 *
 * @example
 * ```typescript
 * const authorized = authorizePayment(transaction, cardTender);
 * ```
 */
export declare function authorizePayment(transaction: POSTransaction, tender: PaymentTender): POSTransaction;
/**
 * 15. Captures previously authorized payment.
 *
 * @param {POSTransaction} transaction - Authorized transaction
 * @returns {POSTransaction} Captured transaction
 *
 * @example
 * ```typescript
 * const captured = capturePayment(transaction);
 * ```
 */
export declare function capturePayment(transaction: POSTransaction): POSTransaction;
/**
 * 16. Processes tip adjustment for payment.
 *
 * @param {POSTransaction} transaction - Transaction to adjust
 * @param {string} tenderId - Tender ID to adjust
 * @param {number} tipAmount - Tip amount to add
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = addTipAdjustment(transaction, 'tender-123', 10.00);
 * ```
 */
export declare function addTipAdjustment(transaction: POSTransaction, tenderId: string, tipAmount: number): POSTransaction;
/**
 * 17. Voids an existing transaction.
 *
 * @param {POSTransaction} transaction - Transaction to void
 * @param {string} reason - Void reason
 * @param {string} voidedBy - User ID who voided
 * @returns {POSTransaction} Voided transaction
 *
 * @example
 * ```typescript
 * const voided = voidTransaction(transaction, 'Customer changed mind', 'CASHIER-123');
 * ```
 */
export declare function voidTransaction(transaction: POSTransaction, reason: string, voidedBy: string): POSTransaction;
/**
 * 18. Creates a refund transaction.
 *
 * @param {POSTransaction} originalTransaction - Original transaction
 * @param {RefundRequest} request - Refund request details
 * @returns {POSTransaction} Refund transaction
 *
 * @example
 * ```typescript
 * const refund = createRefundTransaction(originalTxn, {
 *   originalTransactionId: 'TXN-001',
 *   reason: 'Defective product',
 *   refundMethod: PaymentMethod.CREDIT_CARD,
 *   processedBy: 'CASHIER-123'
 * });
 * ```
 */
export declare function createRefundTransaction(originalTransaction: POSTransaction, request: RefundRequest): POSTransaction;
/**
 * 19. Processes partial refund for specific line items.
 *
 * @param {POSTransaction} originalTransaction - Original transaction
 * @param {string[]} lineItemIds - Line items to refund
 * @param {string} reason - Refund reason
 * @returns {POSTransaction} Partial refund transaction
 *
 * @example
 * ```typescript
 * const partialRefund = createPartialRefund(originalTxn, ['line-123', 'line-456'], 'Wrong items');
 * ```
 */
export declare function createPartialRefund(originalTransaction: POSTransaction, lineItemIds: string[], reason: string): POSTransaction;
/**
 * 20. Processes exchange transaction.
 *
 * @param {POSTransaction} returnTransaction - Return transaction
 * @param {TransactionLineItem[]} newItems - New items for exchange
 * @returns {POSTransaction} Exchange transaction
 *
 * @example
 * ```typescript
 * const exchange = createExchangeTransaction(returnTxn, [newItem1, newItem2]);
 * ```
 */
export declare function createExchangeTransaction(returnTransaction: POSTransaction, newItems: TransactionLineItem[]): POSTransaction;
/**
 * 21. Validates refund eligibility.
 *
 * @param {POSTransaction} transaction - Transaction to validate
 * @param {number} daysAllowed - Days allowed for refund
 * @returns {object} Eligibility result
 *
 * @example
 * ```typescript
 * const result = validateRefundEligibility(transaction, 30);
 * if (!result.eligible) {
 *   console.error(result.reason);
 * }
 * ```
 */
export declare function validateRefundEligibility(transaction: POSTransaction, daysAllowed: number): {
    eligible: boolean;
    reason?: string;
};
/**
 * 22. Calculates restocking fee for return.
 *
 * @param {number} refundAmount - Original amount
 * @param {number} feePercentage - Fee percentage (0-1)
 * @returns {object} Fee breakdown
 *
 * @example
 * ```typescript
 * const fee = calculateRestockingFee(100.00, 0.15);
 * // Returns: { originalAmount: 100, fee: 15, refundAmount: 85 }
 * ```
 */
export declare function calculateRestockingFee(refundAmount: number, feePercentage: number): {
    originalAmount: number;
    fee: number;
    refundAmount: number;
};
/**
 * 23. Processes store credit refund.
 *
 * @param {POSTransaction} transaction - Transaction to refund
 * @param {string} customerId - Customer ID
 * @returns {object} Store credit details
 *
 * @example
 * ```typescript
 * const credit = issueStoreCredit(transaction, 'CUST-123');
 * ```
 */
export declare function issueStoreCredit(transaction: POSTransaction, customerId: string): {
    creditId: string;
    customerId: string;
    amount: number;
    expiresAt: Date;
    issuedAt: Date;
};
/**
 * 24. Reverses payment authorization.
 *
 * @param {POSTransaction} transaction - Authorized transaction
 * @param {string} tenderId - Tender to reverse
 * @returns {POSTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const reversed = reverseAuthorization(transaction, 'tender-123');
 * ```
 */
export declare function reverseAuthorization(transaction: POSTransaction, tenderId: string): POSTransaction;
/**
 * 25. Calculates tax for line item.
 *
 * @param {number} amount - Taxable amount
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {number} Tax amount
 *
 * @example
 * ```typescript
 * const tax = calculateTax(100.00, 0.0825);
 * // Returns: 8.25
 * ```
 */
export declare function calculateTax(amount: number, taxRate: number): number;
/**
 * 26. Calculates tax with jurisdiction support.
 *
 * @param {number} amount - Taxable amount
 * @param {TaxConfig} config - Tax configuration
 * @param {string} category - Product category
 * @returns {number} Tax amount
 *
 * @example
 * ```typescript
 * const tax = calculateTaxWithJurisdiction(100.00, taxConfig, 'FOOD');
 * ```
 */
export declare function calculateTaxWithJurisdiction(amount: number, config: TaxConfig, category?: string): number;
/**
 * 27. Calculates compound tax (tax on tax).
 *
 * @param {number} amount - Base amount
 * @param {number[]} taxRates - Array of tax rates
 * @returns {object} Tax breakdown
 *
 * @example
 * ```typescript
 * const result = calculateCompoundTax(100.00, [0.05, 0.08]);
 * // Returns: { subtotal: 100, taxes: [5, 8.4], total: 113.4 }
 * ```
 */
export declare function calculateCompoundTax(amount: number, taxRates: number[]): {
    subtotal: number;
    taxes: number[];
    total: number;
};
/**
 * 28. Calculates reverse tax (price includes tax).
 *
 * @param {number} totalAmount - Total amount including tax
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {object} Tax breakdown
 *
 * @example
 * ```typescript
 * const result = calculateReverseTax(108.25, 0.0825);
 * // Returns: { subtotal: 100, taxAmount: 8.25, total: 108.25 }
 * ```
 */
export declare function calculateReverseTax(totalAmount: number, taxRate: number): {
    subtotal: number;
    taxAmount: number;
    total: number;
};
/**
 * 29. Calculates tax for multi-jurisdiction transaction.
 *
 * @param {TransactionLineItem[]} lineItems - Line items
 * @param {Record<string, number>} jurisdictionRates - Jurisdiction tax rates
 * @returns {Record<string, number>} Tax by jurisdiction
 *
 * @example
 * ```typescript
 * const taxes = calculateMultiJurisdictionTax(lineItems, {
 *   STATE: 0.0625,
 *   COUNTY: 0.01,
 *   CITY: 0.01
 * });
 * ```
 */
export declare function calculateMultiJurisdictionTax(lineItems: TransactionLineItem[], jurisdictionRates: Record<string, number>): Record<string, number>;
/**
 * 30. Generates tax report for transaction.
 *
 * @param {POSTransaction} transaction - Transaction
 * @returns {object} Tax report
 *
 * @example
 * ```typescript
 * const report = generateTaxReport(transaction);
 * ```
 */
export declare function generateTaxReport(transaction: POSTransaction): {
    transactionId: string;
    subtotal: number;
    discountTotal: number;
    taxableAmount: number;
    taxTotal: number;
    total: number;
    itemizedTaxes: Array<{
        lineItemId: string;
        productName: string;
        taxableAmount: number;
        taxRate: number;
        taxAmount: number;
    }>;
};
/**
 * 31. Generates plain text receipt.
 *
 * @param {POSTransaction} transaction - Transaction
 * @param {ReceiptConfig} config - Receipt configuration
 * @returns {string} Plain text receipt
 *
 * @example
 * ```typescript
 * const receipt = generateReceipt(transaction, receiptConfig);
 * console.log(receipt);
 * ```
 */
export declare function generateReceipt(transaction: POSTransaction, config: ReceiptConfig): string;
/**
 * 32. Generates HTML receipt.
 *
 * @param {POSTransaction} transaction - Transaction
 * @param {ReceiptConfig} config - Receipt configuration
 * @returns {string} HTML receipt
 *
 * @example
 * ```typescript
 * const html = generateHTMLReceipt(transaction, config);
 * ```
 */
export declare function generateHTMLReceipt(transaction: POSTransaction, config: ReceiptConfig): string;
/**
 * 33. Generates JSON receipt for digital systems.
 *
 * @param {POSTransaction} transaction - Transaction
 * @returns {object} Structured receipt data
 *
 * @example
 * ```typescript
 * const json = generateJSONReceipt(transaction);
 * ```
 */
export declare function generateJSONReceipt(transaction: POSTransaction): object;
/**
 * 34. Generates email receipt body.
 *
 * @param {POSTransaction} transaction - Transaction
 * @param {ReceiptConfig} config - Receipt configuration
 * @param {string} customerEmail - Customer email
 * @returns {object} Email content
 *
 * @example
 * ```typescript
 * const email = generateEmailReceipt(transaction, config, 'customer@example.com');
 * ```
 */
export declare function generateEmailReceipt(transaction: POSTransaction, config: ReceiptConfig, customerEmail: string): {
    to: string;
    subject: string;
    html: string;
};
/**
 * 35. Generates barcode for receipt.
 *
 * @param {string} transactionId - Transaction ID
 * @returns {string} Barcode representation
 *
 * @example
 * ```typescript
 * const barcode = generateBarcodeText('TXN-123456');
 * ```
 */
export declare function generateBarcodeText(transactionId: string): string;
/**
 * 36. Formats currency for receipt display.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 *
 * @example
 * ```typescript
 * const formatted = formatReceiptCurrency(123.45, 'USD');
 * // Returns: '$123.45'
 * ```
 */
export declare function formatReceiptCurrency(amount: number, currency?: string): string;
/**
 * 37. Generates QR code data for digital receipt.
 *
 * @param {POSTransaction} transaction - Transaction
 * @param {string} baseUrl - Receipt viewer URL
 * @returns {string} QR code data URL
 *
 * @example
 * ```typescript
 * const qrData = generateReceiptQRData(transaction, 'https://receipts.example.com');
 * ```
 */
export declare function generateReceiptQRData(transaction: POSTransaction, baseUrl: string): string;
/**
 * 38. Generates receipt footer with return policy.
 *
 * @param {number} returnDays - Days allowed for returns
 * @returns {string} Footer text
 *
 * @example
 * ```typescript
 * const footer = generateReceiptFooter(30);
 * ```
 */
export declare function generateReceiptFooter(returnDays: number): string;
/**
 * 39. Generates unique transaction ID.
 *
 * @returns {string} Transaction ID
 *
 * @example
 * ```typescript
 * const id = generateTransactionId();
 * ```
 */
export declare function generateTransactionId(): string;
/**
 * 40. Generates human-readable transaction number.
 *
 * @param {string} storeId - Store ID
 * @param {string} registerId - Register ID
 * @returns {string} Transaction number
 *
 * @example
 * ```typescript
 * const number = generateTransactionNumber('STORE-001', 'REG-01');
 * // Returns: 'STORE001-REG01-20240115-0042'
 * ```
 */
export declare function generateTransactionNumber(storeId: string, registerId: string): string;
/**
 * 41. Searches transactions by criteria.
 *
 * @param {POSTransaction[]} transactions - All transactions
 * @param {TransactionSearchCriteria} criteria - Search criteria
 * @returns {POSTransaction[]} Matching transactions
 *
 * @example
 * ```typescript
 * const results = searchTransactions(allTransactions, {
 *   storeId: 'STORE-001',
 *   dateFrom: new Date('2024-01-01'),
 *   status: [TransactionStatus.COMPLETED]
 * });
 * ```
 */
export declare function searchTransactions(transactions: POSTransaction[], criteria: TransactionSearchCriteria): POSTransaction[];
/**
 * 42. Creates transaction batch for settlement.
 *
 * @param {POSTransaction[]} transactions - Transactions to batch
 * @param {string} storeId - Store ID
 * @param {string} registerId - Register ID
 * @returns {TransactionBatch} Transaction batch
 *
 * @example
 * ```typescript
 * const batch = createTransactionBatch(transactions, 'STORE-001', 'REG-01');
 * ```
 */
export declare function createTransactionBatch(transactions: POSTransaction[], storeId: string, registerId?: string): TransactionBatch;
/**
 * 43. Calculates batch summary statistics.
 *
 * @param {TransactionBatch} batch - Transaction batch
 * @returns {object} Batch statistics
 *
 * @example
 * ```typescript
 * const stats = calculateBatchStatistics(batch);
 * ```
 */
export declare function calculateBatchStatistics(batch: TransactionBatch): {
    transactionCount: number;
    averageTransactionValue: number;
    largestTransaction: number;
    smallestTransaction: number;
    itemsSold: number;
};
/**
 * 44. Exports transactions to CSV format.
 *
 * @param {POSTransaction[]} transactions - Transactions to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportTransactionsToCSV(transactions);
 * ```
 */
export declare function exportTransactionsToCSV(transactions: POSTransaction[]): string;
/**
 * 45. Clones transaction for modification.
 *
 * @param {POSTransaction} transaction - Transaction to clone
 * @returns {POSTransaction} Cloned transaction
 *
 * @example
 * ```typescript
 * const clone = cloneTransaction(originalTransaction);
 * ```
 */
export declare function cloneTransaction(transaction: POSTransaction): POSTransaction;
/**
 * 46. Merges multiple transactions (for split bills).
 *
 * @param {POSTransaction[]} transactions - Transactions to merge
 * @returns {POSTransaction} Merged transaction
 *
 * @example
 * ```typescript
 * const merged = mergeTransactions([txn1, txn2, txn3]);
 * ```
 */
export declare function mergeTransactions(transactions: POSTransaction[]): POSTransaction;
/**
 * 47. Splits transaction into multiple transactions.
 *
 * @param {POSTransaction} transaction - Transaction to split
 * @param {number} ways - Number of ways to split
 * @returns {POSTransaction[]} Split transactions
 *
 * @example
 * ```typescript
 * const split = splitTransaction(transaction, 3);
 * ```
 */
export declare function splitTransaction(transaction: POSTransaction, ways: number): POSTransaction[];
/**
 * 48. Validates transaction integrity.
 *
 * @param {POSTransaction} transaction - Transaction to validate
 * @returns {object} Integrity check result
 *
 * @example
 * ```typescript
 * const result = validateTransactionIntegrity(transaction);
 * ```
 */
export declare function validateTransactionIntegrity(transaction: POSTransaction): {
    valid: boolean;
    issues: string[];
};
declare const _default: {
    createTransaction: typeof createTransaction;
    addLineItem: typeof addLineItem;
    removeLineItem: typeof removeLineItem;
    updateLineItemQuantity: typeof updateLineItemQuantity;
    applyLineItemDiscount: typeof applyLineItemDiscount;
    applyTransactionDiscount: typeof applyTransactionDiscount;
    recalculateTransaction: typeof recalculateTransaction;
    validateTransaction: typeof validateTransaction;
    addPaymentTender: typeof addPaymentTender;
    processSplitPayment: typeof processSplitPayment;
    calculateChange: typeof calculateChange;
    validatePaymentTenders: typeof validatePaymentTenders;
    completeTransaction: typeof completeTransaction;
    authorizePayment: typeof authorizePayment;
    capturePayment: typeof capturePayment;
    addTipAdjustment: typeof addTipAdjustment;
    voidTransaction: typeof voidTransaction;
    createRefundTransaction: typeof createRefundTransaction;
    createPartialRefund: typeof createPartialRefund;
    createExchangeTransaction: typeof createExchangeTransaction;
    validateRefundEligibility: typeof validateRefundEligibility;
    calculateRestockingFee: typeof calculateRestockingFee;
    issueStoreCredit: typeof issueStoreCredit;
    reverseAuthorization: typeof reverseAuthorization;
    calculateTax: typeof calculateTax;
    calculateTaxWithJurisdiction: typeof calculateTaxWithJurisdiction;
    calculateCompoundTax: typeof calculateCompoundTax;
    calculateReverseTax: typeof calculateReverseTax;
    calculateMultiJurisdictionTax: typeof calculateMultiJurisdictionTax;
    generateTaxReport: typeof generateTaxReport;
    generateReceipt: typeof generateReceipt;
    generateHTMLReceipt: typeof generateHTMLReceipt;
    generateJSONReceipt: typeof generateJSONReceipt;
    generateEmailReceipt: typeof generateEmailReceipt;
    generateBarcodeText: typeof generateBarcodeText;
    formatReceiptCurrency: typeof formatReceiptCurrency;
    generateReceiptQRData: typeof generateReceiptQRData;
    generateReceiptFooter: typeof generateReceiptFooter;
    generateTransactionId: typeof generateTransactionId;
    generateTransactionNumber: typeof generateTransactionNumber;
    searchTransactions: typeof searchTransactions;
    createTransactionBatch: typeof createTransactionBatch;
    calculateBatchStatistics: typeof calculateBatchStatistics;
    exportTransactionsToCSV: typeof exportTransactionsToCSV;
    cloneTransaction: typeof cloneTransaction;
    mergeTransactions: typeof mergeTransactions;
    splitTransaction: typeof splitTransaction;
    validateTransactionIntegrity: typeof validateTransactionIntegrity;
};
export default _default;
//# sourceMappingURL=pos-transaction-kit.d.ts.map