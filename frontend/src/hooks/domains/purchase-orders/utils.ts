/**
 * Purchase Orders Utility Functions
 *
 * Helper functions for purchase order operations, status management,
 * and calculations.
 *
 * @module hooks/domains/purchase-orders/utils
 */

import { PurchaseOrder, POLineItem } from './types';

/**
 * Calculates purchase order totals from line items.
 *
 * Formula: subtotal = sum of all line totals
 *
 * @param {POLineItem[]} lineItems - Array of line items to calculate
 * @returns Object with subtotal, item count, and total quantity
 *
 * @example
 * ```ts
 * const totals = calculatePOTotals(lineItems);
 * // { subtotal: 15000, itemCount: 5, totalQuantity: 250 }
 * ```
 */
export const calculatePOTotals = (lineItems: POLineItem[]) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    subtotal,
    itemCount: lineItems.length,
    totalQuantity: lineItems.reduce((sum, item) => sum + item.quantityOrdered, 0),
  };
};

/**
 * Gets the color associated with a purchase order status.
 *
 * @param {PurchaseOrder['status']} status - PO status
 * @returns {string} Color name for the status
 */
export const getPOStatusColor = (status: PurchaseOrder['status']): string => {
  const statusColors = {
    DRAFT: 'gray',
    PENDING_APPROVAL: 'yellow',
    APPROVED: 'blue',
    SENT: 'purple',
    ACKNOWLEDGED: 'indigo',
    PARTIALLY_RECEIVED: 'orange',
    RECEIVED: 'green',
    CLOSED: 'gray',
    CANCELLED: 'red',
  };
  return statusColors[status] || 'gray';
};

/**
 * Checks if a purchase order can be edited based on its status.
 *
 * @param {PurchaseOrder['status']} status - PO status
 * @returns {boolean} True if PO can be edited
 */
export const canEditPO = (status: PurchaseOrder['status']): boolean => {
  return ['DRAFT', 'PENDING_APPROVAL'].includes(status);
};

/**
 * Checks if a purchase order can be cancelled based on its status.
 *
 * @param {PurchaseOrder['status']} status - PO status
 * @returns {boolean} True if PO can be cancelled
 */
export const canCancelPO = (status: PurchaseOrder['status']): boolean => {
  return !['RECEIVED', 'CLOSED', 'CANCELLED'].includes(status);
};

/**
 * Determines the next status in the purchase order workflow.
 *
 * Workflow progression:
 * DRAFT → PENDING_APPROVAL → APPROVED → SENT → ACKNOWLEDGED →
 * PARTIALLY_RECEIVED → RECEIVED → CLOSED
 *
 * Returns null for terminal states (CLOSED, CANCELLED) or invalid states.
 *
 * @param {PurchaseOrder['status']} currentStatus - Current PO status
 * @returns {PurchaseOrder['status'] | null} Next status or null if terminal
 *
 * @example
 * ```ts
 * const next = getNextPOStatus('APPROVED'); // Returns 'SENT'
 * const terminal = getNextPOStatus('CLOSED'); // Returns null
 * ```
 */
export const getNextPOStatus = (currentStatus: PurchaseOrder['status']): PurchaseOrder['status'] | null => {
  const statusFlow: Record<PurchaseOrder['status'], PurchaseOrder['status'] | null> = {
    DRAFT: 'PENDING_APPROVAL',
    PENDING_APPROVAL: 'APPROVED',
    APPROVED: 'SENT',
    SENT: 'ACKNOWLEDGED',
    ACKNOWLEDGED: 'PARTIALLY_RECEIVED',
    PARTIALLY_RECEIVED: 'RECEIVED',
    RECEIVED: 'CLOSED',
    CLOSED: null,
    CANCELLED: null,
  };
  return statusFlow[currentStatus] || null;
};
