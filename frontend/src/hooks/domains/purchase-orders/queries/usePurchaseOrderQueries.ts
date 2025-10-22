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

// Additional interfaces needed for queries
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
