/**
 * Mock API Functions for Purchase Order Mutations
 *
 * This module contains mock API functions that simulate backend operations.
 * In production, these should be replaced with actual API calls to your backend.
 *
 * @module hooks/domains/purchase-orders/mutations/api
 */

import {
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
  POReceipt,
} from '../config';
import {
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  ApprovePurchaseOrderInput,
  RejectPurchaseOrderInput,
  CreateReceiptInput,
} from './types';

/**
 * Mock API functions for purchase order mutations.
 * Replace with actual API client implementation.
 */
export const mockPurchaseOrderMutationAPI = {
  // Purchase Order CRUD
  createPurchaseOrder: async (data: CreatePurchaseOrderInput): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...data, id: 'new-po-id' } as PurchaseOrder;
  },

  updatePurchaseOrder: async (data: UpdatePurchaseOrderInput): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return data as PurchaseOrder;
  },

  deletePurchaseOrder: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  duplicatePurchaseOrder: async (id: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { id: 'duplicated-po-id' } as PurchaseOrder;
  },

  // Line Items
  addLineItem: async (
    poId: string,
    lineItem: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<POLineItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...lineItem, id: 'new-line-item-id' } as POLineItem;
  },

  updateLineItem: async (id: string, updates: Partial<POLineItem>): Promise<POLineItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...updates, id } as POLineItem;
  },

  removeLineItem: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Approval Workflow
  approvePurchaseOrder: async (data: ApprovePurchaseOrderInput): Promise<POApprovalWorkflow> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as POApprovalWorkflow;
  },

  rejectPurchaseOrder: async (data: RejectPurchaseOrderInput): Promise<POApprovalWorkflow> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as POApprovalWorkflow;
  },

  submitForApproval: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'PENDING_APPROVAL' } as PurchaseOrder;
  },

  cancelPurchaseOrder: async (poId: string, reason?: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'CANCELLED' } as PurchaseOrder;
  },

  // Receipts
  createReceipt: async (data: CreateReceiptInput): Promise<POReceipt> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...data, id: 'new-receipt-id' } as POReceipt;
  },

  updateReceipt: async (id: string, updates: Partial<POReceipt>): Promise<POReceipt> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...updates, id } as POReceipt;
  },

  // Status Updates
  sendPurchaseOrder: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'SENT' } as PurchaseOrder;
  },

  acknowledgePurchaseOrder: async (poId: string, acknowledgedDate: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'ACKNOWLEDGED' } as PurchaseOrder;
  },

  closePurchaseOrder: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'CLOSED' } as PurchaseOrder;
  },

  // Bulk Operations
  bulkUpdateStatus: async (poIds: string[], status: string): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return poIds.map(id => ({ id, status } as PurchaseOrder));
  },

  bulkDelete: async (poIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  // Export
  exportPurchaseOrders: async (filters?: any): Promise<{ downloadUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { downloadUrl: 'https://example.com/export/purchase-orders.xlsx' };
  },
};
