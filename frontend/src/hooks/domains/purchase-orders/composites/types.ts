/**
 * Type definitions for Purchase Order Composite Hooks
 *
 * @module hooks/domains/purchase-orders/composites/types
 */

import { PurchaseOrder, POLineItem, POReceipt } from '../config';

/**
 * Comprehensive purchase order workflow data and capabilities.
 *
 * @interface PurchaseOrderWorkflowData
 * @property {PurchaseOrder} [purchaseOrder] - Purchase order details
 * @property {POLineItem[]} [lineItems] - Order line items
 * @property {POReceipt[]} [receipts] - Receiving receipts
 * @property {any} analytics - Order analytics data
 * @property {boolean} isLoading - Loading state across all queries
 * @property {Error | null} error - Error from any query
 * @property {boolean} canEdit - Whether PO can be edited (DRAFT or PENDING_APPROVAL)
 * @property {boolean} canApprove - Whether PO can be approved (PENDING_APPROVAL)
 * @property {boolean} canReceive - Whether items can be received (ACKNOWLEDGED/PARTIALLY_RECEIVED)
 * @property {boolean} canCancel - Whether PO can be cancelled
 */
export interface PurchaseOrderWorkflowData {
  purchaseOrder: PurchaseOrder | undefined;
  lineItems: POLineItem[] | undefined;
  receipts: POReceipt[] | undefined;
  analytics: any;
  isLoading: boolean;
  error: Error | null;
  canEdit: boolean;
  canApprove: boolean;
  canReceive: boolean;
  canCancel: boolean;
}

export interface CreatePOWorkflowInput {
  purchaseOrder: {
    title: string;
    description?: string;
    vendorId: string;
    requestedDeliveryDate: string;
    shippingAddress: any;
    billingAddress: any;
    paymentTerms: string;
    deliveryTerms: string;
    notes?: string;
    budgetCode?: string;
    projectCode?: string;
    departmentId?: string;
  };
  lineItems: Array<{
    description: string;
    category: string;
    quantityOrdered: number;
    unit: string;
    unitPrice: number;
    requestedDeliveryDate: string;
    manufacturerPartNumber?: string;
    vendorPartNumber?: string;
    notes?: string;
    requiresInspection: boolean;
    hazardousMaterial: boolean;
  }>;
  autoSubmit?: boolean;
}

export interface ApprovalWorkflowInput {
  purchaseOrderId: string;
  action: 'approve' | 'reject';
  approverLevel: number;
  approverId: string;
  notes?: string;
  rejectionReason?: string;
}

export interface ReceivingWorkflowInput {
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
  autoClose?: boolean;
}
