/**
 * Purchase Order Query Hooks
 *
 * Provides comprehensive React Query hooks for fetching purchase order data including:
 * - Purchase orders with filtering and pagination
 * - Line items and order details
 * - Approval workflows and pending approvals
 * - Receipts and receiving history
 * - Vendor quotes and comparisons
 * - Analytics and performance metrics
 * - Dashboard aggregations and reports
 *
 * All queries leverage React Query's caching and automatic revalidation.
 * Cache configuration is defined in PURCHASE_ORDERS_CACHE_CONFIG.
 *
 * @module hooks/domains/purchase-orders/queries
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
  POReceipt,
  POAnalytics,
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
interface POVendorQuote {
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
  
  // Receipts
  getReceipts: async (poId: string): Promise<POReceipt[]> => {
    return [];
  },
  getReceiptById: async (id: string): Promise<POReceipt> => {
    return {} as POReceipt;
  },
  
  // Vendor Quotes
  getVendorQuotes: async (poId: string): Promise<POVendorQuote[]> => {
    return [];
  },
  getVendorQuoteById: async (id: string): Promise<POVendorQuote> => {
    return {} as POVendorQuote;
  },
  
  // Analytics
  getPOAnalytics: async (filters?: any): Promise<POAnalytics> => {
    return {} as POAnalytics;
  },
  getPOSpendingAnalysis: async (timeframe: string): Promise<any> => {
    return {};
  },
  getPOVendorPerformance: async (vendorId?: string): Promise<any[]> => {
    return [];
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

// Receipt Queries
export const useReceipts = (
  poId: string,
  options?: UseQueryOptions<POReceipt[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.receipts(poId),
    queryFn: () => mockPurchaseOrderAPI.getReceipts(poId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!poId,
    ...options,
  });
};

export const useReceiptDetails = (
  id: string,
  options?: UseQueryOptions<POReceipt, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.receiptDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getReceiptById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!id,
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

// Analytics Queries
export const usePOAnalytics = (
  filters?: any,
  options?: UseQueryOptions<POAnalytics, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.analytics(filters),
    queryFn: () => mockPurchaseOrderAPI.getPOAnalytics(filters),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

export const usePOSpendingAnalysis = (
  timeframe: string = 'month',
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.spendingAnalysis(timeframe),
    queryFn: () => mockPurchaseOrderAPI.getPOSpendingAnalysis(timeframe),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

export const usePOVendorPerformance = (
  vendorId?: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.vendorPerformance(vendorId),
    queryFn: () => mockPurchaseOrderAPI.getPOVendorPerformance(vendorId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Dashboard Queries
export const usePODashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['purchase-orders', 'dashboard'],
    queryFn: async () => {
      const [pendingPOs, recentPOs, analytics, pendingApprovals] = await Promise.all([
        mockPurchaseOrderAPI.getPurchaseOrdersByStatus('PENDING'),
        mockPurchaseOrderAPI.getPurchaseOrders({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
        mockPurchaseOrderAPI.getPOAnalytics(),
        mockPurchaseOrderAPI.getApprovalWorkflows({ status: 'PENDING', limit: 5 }),
      ]);

      return {
        pendingPurchaseOrders: pendingPOs,
        recentPurchaseOrders: recentPOs,
        analytics,
        pendingApprovals,
        stats: {
          totalPOs: pendingPOs.length,
          pendingApprovals: pendingApprovals.length,
          totalSpent: analytics.totalSpent || 0,
          averageProcessingTime: analytics.averageProcessingTime || 0,
        },
      };
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Statistics Queries
export const usePOStatistics = (
  timeframe?: 'week' | 'month' | 'quarter' | 'year',
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['purchase-orders', 'statistics', timeframe],
    queryFn: async () => {
      const analytics = await mockPurchaseOrderAPI.getPOAnalytics({ timeframe });
      
      return {
        orderStats: {
          total: analytics.totalOrders || 0,
          approved: analytics.approvedOrders || 0,
          pending: analytics.pendingOrders || 0,
          rejected: analytics.rejectedOrders || 0,
        },
        financialStats: {
          totalSpent: analytics.totalSpent || 0,
          averageOrderValue: analytics.averageOrderValue || 0,
          budgetUtilization: analytics.budgetUtilization || 0,
        },
        processingStats: {
          averageApprovalTime: analytics.averageApprovalTime || 0,
          averageDeliveryTime: analytics.averageDeliveryTime || 0,
          onTimeDeliveryRate: analytics.onTimeDeliveryRate || 0,
        },
        vendorStats: {
          totalVendors: analytics.totalVendors || 0,
          topVendorsBySpend: analytics.topVendorsBySpend || [],
          vendorPerformanceScore: analytics.vendorPerformanceScore || 0,
        },
      };
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Reports Queries
export const usePOReports = (
  type: 'spending' | 'vendor-performance' | 'approval-times' | 'department-analysis',
  filters?: any,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ['purchase-orders', 'reports', type, filters],
    queryFn: async () => {
      switch (type) {
        case 'spending':
          return mockPurchaseOrderAPI.getPOSpendingAnalysis(filters?.timeframe || 'month');
        case 'vendor-performance':
          return mockPurchaseOrderAPI.getPOVendorPerformance(filters?.vendorId);
        case 'approval-times':
          return mockPurchaseOrderAPI.getApprovalWorkflows(filters);
        case 'department-analysis':
          return mockPurchaseOrderAPI.getPurchaseOrders(filters);
        default:
          return [];
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};
