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
 * File: /reuse/retail/pos-transaction-kit.ts
 * Locator: WC-RETAIL-POS-TXN-001
 * Purpose: Comprehensive POS Transaction Management - Complete transaction lifecycle for retail operations
 *
 * Upstream: Independent utility module for POS transaction operations
 * Downstream: ../backend/retail/*, POS modules, Transaction services, Payment processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 48 utility functions for POS transactions, payments, refunds, voids, receipts
 *
 * LLM Context: Enterprise-grade POS transaction utilities for retail operations to compete with Oracle MICROS.
 * Provides comprehensive transaction lifecycle management, multi-tender payments, split payments,
 * tax calculations, discount applications, refund processing, void operations, receipt generation,
 * transaction batching, settlement operations, and real-time inventory updates.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  VOIDED = 'VOIDED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment method types
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  GIFT_CARD = 'GIFT_CARD',
  STORE_CREDIT = 'STORE_CREDIT',
  CHECK = 'CHECK',
  EBT = 'EBT',
}

/**
 * Transaction type enumeration
 */
export enum TransactionType {
  SALE = 'SALE',
  RETURN = 'RETURN',
  EXCHANGE = 'EXCHANGE',
  VOID = 'VOID',
  REFUND = 'REFUND',
  NO_SALE = 'NO_SALE',
  PAYOUT = 'PAYOUT',
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
  lineItems?: string[]; // Line item IDs to refund (partial refund)
  amount?: number; // Specific amount (if different from full refund)
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

// ============================================================================
// SECTION 1: TRANSACTION BUILDER (Functions 1-8)
// ============================================================================

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
export function createTransaction(config: TransactionBuilderConfig): POSTransaction {
  const transactionId = generateTransactionId();
  const transactionNumber = generateTransactionNumber(config.storeId, config.registerId);

  return {
    transactionId,
    transactionNumber,
    storeId: config.storeId,
    registerId: config.registerId,
    cashierId: config.cashierId,
    customerId: config.customerId,
    type: TransactionType.SALE,
    status: TransactionStatus.PENDING,
    lineItems: [],
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    total: 0,
    tenders: [],
    createdAt: new Date(),
  };
}

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
export function addLineItem(
  transaction: POSTransaction,
  item: Partial<TransactionLineItem>
): POSTransaction {
  const lineItemId = crypto.randomUUID();
  const quantity = item.quantity || 1;
  const unitPrice = item.unitPrice || 0;
  const subtotal = quantity * unitPrice;
  const discountAmount = item.discountAmount || 0;
  const taxRate = item.taxRate || 0;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const lineItem: TransactionLineItem = {
    lineItemId,
    productId: item.productId || '',
    sku: item.sku || '',
    name: item.name || '',
    quantity,
    unitPrice,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    taxRate,
    discounts: item.discounts || [],
    modifiers: item.modifiers,
    metadata: item.metadata,
  };

  const updatedTransaction = {
    ...transaction,
    lineItems: [...transaction.lineItems, lineItem],
  };

  return recalculateTransaction(updatedTransaction);
}

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
export function removeLineItem(
  transaction: POSTransaction,
  lineItemId: string
): POSTransaction {
  const updatedTransaction = {
    ...transaction,
    lineItems: transaction.lineItems.filter(item => item.lineItemId !== lineItemId),
  };

  return recalculateTransaction(updatedTransaction);
}

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
export function updateLineItemQuantity(
  transaction: POSTransaction,
  lineItemId: string,
  quantity: number
): POSTransaction {
  const updatedTransaction = {
    ...transaction,
    lineItems: transaction.lineItems.map(item => {
      if (item.lineItemId === lineItemId) {
        const subtotal = quantity * item.unitPrice;
        const taxAmount = (subtotal - item.discountAmount) * item.taxRate;
        const total = subtotal - item.discountAmount + taxAmount;

        return {
          ...item,
          quantity,
          subtotal,
          taxAmount,
          total,
        };
      }
      return item;
    }),
  };

  return recalculateTransaction(updatedTransaction);
}

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
export function applyLineItemDiscount(
  transaction: POSTransaction,
  lineItemId: string,
  discount: AppliedDiscount
): POSTransaction {
  const updatedTransaction = {
    ...transaction,
    lineItems: transaction.lineItems.map(item => {
      if (item.lineItemId === lineItemId) {
        const discounts = [...item.discounts, discount];
        const discountAmount = calculateLineItemDiscount(item, discounts);
        const taxAmount = (item.subtotal - discountAmount) * item.taxRate;
        const total = item.subtotal - discountAmount + taxAmount;

        return {
          ...item,
          discounts,
          discountAmount,
          taxAmount,
          total,
        };
      }
      return item;
    }),
  };

  return recalculateTransaction(updatedTransaction);
}

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
export function applyTransactionDiscount(
  transaction: POSTransaction,
  discount: AppliedDiscount
): POSTransaction {
  // Store discount in transaction metadata
  const metadata = {
    ...transaction.metadata,
    transactionDiscounts: [
      ...(transaction.metadata?.transactionDiscounts || []),
      discount,
    ],
  };

  // Apply discount proportionally to line items
  const subtotal = transaction.subtotal;
  const discountAmount = discount.type === 'PERCENTAGE'
    ? subtotal * discount.amount
    : discount.amount;

  const updatedTransaction = {
    ...transaction,
    metadata,
    lineItems: transaction.lineItems.map(item => {
      const proportion = item.subtotal / subtotal;
      const itemDiscount = discountAmount * proportion;
      const totalDiscount = item.discountAmount + itemDiscount;
      const taxAmount = (item.subtotal - totalDiscount) * item.taxRate;
      const total = item.subtotal - totalDiscount + taxAmount;

      return {
        ...item,
        discountAmount: totalDiscount,
        taxAmount,
        total,
      };
    }),
  };

  return recalculateTransaction(updatedTransaction);
}

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
export function recalculateTransaction(transaction: POSTransaction): POSTransaction {
  const subtotal = transaction.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountTotal = transaction.lineItems.reduce((sum, item) => sum + item.discountAmount, 0);
  const taxTotal = transaction.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const total = transaction.lineItems.reduce((sum, item) => sum + item.total, 0);

  return {
    ...transaction,
    subtotal,
    discountTotal,
    taxTotal,
    total,
  };
}

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
export function validateTransaction(transaction: POSTransaction): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!transaction.lineItems || transaction.lineItems.length === 0) {
    errors.push('Transaction must have at least one line item');
  }

  if (transaction.total < 0) {
    errors.push('Transaction total cannot be negative');
  }

  if (transaction.status === TransactionStatus.COMPLETED && transaction.tenders.length === 0) {
    errors.push('Completed transaction must have at least one payment tender');
  }

  const tenderTotal = transaction.tenders.reduce((sum, tender) => sum + tender.amount, 0);
  if (transaction.status === TransactionStatus.COMPLETED && tenderTotal < transaction.total) {
    errors.push('Payment tenders do not cover transaction total');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SECTION 2: PAYMENT PROCESSING (Functions 9-16)
// ============================================================================

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
export function addPaymentTender(
  transaction: POSTransaction,
  tender: Partial<PaymentTender>
): POSTransaction {
  const tenderId = crypto.randomUUID();

  const paymentTender: PaymentTender = {
    tenderId,
    method: tender.method || PaymentMethod.CASH,
    amount: tender.amount || 0,
    reference: tender.reference,
    cardLast4: tender.cardLast4,
    cardBrand: tender.cardBrand,
    authorizationCode: tender.authorizationCode,
    processorResponse: tender.processorResponse,
    timestamp: new Date(),
  };

  const tenders = [...transaction.tenders, paymentTender];
  const tenderTotal = tenders.reduce((sum, t) => sum + t.amount, 0);
  const changeAmount = tenderTotal > transaction.total ? tenderTotal - transaction.total : 0;

  return {
    ...transaction,
    tenders,
    changeAmount,
  };
}

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
export function processSplitPayment(
  transaction: POSTransaction,
  tenders: Partial<PaymentTender>[]
): POSTransaction {
  let updatedTransaction = transaction;

  for (const tender of tenders) {
    updatedTransaction = addPaymentTender(updatedTransaction, tender);
  }

  return updatedTransaction;
}

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
export function calculateChange(transactionTotal: number, cashTendered: number): number {
  return Math.max(0, cashTendered - transactionTotal);
}

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
export function validatePaymentTenders(transaction: POSTransaction): {
  valid: boolean;
  message?: string;
  shortfall?: number;
  overpayment?: number;
} {
  const tenderTotal = transaction.tenders.reduce((sum, tender) => sum + tender.amount, 0);
  const transactionTotal = transaction.total;

  if (tenderTotal < transactionTotal) {
    return {
      valid: false,
      message: 'Payment insufficient',
      shortfall: transactionTotal - tenderTotal,
    };
  }

  if (tenderTotal > transactionTotal) {
    return {
      valid: true,
      message: 'Overpayment (change due)',
      overpayment: tenderTotal - transactionTotal,
    };
  }

  return {
    valid: true,
    message: 'Payment complete',
  };
}

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
export function completeTransaction(transaction: POSTransaction): POSTransaction {
  const validation = validatePaymentTenders(transaction);

  if (!validation.valid) {
    throw new Error(`Cannot complete transaction: ${validation.message}`);
  }

  return {
    ...transaction,
    status: TransactionStatus.COMPLETED,
    completedAt: new Date(),
  };
}

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
export function authorizePayment(
  transaction: POSTransaction,
  tender: PaymentTender
): POSTransaction {
  return {
    ...transaction,
    status: TransactionStatus.AUTHORIZED,
    tenders: [...transaction.tenders, tender],
  };
}

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
export function capturePayment(transaction: POSTransaction): POSTransaction {
  if (transaction.status !== TransactionStatus.AUTHORIZED) {
    throw new Error('Transaction must be authorized before capture');
  }

  return {
    ...transaction,
    status: TransactionStatus.CAPTURED,
    completedAt: new Date(),
  };
}

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
export function addTipAdjustment(
  transaction: POSTransaction,
  tenderId: string,
  tipAmount: number
): POSTransaction {
  const updatedTenders = transaction.tenders.map(tender => {
    if (tender.tenderId === tenderId) {
      return {
        ...tender,
        amount: tender.amount + tipAmount,
        processorResponse: {
          ...tender.processorResponse,
          tipAmount,
        },
      };
    }
    return tender;
  });

  return {
    ...transaction,
    tenders: updatedTenders,
    total: transaction.total + tipAmount,
  };
}

// ============================================================================
// SECTION 3: REFUNDS AND VOIDS (Functions 17-24)
// ============================================================================

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
export function voidTransaction(
  transaction: POSTransaction,
  reason: string,
  voidedBy: string
): POSTransaction {
  if (transaction.status === TransactionStatus.VOIDED) {
    throw new Error('Transaction is already voided');
  }

  if (transaction.status === TransactionStatus.REFUNDED) {
    throw new Error('Cannot void a refunded transaction');
  }

  return {
    ...transaction,
    status: TransactionStatus.VOIDED,
    voidedAt: new Date(),
    voidReason: reason,
    metadata: {
      ...transaction.metadata,
      voidedBy,
    },
  };
}

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
export function createRefundTransaction(
  originalTransaction: POSTransaction,
  request: RefundRequest
): POSTransaction {
  const refundTransaction: POSTransaction = {
    transactionId: generateTransactionId(),
    transactionNumber: generateTransactionNumber(
      originalTransaction.storeId,
      originalTransaction.registerId
    ),
    storeId: originalTransaction.storeId,
    registerId: originalTransaction.registerId,
    cashierId: request.processedBy,
    customerId: originalTransaction.customerId,
    type: TransactionType.REFUND,
    status: TransactionStatus.COMPLETED,
    lineItems: request.lineItems
      ? originalTransaction.lineItems
          .filter(item => request.lineItems!.includes(item.lineItemId))
          .map(item => ({ ...item, quantity: -item.quantity, total: -item.total }))
      : originalTransaction.lineItems.map(item => ({
          ...item,
          quantity: -item.quantity,
          total: -item.total,
        })),
    subtotal: -originalTransaction.subtotal,
    discountTotal: -originalTransaction.discountTotal,
    taxTotal: -originalTransaction.taxTotal,
    total: -(request.amount || originalTransaction.total),
    tenders: [],
    createdAt: new Date(),
    completedAt: new Date(),
    metadata: {
      originalTransactionId: originalTransaction.transactionId,
      refundReason: request.reason,
      processedBy: request.processedBy,
    },
  };

  return refundTransaction;
}

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
export function createPartialRefund(
  originalTransaction: POSTransaction,
  lineItemIds: string[],
  reason: string
): POSTransaction {
  const refundItems = originalTransaction.lineItems.filter(item =>
    lineItemIds.includes(item.lineItemId)
  );

  if (refundItems.length === 0) {
    throw new Error('No valid line items found for refund');
  }

  const refundSubtotal = refundItems.reduce((sum, item) => sum + item.subtotal, 0);
  const refundTax = refundItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const refundTotal = refundItems.reduce((sum, item) => sum + item.total, 0);

  return {
    ...originalTransaction,
    transactionId: generateTransactionId(),
    type: TransactionType.REFUND,
    status: TransactionStatus.COMPLETED,
    lineItems: refundItems.map(item => ({
      ...item,
      quantity: -item.quantity,
      subtotal: -item.subtotal,
      taxAmount: -item.taxAmount,
      total: -item.total,
    })),
    subtotal: -refundSubtotal,
    taxTotal: -refundTax,
    total: -refundTotal,
    tenders: [],
    createdAt: new Date(),
    completedAt: new Date(),
    metadata: {
      originalTransactionId: originalTransaction.transactionId,
      refundReason: reason,
      refundType: 'PARTIAL',
    },
  };
}

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
export function createExchangeTransaction(
  returnTransaction: POSTransaction,
  newItems: TransactionLineItem[]
): POSTransaction {
  const exchangeTransaction: POSTransaction = {
    ...returnTransaction,
    transactionId: generateTransactionId(),
    type: TransactionType.EXCHANGE,
    status: TransactionStatus.PENDING,
    lineItems: [
      ...returnTransaction.lineItems.map(item => ({
        ...item,
        quantity: -item.quantity,
        total: -item.total,
      })),
      ...newItems,
    ],
    createdAt: new Date(),
    metadata: {
      originalTransactionId: returnTransaction.transactionId,
      exchangeType: 'EVEN_EXCHANGE',
    },
  };

  return recalculateTransaction(exchangeTransaction);
}

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
export function validateRefundEligibility(
  transaction: POSTransaction,
  daysAllowed: number
): {
  eligible: boolean;
  reason?: string;
} {
  if (transaction.status === TransactionStatus.VOIDED) {
    return { eligible: false, reason: 'Transaction is voided' };
  }

  if (transaction.status === TransactionStatus.REFUNDED) {
    return { eligible: false, reason: 'Transaction is already refunded' };
  }

  if (transaction.status !== TransactionStatus.COMPLETED) {
    return { eligible: false, reason: 'Transaction is not completed' };
  }

  const daysSincePurchase = Math.floor(
    (Date.now() - transaction.completedAt!.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSincePurchase > daysAllowed) {
    return {
      eligible: false,
      reason: `Refund period expired (${daysAllowed} days)`,
    };
  }

  return { eligible: true };
}

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
export function calculateRestockingFee(
  refundAmount: number,
  feePercentage: number
): {
  originalAmount: number;
  fee: number;
  refundAmount: number;
} {
  const fee = refundAmount * feePercentage;
  return {
    originalAmount: refundAmount,
    fee,
    refundAmount: refundAmount - fee,
  };
}

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
export function issueStoreCredit(
  transaction: POSTransaction,
  customerId: string
): {
  creditId: string;
  customerId: string;
  amount: number;
  expiresAt: Date;
  issuedAt: Date;
} {
  const creditId = `SC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry

  return {
    creditId,
    customerId,
    amount: Math.abs(transaction.total),
    expiresAt,
    issuedAt: new Date(),
  };
}

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
export function reverseAuthorization(
  transaction: POSTransaction,
  tenderId: string
): POSTransaction {
  if (transaction.status !== TransactionStatus.AUTHORIZED) {
    throw new Error('Can only reverse authorized transactions');
  }

  return {
    ...transaction,
    status: TransactionStatus.VOIDED,
    tenders: transaction.tenders.map(tender => {
      if (tender.tenderId === tenderId) {
        return {
          ...tender,
          processorResponse: {
            ...tender.processorResponse,
            reversed: true,
            reversedAt: new Date(),
          },
        };
      }
      return tender;
    }),
    voidedAt: new Date(),
  };
}

// ============================================================================
// SECTION 4: TAX CALCULATIONS (Functions 25-30)
// ============================================================================

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
export function calculateTax(amount: number, taxRate: number): number {
  return Number((amount * taxRate).toFixed(2));
}

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
export function calculateTaxWithJurisdiction(
  amount: number,
  config: TaxConfig,
  category?: string
): number {
  // Check if category is tax-exempt
  if (category && config.taxExemptCategories?.includes(category)) {
    return 0;
  }

  // Use category-specific rate if available
  const rate = category && config.categoryRates?.[category]
    ? config.categoryRates[category]
    : config.defaultRate;

  return calculateTax(amount, rate);
}

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
export function calculateCompoundTax(
  amount: number,
  taxRates: number[]
): {
  subtotal: number;
  taxes: number[];
  total: number;
} {
  let runningTotal = amount;
  const taxes: number[] = [];

  for (const rate of taxRates) {
    const tax = calculateTax(runningTotal, rate);
    taxes.push(tax);
    runningTotal += tax;
  }

  return {
    subtotal: amount,
    taxes,
    total: runningTotal,
  };
}

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
export function calculateReverseTax(
  totalAmount: number,
  taxRate: number
): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = totalAmount / (1 + taxRate);
  const taxAmount = totalAmount - subtotal;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    total: totalAmount,
  };
}

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
export function calculateMultiJurisdictionTax(
  lineItems: TransactionLineItem[],
  jurisdictionRates: Record<string, number>
): Record<string, number> {
  const taxes: Record<string, number> = {};
  const taxableAmount = lineItems.reduce(
    (sum, item) => sum + (item.subtotal - item.discountAmount),
    0
  );

  for (const [jurisdiction, rate] of Object.entries(jurisdictionRates)) {
    taxes[jurisdiction] = calculateTax(taxableAmount, rate);
  }

  return taxes;
}

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
export function generateTaxReport(transaction: POSTransaction): {
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
} {
  const itemizedTaxes = transaction.lineItems.map(item => ({
    lineItemId: item.lineItemId,
    productName: item.name,
    taxableAmount: item.subtotal - item.discountAmount,
    taxRate: item.taxRate,
    taxAmount: item.taxAmount,
  }));

  return {
    transactionId: transaction.transactionId,
    subtotal: transaction.subtotal,
    discountTotal: transaction.discountTotal,
    taxableAmount: transaction.subtotal - transaction.discountTotal,
    taxTotal: transaction.taxTotal,
    total: transaction.total,
    itemizedTaxes,
  };
}

// ============================================================================
// SECTION 5: RECEIPT GENERATION (Functions 31-38)
// ============================================================================

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
export function generateReceipt(
  transaction: POSTransaction,
  config: ReceiptConfig
): string {
  let receipt = '';
  receipt += centerText(config.storeName, 40) + '\n';
  receipt += centerText(config.storeAddress, 40) + '\n';
  receipt += centerText(config.storePhone, 40) + '\n';
  if (config.taxId) {
    receipt += centerText(`Tax ID: ${config.taxId}`, 40) + '\n';
  }
  receipt += '='.repeat(40) + '\n';
  receipt += `Date: ${transaction.createdAt.toLocaleString()}\n`;
  receipt += `Transaction: ${transaction.transactionNumber}\n`;
  receipt += `Cashier: ${transaction.cashierId}\n`;
  receipt += '='.repeat(40) + '\n\n';

  // Line items
  for (const item of transaction.lineItems) {
    receipt += `${item.name}\n`;
    receipt += `  ${item.quantity} x $${item.unitPrice.toFixed(2)}`;
    receipt += ` = $${item.subtotal.toFixed(2)}\n`;

    if (item.discountAmount > 0) {
      receipt += `  Discount: -$${item.discountAmount.toFixed(2)}\n`;
    }
  }

  receipt += '\n' + '-'.repeat(40) + '\n';
  receipt += rightAlign(`Subtotal: $${transaction.subtotal.toFixed(2)}`, 40) + '\n';

  if (transaction.discountTotal > 0) {
    receipt += rightAlign(`Discounts: -$${transaction.discountTotal.toFixed(2)}`, 40) + '\n';
  }

  receipt += rightAlign(`Tax: $${transaction.taxTotal.toFixed(2)}`, 40) + '\n';
  receipt += rightAlign(`TOTAL: $${transaction.total.toFixed(2)}`, 40) + '\n\n';

  // Payments
  for (const tender of transaction.tenders) {
    receipt += `${tender.method}: $${tender.amount.toFixed(2)}\n`;
  }

  if (transaction.changeAmount && transaction.changeAmount > 0) {
    receipt += `Change: $${transaction.changeAmount.toFixed(2)}\n`;
  }

  receipt += '\n' + '='.repeat(40) + '\n';
  if (config.footerMessage) {
    receipt += centerText(config.footerMessage, 40) + '\n';
  }

  if (config.includeBarcode) {
    receipt += '\n' + centerText(generateBarcodeText(transaction.transactionId), 40) + '\n';
  }

  return receipt;
}

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
export function generateHTMLReceipt(
  transaction: POSTransaction,
  config: ReceiptConfig
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${transaction.transactionNumber}</title>
  <style>
    body { font-family: monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
    .center { text-align: center; }
    .right { text-align: right; }
    .line-item { display: flex; justify-content: space-between; margin: 5px 0; }
    .divider { border-top: 1px solid #000; margin: 10px 0; }
    .total { font-weight: bold; font-size: 1.2em; }
  </style>
</head>
<body>
  <div class="center">
    <h2>${config.storeName}</h2>
    <p>${config.storeAddress}</p>
    <p>${config.storePhone}</p>
    ${config.taxId ? `<p>Tax ID: ${config.taxId}</p>` : ''}
  </div>

  <div class="divider"></div>

  <p>Date: ${transaction.createdAt.toLocaleString()}</p>
  <p>Transaction: ${transaction.transactionNumber}</p>
  <p>Cashier: ${transaction.cashierId}</p>

  <div class="divider"></div>

  ${transaction.lineItems.map(item => `
    <div class="line-item">
      <span>${item.name}</span>
      <span>$${item.total.toFixed(2)}</span>
    </div>
    <div style="margin-left: 20px;">
      ${item.quantity} x $${item.unitPrice.toFixed(2)}
    </div>
  `).join('')}

  <div class="divider"></div>

  <div class="line-item">
    <span>Subtotal:</span>
    <span>$${transaction.subtotal.toFixed(2)}</span>
  </div>
  <div class="line-item">
    <span>Tax:</span>
    <span>$${transaction.taxTotal.toFixed(2)}</span>
  </div>
  <div class="line-item total">
    <span>TOTAL:</span>
    <span>$${transaction.total.toFixed(2)}</span>
  </div>

  ${config.footerMessage ? `<p class="center">${config.footerMessage}</p>` : ''}
</body>
</html>
  `;
}

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
export function generateJSONReceipt(transaction: POSTransaction): object {
  return {
    receipt: {
      transactionId: transaction.transactionId,
      transactionNumber: transaction.transactionNumber,
      timestamp: transaction.createdAt.toISOString(),
      store: {
        id: transaction.storeId,
        registerId: transaction.registerId,
      },
      items: transaction.lineItems.map(item => ({
        id: item.lineItemId,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        discounts: item.discounts,
        tax: item.taxAmount,
        total: item.total,
      })),
      totals: {
        subtotal: transaction.subtotal,
        discounts: transaction.discountTotal,
        tax: transaction.taxTotal,
        total: transaction.total,
      },
      payments: transaction.tenders.map(tender => ({
        method: tender.method,
        amount: tender.amount,
        reference: tender.reference,
      })),
      change: transaction.changeAmount,
    },
  };
}

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
export function generateEmailReceipt(
  transaction: POSTransaction,
  config: ReceiptConfig,
  customerEmail: string
): {
  to: string;
  subject: string;
  html: string;
} {
  return {
    to: customerEmail,
    subject: `Receipt from ${config.storeName} - ${transaction.transactionNumber}`,
    html: generateHTMLReceipt(transaction, config),
  };
}

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
export function generateBarcodeText(transactionId: string): string {
  // Simplified barcode representation
  return `*${transactionId}*`;
}

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
export function formatReceiptCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

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
export function generateReceiptQRData(
  transaction: POSTransaction,
  baseUrl: string
): string {
  return `${baseUrl}/receipt/${transaction.transactionId}`;
}

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
export function generateReceiptFooter(returnDays: number): string {
  return `
Returns accepted within ${returnDays} days with receipt.
Thank you for shopping with us!
  `.trim();
}

// ============================================================================
// SECTION 6: TRANSACTION UTILITIES (Functions 39-48)
// ============================================================================

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
export function generateTransactionId(): string {
  return `TXN-${crypto.randomUUID()}`;
}

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
export function generateTransactionNumber(storeId: string, registerId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.getTime().toString().slice(-4);
  const storeCode = storeId.replace(/[^A-Z0-9]/g, '');
  const registerCode = registerId.replace(/[^A-Z0-9]/g, '');

  return `${storeCode}-${registerCode}-${dateStr}-${timeStr}`;
}

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
export function searchTransactions(
  transactions: POSTransaction[],
  criteria: TransactionSearchCriteria
): POSTransaction[] {
  return transactions.filter(txn => {
    if (criteria.storeId && txn.storeId !== criteria.storeId) return false;
    if (criteria.registerId && txn.registerId !== criteria.registerId) return false;
    if (criteria.cashierId && txn.cashierId !== criteria.cashierId) return false;
    if (criteria.customerId && txn.customerId !== criteria.customerId) return false;
    if (criteria.status && !criteria.status.includes(txn.status)) return false;
    if (criteria.dateFrom && txn.createdAt < criteria.dateFrom) return false;
    if (criteria.dateTo && txn.createdAt > criteria.dateTo) return false;
    if (criteria.minAmount && txn.total < criteria.minAmount) return false;
    if (criteria.maxAmount && txn.total > criteria.maxAmount) return false;
    if (criteria.transactionNumber && txn.transactionNumber !== criteria.transactionNumber) return false;

    return true;
  });
}

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
export function createTransactionBatch(
  transactions: POSTransaction[],
  storeId: string,
  registerId?: string
): TransactionBatch {
  const sales = transactions.filter(t => t.type === TransactionType.SALE);
  const refunds = transactions.filter(t => t.type === TransactionType.REFUND);
  const voids = transactions.filter(t => t.status === TransactionStatus.VOIDED);

  const totalSales = sales.reduce((sum, t) => sum + t.total, 0);
  const totalRefunds = Math.abs(refunds.reduce((sum, t) => sum + t.total, 0));
  const totalVoids = voids.reduce((sum, t) => sum + t.total, 0);

  const tenderBreakdown: Record<PaymentMethod, number> = {} as any;

  for (const transaction of transactions) {
    for (const tender of transaction.tenders) {
      if (!tenderBreakdown[tender.method]) {
        tenderBreakdown[tender.method] = 0;
      }
      tenderBreakdown[tender.method] += tender.amount;
    }
  }

  return {
    batchId: `BATCH-${crypto.randomUUID()}`,
    storeId,
    registerId,
    openedAt: transactions[0]?.createdAt || new Date(),
    closedAt: new Date(),
    transactions,
    totalSales,
    totalRefunds,
    totalVoids,
    netAmount: totalSales - totalRefunds - totalVoids,
    tenderBreakdown,
  };
}

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
export function calculateBatchStatistics(batch: TransactionBatch): {
  transactionCount: number;
  averageTransactionValue: number;
  largestTransaction: number;
  smallestTransaction: number;
  itemsSold: number;
} {
  const completedTransactions = batch.transactions.filter(
    t => t.status === TransactionStatus.COMPLETED
  );

  const itemsSold = batch.transactions.reduce(
    (sum, t) => sum + t.lineItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const transactionValues = completedTransactions.map(t => t.total);

  return {
    transactionCount: completedTransactions.length,
    averageTransactionValue: batch.netAmount / completedTransactions.length || 0,
    largestTransaction: Math.max(...transactionValues, 0),
    smallestTransaction: Math.min(...transactionValues, 0),
    itemsSold,
  };
}

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
export function exportTransactionsToCSV(transactions: POSTransaction[]): string {
  const headers = [
    'Transaction ID',
    'Transaction Number',
    'Date',
    'Store ID',
    'Register ID',
    'Cashier ID',
    'Customer ID',
    'Type',
    'Status',
    'Subtotal',
    'Tax',
    'Total',
  ];

  let csv = headers.join(',') + '\n';

  for (const txn of transactions) {
    const row = [
      txn.transactionId,
      txn.transactionNumber,
      txn.createdAt.toISOString(),
      txn.storeId,
      txn.registerId,
      txn.cashierId,
      txn.customerId || '',
      txn.type,
      txn.status,
      txn.subtotal.toFixed(2),
      txn.taxTotal.toFixed(2),
      txn.total.toFixed(2),
    ];
    csv += row.join(',') + '\n';
  }

  return csv;
}

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
export function cloneTransaction(transaction: POSTransaction): POSTransaction {
  return JSON.parse(JSON.stringify(transaction));
}

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
export function mergeTransactions(transactions: POSTransaction[]): POSTransaction {
  if (transactions.length === 0) {
    throw new Error('Cannot merge empty transaction array');
  }

  const base = transactions[0];
  const merged: POSTransaction = {
    ...base,
    transactionId: generateTransactionId(),
    lineItems: [],
    tenders: [],
  };

  for (const txn of transactions) {
    merged.lineItems.push(...txn.lineItems);
    merged.tenders.push(...txn.tenders);
  }

  return recalculateTransaction(merged);
}

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
export function splitTransaction(
  transaction: POSTransaction,
  ways: number
): POSTransaction[] {
  const amountPerSplit = transaction.total / ways;
  const splits: POSTransaction[] = [];

  for (let i = 0; i < ways; i++) {
    const split: POSTransaction = {
      ...transaction,
      transactionId: generateTransactionId(),
      transactionNumber: generateTransactionNumber(transaction.storeId, transaction.registerId),
      total: amountPerSplit,
      tenders: [],
      metadata: {
        ...transaction.metadata,
        splitFrom: transaction.transactionId,
        splitIndex: i + 1,
        splitTotal: ways,
      },
    };
    splits.push(split);
  }

  return splits;
}

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
export function validateTransactionIntegrity(transaction: POSTransaction): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Validate totals
  const calculatedSubtotal = transaction.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  if (Math.abs(calculatedSubtotal - transaction.subtotal) > 0.01) {
    issues.push('Subtotal mismatch');
  }

  const calculatedTax = transaction.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  if (Math.abs(calculatedTax - transaction.taxTotal) > 0.01) {
    issues.push('Tax total mismatch');
  }

  const calculatedTotal = transaction.lineItems.reduce((sum, item) => sum + item.total, 0);
  if (Math.abs(calculatedTotal - transaction.total) > 0.01) {
    issues.push('Total mismatch');
  }

  // Validate line items
  for (const item of transaction.lineItems) {
    const expectedSubtotal = item.quantity * item.unitPrice;
    if (Math.abs(expectedSubtotal - item.subtotal) > 0.01) {
      issues.push(`Line item ${item.lineItemId} subtotal mismatch`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Centers text for receipt printing.
 */
function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Helper: Right-aligns text for receipt printing.
 */
function rightAlign(text: string, width: number): string {
  const padding = Math.max(0, width - text.length);
  return ' '.repeat(padding) + text;
}

/**
 * Helper: Calculates total discount for line item.
 */
function calculateLineItemDiscount(
  item: TransactionLineItem,
  discounts: AppliedDiscount[]
): number {
  let total = 0;

  for (const discount of discounts) {
    if (discount.type === 'PERCENTAGE') {
      total += item.subtotal * discount.amount;
    } else if (discount.type === 'FIXED_AMOUNT') {
      total += discount.amount;
    }
  }

  return total;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Transaction Builder
  createTransaction,
  addLineItem,
  removeLineItem,
  updateLineItemQuantity,
  applyLineItemDiscount,
  applyTransactionDiscount,
  recalculateTransaction,
  validateTransaction,

  // Payment Processing
  addPaymentTender,
  processSplitPayment,
  calculateChange,
  validatePaymentTenders,
  completeTransaction,
  authorizePayment,
  capturePayment,
  addTipAdjustment,

  // Refunds and Voids
  voidTransaction,
  createRefundTransaction,
  createPartialRefund,
  createExchangeTransaction,
  validateRefundEligibility,
  calculateRestockingFee,
  issueStoreCredit,
  reverseAuthorization,

  // Tax Calculations
  calculateTax,
  calculateTaxWithJurisdiction,
  calculateCompoundTax,
  calculateReverseTax,
  calculateMultiJurisdictionTax,
  generateTaxReport,

  // Receipt Generation
  generateReceipt,
  generateHTMLReceipt,
  generateJSONReceipt,
  generateEmailReceipt,
  generateBarcodeText,
  formatReceiptCurrency,
  generateReceiptQRData,
  generateReceiptFooter,

  // Transaction Utilities
  generateTransactionId,
  generateTransactionNumber,
  searchTransactions,
  createTransactionBatch,
  calculateBatchStatistics,
  exportTransactionsToCSV,
  cloneTransaction,
  mergeTransactions,
  splitTransaction,
  validateTransactionIntegrity,
};
