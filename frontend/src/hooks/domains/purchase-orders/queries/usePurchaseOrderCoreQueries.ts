/**
 * Core Purchase Order Query Hooks
 *
 * Provides React Query hooks for basic purchase order operations:
 * - Purchase orders with filtering and pagination
 * - Line items and order details
 * - Approval workflows and pending approvals
 * - Vendor quotes and comparisons
 *
 * @module hooks/domains/purchase-orders/queries/core
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
} from '../config';

/**
 * Vendor quote data structure for purchase order comparisons.
 *
 * @interface POVendorQuote
 * @property {string} id - Unique quote identifier
 * @property {string} purchaseOrderId - Associated purchase order ID
 * @property {string} vendorId - Vendor identifier
 * @property {string} vendorName - Vendor display name
 * @property {string} quoteNumber - Vendor's quote/proposal number
 * @property {number} totalAmount - Total quoted amount
 * @property {string} validUntil - Quote expiration date (ISO format)
 * @property {string} status - Quote status (PENDING, ACCEPTED, REJECTED, EXPIRED)
 * @property {POLineItem[]} lineItems - Quoted line items with pricing
 * @property {string} [notes] - Additional quote notes or terms
 * @property {string} createdAt - Quote creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */
export interface POVendorQuote {
  id: string;
  purchaseOrderId: string;
  vendorId: string;
  vendorName: string;
  quoteNumber: string;
  totalAmount: number;
  validUntil: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  lineItems: POLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock API functions (replace with actual API calls)
const mockPurchaseOrderAPI = {
  // Purchase Order Management
  getPurchaseOrders: async (filters?: any): Promise<PurchaseOrder[]> => {
    return [];
  },
  getPurchaseOrderById: async (id: string): Promise<PurchaseOrder> => {
    return {} as PurchaseOrder;
  },
  getPurchaseOrdersByStatus: async (status: string): Promise<PurchaseOrder[]> => {
    return [];
  },
  getPurchaseOrdersByDepartment: async (departmentId: string): Promise<PurchaseOrder[]> => {
    return [];
  },

  // Line Items
  getLineItems: async (poId: string): Promise<POLineItem[]> => {
    return [];
  },
  getLineItemById: async (id: string): Promise<POLineItem> => {
    return {} as POLineItem;
  },

  // Approval Workflow
  getApprovalWorkflows: async (filters?: any): Promise<POApprovalWorkflow[]> => {
    return [];
  },
  getApprovalWorkflowById: async (id: string): Promise<POApprovalWorkflow> => {
    return {} as POApprovalWorkflow;
  },
  getPendingApprovals: async (userId: string): Promise<POApprovalWorkflow[]> => {
    return [];
  },

  // Vendor Quotes
  getVendorQuotes: async (poId: string): Promise<POVendorQuote[]> => {
    return [];
  },
  getVendorQuoteById: async (id: string): Promise<POVendorQuote> => {
    return {} as POVendorQuote;
  },
};

// Purchase Order Queries
export const usePurchaseOrders = (
  filters?: any,
  options?: UseQueryOptions<PurchaseOrder[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.purchaseOrdersList(filters),
    queryFn: () => mockPurchaseOrderAPI.getPurchaseOrders(filters),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.PO_STALE_TIME,
    ...options,
  });
};

export const usePurchaseOrderDetails = (
  id: string,
  options?: UseQueryOptions<PurchaseOrder, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.purchaseOrderDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getPurchaseOrderById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.PO_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const usePurchaseOrdersByStatus = (
  status: string,
  options?: UseQueryOptions<PurchaseOrder[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.purchaseOrdersByStatus(status),
    queryFn: () => mockPurchaseOrderAPI.getPurchaseOrdersByStatus(status),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.PO_STALE_TIME,
    enabled: !!status,
    ...options,
  });
};

export const usePurchaseOrdersByDepartment = (
  departmentId: string,
  options?: UseQueryOptions<PurchaseOrder[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.purchaseOrdersByDepartment(departmentId),
    queryFn: () => mockPurchaseOrderAPI.getPurchaseOrdersByDepartment(departmentId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.PO_STALE_TIME,
    enabled: !!departmentId,
    ...options,
  });
};

// Line Item Queries
export const useLineItems = (
  poId: string,
  options?: UseQueryOptions<POLineItem[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.lineItems(poId),
    queryFn: () => mockPurchaseOrderAPI.getLineItems(poId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!poId,
    ...options,
  });
};

export const useLineItemDetails = (
  id: string,
  options?: UseQueryOptions<POLineItem, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.lineItemDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getLineItemById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

// Approval Workflow Queries
export const useApprovalWorkflows = (
  filters?: any,
  options?: UseQueryOptions<POApprovalWorkflow[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.approvalWorkflowsList(filters),
    queryFn: () => mockPurchaseOrderAPI.getApprovalWorkflows(filters),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.APPROVALS_STALE_TIME,
    ...options,
  });
};

export const useApprovalWorkflowDetails = (
  id: string,
  options?: UseQueryOptions<POApprovalWorkflow, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.approvalWorkflowDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getApprovalWorkflowById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.APPROVALS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook for fetching pending approvals assigned to a specific user.
 *
 * Automatically refetches every 30 seconds to ensure real-time approval visibility.
 * Critical for approval workflows where timely action is required.
 *
 * Purchase Order Workflow States:
 * - DRAFT → PENDING_APPROVAL (via submitForApproval)
 * - PENDING_APPROVAL → APPROVED (via approve)
 * - PENDING_APPROVAL → REJECTED (via reject)
 * - APPROVED → SENT (via sendToVendor)
 * - SENT → ACKNOWLEDGED (vendor confirms)
 * - ACKNOWLEDGED → RECEIVED (items received)
 * - RECEIVED → CLOSED (order complete)
 *
 * Approval Levels:
 * - Level 1: Manager approval (typically < $5,000)
 * - Level 2: Director approval (typically $5,000 - $25,000)
 * - Level 3: VP approval (typically > $25,000)
 *
 * @param {string} userId - User ID to fetch pending approvals for
 * @param {UseQueryOptions} [options] - React Query options for customization
 * @returns React Query result with pending approval workflows
 *
 * @example
 * ```tsx
 * const { data: pendingApprovals, isLoading } = usePendingApprovals(currentUserId);
 *
 * return (
 *   <div>
 *     <h2>Pending Approvals ({pendingApprovals?.length || 0})</h2>
 *     {pendingApprovals?.map(approval => (
 *       <ApprovalCard
 *         key={approval.id}
 *         approval={approval}
 *         onApprove={handleApprove}
 *         onReject={handleReject}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const usePendingApprovals = (
  userId: string,
  options?: UseQueryOptions<POApprovalWorkflow[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.pendingApprovals(userId),
    queryFn: () => mockPurchaseOrderAPI.getPendingApprovals(userId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.APPROVALS_STALE_TIME,
    enabled: !!userId,
    refetchInterval: 30000, // Refresh every 30 seconds for pending approvals
    ...options,
  });
};

// Vendor Quote Queries
export const useVendorQuotes = (
  poId: string,
  options?: UseQueryOptions<POVendorQuote[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.vendorQuotes(poId),
    queryFn: () => mockPurchaseOrderAPI.getVendorQuotes(poId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!poId,
    ...options,
  });
};

export const useVendorQuoteDetails = (
  id: string,
  options?: UseQueryOptions<POVendorQuote, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.vendorQuoteDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getVendorQuoteById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};
