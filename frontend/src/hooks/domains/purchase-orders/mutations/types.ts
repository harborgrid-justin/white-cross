/**
 * Type definitions for Purchase Order Mutations
 *
 * Defines all input types and interfaces used across purchase order mutation hooks.
 * Centralized type definitions ensure consistency and reusability.
 *
 * @module hooks/domains/purchase-orders/mutations/types
 */

import { POLineItem } from '../config';

/**
 * Input data for creating a new purchase order.
 *
 * @interface CreatePurchaseOrderInput
 * @property {string} title - Purchase order title/description
 * @property {string} [description] - Detailed description
 * @property {string} vendorId - Vendor/supplier identifier
 * @property {string} requestedDeliveryDate - Desired delivery date (ISO format)
 * @property {object} shippingAddress - Delivery address
 * @property {object} billingAddress - Billing address
 * @property {POLineItem[]} lineItems - Order line items (min: 1 required)
 * @property {string} paymentTerms - Payment terms (e.g., "Net 30", "COD")
 * @property {string} deliveryTerms - Delivery terms (e.g., "FOB", "CIF")
 * @property {string} [notes] - Additional notes or special instructions
 * @property {string} [budgetCode] - Budget code for accounting
 * @property {string} [projectCode] - Project code for tracking
 * @property {string} [departmentId] - Requesting department
 */
export interface CreatePurchaseOrderInput {
  title: string;
  description?: string;
  vendorId: string;
  requestedDeliveryDate: string;
  shippingAddress: any;
  billingAddress: any;
  lineItems: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>[];
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  budgetCode?: string;
  projectCode?: string;
  departmentId?: string;
}

/**
 * Input data for updating an existing purchase order.
 * Extends CreatePurchaseOrderInput with all fields optional except ID.
 */
export interface UpdatePurchaseOrderInput extends Partial<CreatePurchaseOrderInput> {
  id: string;
}

/**
 * Input data for approving a purchase order.
 *
 * @interface ApprovePurchaseOrderInput
 * @property {string} purchaseOrderId - Purchase order to approve
 * @property {number} approverLevel - Approval level (1 = Manager, 2 = Director, 3 = VP)
 * @property {string} approverId - Approver user ID
 * @property {string} [notes] - Optional approval notes
 */
export interface ApprovePurchaseOrderInput {
  purchaseOrderId: string;
  approverLevel: number;
  approverId: string;
  notes?: string;
}

/**
 * Input data for rejecting a purchase order.
 *
 * @interface RejectPurchaseOrderInput
 * @property {string} purchaseOrderId - Purchase order to reject
 * @property {number} approverLevel - Rejection level
 * @property {string} approverId - Rejector user ID
 * @property {string} rejectionReason - Required reason for rejection
 */
export interface RejectPurchaseOrderInput {
  purchaseOrderId: string;
  approverLevel: number;
  approverId: string;
  rejectionReason: string;
}

/**
 * Input data for creating a receipt when items are received.
 *
 * @interface CreateReceiptInput
 * @property {string} purchaseOrderId - Purchase order being received
 * @property {string} receivedBy - User ID of person receiving items
 * @property {string} receivingLocation - Location where items were received
 * @property {Array} lineItems - Received line items with quantities and condition
 * @property {boolean} [inspectionRequired] - Whether items require inspection
 * @property {string} [notes] - Receiving notes
 * @property {string} [issuesReported] - Any issues or discrepancies
 */
export interface CreateReceiptInput {
  purchaseOrderId: string;
  receivedBy: string;
  receivingLocation: string;
  lineItems: Array<{
    poLineItemId: string;
    quantityReceived: number;
    quantityAccepted: number;
    quantityRejected: number;
    quantityDamaged: number;
    condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM' | 'EXPIRED';
    notes?: string;
    lotNumbers?: string[];
    serialNumbers?: string[];
    expirationDate?: string;
  }>;
  inspectionRequired?: boolean;
  notes?: string;
  issuesReported?: string;
}

/**
 * Type definitions for line item operations
 */
export type AddLineItemInput = {
  poId: string;
  lineItem: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>;
};

export type UpdateLineItemInput = {
  id: string;
  updates: Partial<POLineItem>;
  poId: string;
};

export type RemoveLineItemInput = {
  id: string;
  poId: string;
};

/**
 * Type definitions for receipt operations
 */
export type UpdateReceiptInput = {
  id: string;
  updates: Partial<any>;
  poId: string;
};

/**
 * Type definitions for status operations
 */
export type CancelPurchaseOrderInput = {
  poId: string;
  reason?: string;
};

export type AcknowledgePurchaseOrderInput = {
  poId: string;
  acknowledgedDate: string;
};

/**
 * Type definitions for bulk operations
 */
export type BulkUpdateStatusInput = {
  poIds: string[];
  status: string;
};
