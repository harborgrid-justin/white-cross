/**
 * Purchase Orders Query Keys Factory
 *
 * Provides hierarchical query keys for React Query cache management.
 * Keys are structured to enable granular invalidation and efficient caching.
 *
 * @module hooks/domains/purchase-orders/query-keys
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
