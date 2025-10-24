/**
 * Purchase Orders Configuration and Type Definitions
 *
 * Provides centralized configuration, type definitions, query key factory,
 * and utility functions for the purchase orders domain.
 *
 * Includes:
 * - React Query key factory for cache management
 * - Cache configuration constants
 * - TypeScript interfaces for all PO entities
 * - Utility functions for PO operations
 * - Status workflow helpers
 *
 * @module hooks/domains/purchase-orders/config
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query keys factory for purchase orders domain.
 *
 * Provides hierarchical query keys for React Query cache management.
 * Keys are structured to enable granular invalidation and efficient caching.
 *
 * @constant purchaseOrderKeys
 * @example
 * ```ts
 * // Invalidate all purchase order queries
 * queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
 *
 * // Invalidate specific PO details
 * queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails('po-123') });
 *
 * // Fetch pending approvals for user
 * useQuery({ queryKey: purchaseOrderKeys.pendingApprovals(userId), ... });
 * ```
 */
export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  
  // Purchase Orders
  purchaseOrdersList: (filters?: any) => [...purchaseOrderKeys.all, 'list', filters] as const,
  purchaseOrderDetails: (id: string) => [...purchaseOrderKeys.all, 'detail', id] as const,
  purchaseOrdersByStatus: (status: string) => [...purchaseOrderKeys.all, 'by-status', status] as const,
  purchaseOrdersByDepartment: (departmentId: string) => [...purchaseOrderKeys.all, 'by-department', departmentId] as const,
  
  // Line Items
  lineItems: (poId: string) => [...purchaseOrderKeys.all, 'line-items', poId] as const,
  lineItemDetails: (id: string) => [...purchaseOrderKeys.all, 'line-item-detail', id] as const,
  
  // Approval Workflows
  approvalWorkflowsList: (filters?: any) => [...purchaseOrderKeys.all, 'approval-workflows', filters] as const,
  approvalWorkflowDetails: (id: string) => [...purchaseOrderKeys.all, 'approval-workflow-detail', id] as const,
  pendingApprovals: (userId: string) => [...purchaseOrderKeys.all, 'pending-approvals', userId] as const,
  
  // Receipts
  receipts: (poId: string) => [...purchaseOrderKeys.all, 'receipts', poId] as const,
  receiptDetails: (id: string) => [...purchaseOrderKeys.all, 'receipt-detail', id] as const,
  
  // Vendor Quotes
  vendorQuotes: (poId: string) => [...purchaseOrderKeys.all, 'vendor-quotes', poId] as const,
  vendorQuoteDetails: (id: string) => [...purchaseOrderKeys.all, 'vendor-quote-detail', id] as const,
  
  // Analytics
  analytics: (filters?: any) => [...purchaseOrderKeys.all, 'analytics', filters] as const,
  spendingAnalysis: (timeframe: string) => [...purchaseOrderKeys.all, 'spending-analysis', timeframe] as const,
  vendorPerformance: (vendorId?: string) => [...purchaseOrderKeys.all, 'vendor-performance', vendorId] as const,
  
  // Documents
  documents: (poId: string) => [...purchaseOrderKeys.all, 'documents', poId] as const,
} as const;

/**
 * Cache configuration for purchase order queries.
 *
 * Stale times determine how long data remains fresh before refetching:
 * - Approvals: 2min (time-sensitive, needs frequent updates)
 * - PO details: 10min (moderate update frequency)
 * - Receipts: 15min (infrequent changes after creation)
 * - Default: 5min (general queries)
 *
 * @constant PURCHASE_ORDERS_CACHE_CONFIG
 */
export const PURCHASE_ORDERS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  PO_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  APPROVALS_STALE_TIME: 2 * 60 * 1000, // 2 minutes - critical for workflow
  RECEIPTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Complete purchase order entity.
 *
 * Represents a purchase order through its entire lifecycle from draft to closed.
 *
 * Status Workflow:
 * DRAFT → PENDING_APPROVAL → APPROVED → SENT → ACKNOWLEDGED →
 * PARTIALLY_RECEIVED / RECEIVED → CLOSED
 *
 * Can transition to CANCELLED from any non-terminal state.
 *
 * @interface PurchaseOrder
 */
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';
  
  // Vendor Information
  vendorId: string;
  vendorName: string;
  vendorContact: POContact;
  
  // Financial Information
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  
  // Dates
  orderDate: string;
  requestedDeliveryDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  
  // Shipping Information
  shippingAddress: POAddress;
  billingAddress: POAddress;
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'OVERNIGHT' | 'FREIGHT' | 'PICKUP';
  trackingNumber?: string;
  
  // Line Items
  lineItems: POLineItem[];
  
  // Approval Workflow
  approvalWorkflow: POApprovalWorkflow;
  currentApprovalLevel: number;
  
  // Terms and Conditions
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  internalNotes?: string;
  
  // Compliance and Audit
  budgetCode?: string;
  projectCode?: string;
  departmentId?: string;
  
  // System Information
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface POContact {
  name: string;
  email: string;
  phone?: string;
  title?: string;
}

export interface POAddress {
  name?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface POLineItem {
  id: string;
  lineNumber: number;
  
  // Product Information
  productId?: string;
  sku?: string;
  description: string;
  category: string;
  
  // Quantities
  quantityOrdered: number;
  quantityReceived: number;
  quantityInvoiced: number;
  unit: string;
  
  // Pricing
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
  
  // Delivery
  requestedDeliveryDate: string;
  actualDeliveryDate?: string;
  
  // Status
  status: 'PENDING' | 'ACKNOWLEDGED' | 'BACKORDERED' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';
  
  // Additional Information
  manufacturerPartNumber?: string;
  vendorPartNumber?: string;
  notes?: string;
  
  // Compliance
  requiresInspection: boolean;
  hazardousMaterial: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface POApprovalWorkflow {
  levels: POApprovalLevel[];
  currentLevel: number;
  overallStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  completedAt?: string;
}

export interface POApprovalLevel {
  level: number;
  approverType: 'USER' | 'ROLE' | 'DEPARTMENT';
  approverIds: string[];
  approverNames: string[];
  requiredApprovals: number;
  
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  approvedBy?: string[];
  rejectedBy?: string;
  rejectionReason?: string;
  
  approvedAt?: string;
  rejectedAt?: string;
  
  // Thresholds
  amountThreshold?: number;
  requiresAllApprovers: boolean;
}

export interface POReceipt {
  id: string;
  purchaseOrderId: string;
  receiptNumber: string;
  
  // Receiving Information
  receivedBy: string;
  receivedDate: string;
  receivingLocation: string;
  
  // Status
  status: 'PARTIAL' | 'COMPLETE' | 'OVER_RECEIVED' | 'DAMAGED' | 'REJECTED';
  
  // Line Items
  lineItems: POReceiptLineItem[];
  
  // Quality Control
  inspectionRequired: boolean;
  inspectionStatus?: 'PENDING' | 'PASSED' | 'FAILED' | 'CONDITIONAL';
  inspectedBy?: string;
  inspectionDate?: string;
  inspectionNotes?: string;
  
  // Documents
  packingSlip?: string;
  deliveryNote?: string;
  photos: string[];
  
  // Notes
  notes?: string;
  issuesReported?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface POReceiptLineItem {
  id: string;
  poLineItemId: string;
  
  // Quantities
  quantityOrdered: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  quantityDamaged: number;
  
  // Quality
  condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM' | 'EXPIRED';
  notes?: string;
  
  // Lot/Serial Information
  lotNumbers: string[];
  serialNumbers: string[];
  expirationDate?: string;
  
  createdAt: string;
}

export interface PODocument {
  id: string;
  purchaseOrderId: string;
  type: 'PURCHASE_ORDER' | 'QUOTE' | 'CONTRACT' | 'RECEIPT' | 'INVOICE' | 'PACKING_SLIP' | 'OTHER';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  version: number;
  isLatestVersion: boolean;
  
  uploadedBy: string;
  uploadedAt: string;
  
  // Approval/Review
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  
  // Metadata
  tags: string[];
  description?: string;
}

export interface POAnalytics {
  poId: string;
  
  // Performance Metrics
  cycleTime: {
    orderToApproval: number;
    approvalToSent: number;
    sentToAcknowledged: number;
    acknowledgedToReceived: number;
    totalCycleTime: number;
  };
  
  // Cost Analysis
  costVariance: {
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
  };
  
  // Delivery Performance
  deliveryPerformance: {
    requestedDate: string;
    promisedDate?: string;
    actualDate?: string;
    daysEarly: number;
    daysLate: number;
    onTimeDelivery: boolean;
  };
  
  // Quality Metrics
  qualityMetrics: {
    totalItemsOrdered: number;
    itemsReceived: number;
    itemsAccepted: number;
    itemsRejected: number;
    defectRate: number;
  };
  
  // Vendor Performance Impact
  vendorImpact: {
    vendorRating: number;
    impactOnRating: number;
    performanceCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  };
}

/**
 * Invalidates all purchase order related queries in React Query cache.
 *
 * If poId is provided, invalidates specific PO queries. Otherwise invalidates
 * all PO queries globally.
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} [poId] - Optional specific PO ID to invalidate
 *
 * @example
 * ```ts
 * // Invalidate specific PO after update
 * invalidatePOQueries(queryClient, 'po-123');
 *
 * // Invalidate all PO queries after bulk operation
 * invalidatePOQueries(queryClient);
 * ```
 */
export const invalidatePOQueries = (queryClient: QueryClient, poId?: string) => {
  if (poId) {
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.receipts(poId) });
  }
  queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
};

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

export const canEditPO = (status: PurchaseOrder['status']): boolean => {
  return ['DRAFT', 'PENDING_APPROVAL'].includes(status);
};

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
