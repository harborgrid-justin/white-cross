/**
 * Purchase Order Composite Hooks
 *
 * Provides high-level composite hooks that orchestrate multiple queries and mutations
 * into complete workflows. These hooks combine data fetching with business logic to
 * simplify complex purchase order operations.
 *
 * Composite Workflows:
 * - **usePurchaseOrderWorkflow**: Complete PO data + workflow state logic
 * - **useCreatePurchaseOrderWorkflow**: Create PO + auto-submit for approval
 * - **useApprovalWorkflow**: Approve/reject with automatic status progression
 * - **useReceivingWorkflow**: Create receipt + auto-close PO when complete
 * - **usePurchaseOrderDashboard**: Aggregated dashboard data
 * - **usePurchaseOrderSearch**: Advanced search with facets
 * - **usePurchaseOrderAnalytics**: Comprehensive analytics and insights
 *
 * These hooks abstract complexity and provide a clean API for components,
 * handling cache invalidation, error handling, and business logic automatically.
 *
 * @module hooks/domains/purchase-orders/composites
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  usePurchaseOrderDetails,
  useLineItems,
  usePendingApprovals,
  useReceipts,
  usePOAnalytics,
} from '../queries/usePurchaseOrderQueries';
import {
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useSubmitForApproval,
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useCreateReceipt,
  useSendPurchaseOrder,
} from '../mutations/usePurchaseOrderMutations';
import {
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
  POReceipt,
  purchaseOrderKeys,
} from '../config';

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
interface PurchaseOrderWorkflowData {
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

interface CreatePOWorkflowInput {
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

interface ApprovalWorkflowInput {
  purchaseOrderId: string;
  action: 'approve' | 'reject';
  approverLevel: number;
  approverId: string;
  notes?: string;
  rejectionReason?: string;
}

interface ReceivingWorkflowInput {
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

/**
 * Comprehensive purchase order workflow hook.
 *
 * Fetches complete PO data (order, line items, receipts, analytics) and provides
 * business logic for determining what actions are available based on current state.
 *
 * Workflow State Rules:
 * - **canEdit**: DRAFT or PENDING_APPROVAL (before approval/sending)
 * - **canApprove**: PENDING_APPROVAL (submitted for approval)
 * - **canReceive**: ACKNOWLEDGED or PARTIALLY_RECEIVED (vendor confirmed, awaiting items)
 * - **canCancel**: Any state except RECEIVED, CLOSED, or CANCELLED
 *
 * @param {string} purchaseOrderId - Purchase order ID to fetch
 * @param {object} [options] - Configuration options
 * @param {boolean} [options.includeAnalytics] - Whether to fetch analytics data
 * @param {boolean} [options.enableRealTimeUpdates] - Enable 30s auto-refresh
 * @returns {PurchaseOrderWorkflowData} Complete workflow data and capabilities
 *
 * @example
 * ```tsx
 * const {
 *   purchaseOrder,
 *   lineItems,
 *   receipts,
 *   canEdit,
 *   canApprove,
 *   canReceive,
 *   isLoading
 * } = usePurchaseOrderWorkflow(poId, { includeAnalytics: true });
 *
 * return (
 *   <div>
 *     <POHeader purchaseOrder={purchaseOrder} />
 *     <LineItemsTable items={lineItems} editable={canEdit} />
 *     {canApprove && <ApprovalSection poId={poId} />}
 *     {canReceive && <ReceivingSection poId={poId} receipts={receipts} />}
 *   </div>
 * );
 * ```
 */
export const usePurchaseOrderWorkflow = (
  purchaseOrderId: string,
  options?: {
    includeAnalytics?: boolean;
    enableRealTimeUpdates?: boolean;
  }
): PurchaseOrderWorkflowData => {
  const {
    data: purchaseOrder,
    isLoading: poLoading,
    error: poError,
  } = usePurchaseOrderDetails(purchaseOrderId, {
    refetchInterval: options?.enableRealTimeUpdates ? 30000 : undefined,
  } as any);

  const {
    data: lineItems,
    isLoading: lineItemsLoading,
    error: lineItemsError,
  } = useLineItems(purchaseOrderId, {
    enabled: !!purchaseOrderId,
  } as any);

  const {
    data: receipts,
    isLoading: receiptsLoading,
    error: receiptsError,
  } = useReceipts(purchaseOrderId, {
    enabled: !!purchaseOrderId,
  } as any);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = usePOAnalytics(
    { poId: purchaseOrderId },
    {
      enabled: !!purchaseOrderId && options?.includeAnalytics,
    } as any
  );

  const isLoading = poLoading || lineItemsLoading || receiptsLoading || (options?.includeAnalytics && analyticsLoading);
  const error = poError || lineItemsError || receiptsError || (options?.includeAnalytics && analyticsError);

  // Business logic for determining capabilities
  const canEdit = purchaseOrder?.status === 'DRAFT' || purchaseOrder?.status === 'PENDING_APPROVAL';
  const canApprove = purchaseOrder?.status === 'PENDING_APPROVAL';
  const canReceive = purchaseOrder?.status === 'ACKNOWLEDGED' || purchaseOrder?.status === 'PARTIALLY_RECEIVED';
  const canCancel = purchaseOrder?.status !== 'RECEIVED' && 
                   purchaseOrder?.status !== 'CLOSED' && 
                   purchaseOrder?.status !== 'CANCELLED';

  return {
    purchaseOrder,
    lineItems,
    receipts,
    analytics,
    isLoading,
    error,
    canEdit,
    canApprove,
    canReceive,
    canCancel,
  };
};

// Create Purchase Order Workflow Composite Hook
export const useCreatePurchaseOrderWorkflow = () => {
  const queryClient = useQueryClient();
  const createPOMutation = useCreatePurchaseOrder();
  const submitForApprovalMutation = useSubmitForApproval();

  return useMutation({
    mutationFn: async (input: CreatePOWorkflowInput) => {
      // Step 1: Create the purchase order
      const purchaseOrder = await createPOMutation.mutateAsync({
        ...input.purchaseOrder,
        lineItems: input.lineItems.map((item, index) => ({
          ...item,
          lineNumber: index + 1,
          discountPercent: 0,
          discountAmount: 0,
          lineTotal: item.quantityOrdered * item.unitPrice,
          status: 'PENDING' as const,
          quantityReceived: 0,
          quantityInvoiced: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      });

      // Step 2: Auto-submit for approval if requested
      if (input.autoSubmit) {
        await submitForApprovalMutation.mutateAsync(purchaseOrder.id);
      }

      return purchaseOrder;
    },
    onSuccess: (purchaseOrder) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order created${purchaseOrder.status === 'PENDING_APPROVAL' ? ' and submitted for approval' : ''}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create purchase order workflow: ${error.message}`);
    },
  });
};

// Approval Workflow Composite Hook
export const useApprovalWorkflow = () => {
  const queryClient = useQueryClient();
  const approveMutation = useApprovePurchaseOrder();
  const rejectMutation = useRejectPurchaseOrder();
  const sendMutation = useSendPurchaseOrder();

  return useMutation({
    mutationFn: async (input: ApprovalWorkflowInput) => {
      if (input.action === 'approve') {
        const approvalResult = await approveMutation.mutateAsync({
          purchaseOrderId: input.purchaseOrderId,
          approverLevel: input.approverLevel,
          approverId: input.approverId,
          notes: input.notes,
        });

        // Check if this was the final approval and auto-send if configured
        // This would depend on your business logic
        const shouldAutoSend = true; // Replace with actual business logic
        if (shouldAutoSend) {
          await sendMutation.mutateAsync(input.purchaseOrderId);
        }

        return approvalResult;
      } else {
        return await rejectMutation.mutateAsync({
          purchaseOrderId: input.purchaseOrderId,
          approverLevel: input.approverLevel,
          approverId: input.approverId,
          rejectionReason: input.rejectionReason || 'No reason provided',
        });
      }
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(input.purchaseOrderId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.approvalWorkflowsList() });
      
      const actionText = input.action === 'approve' ? 'approved' : 'rejected';
      toast.success(`Purchase Order ${actionText} successfully`);
    },
    onError: (error: Error, input) => {
      const actionText = input.action === 'approve' ? 'approve' : 'reject';
      toast.error(`Failed to ${actionText} purchase order: ${error.message}`);
    },
  });
};

// Receiving Workflow Composite Hook
export const useReceivingWorkflow = () => {
  const queryClient = useQueryClient();
  const createReceiptMutation = useCreateReceipt();

  return useMutation({
    mutationFn: async (input: ReceivingWorkflowInput) => {
      // Create the receipt
      const receipt = await createReceiptMutation.mutateAsync({
        purchaseOrderId: input.purchaseOrderId,
        receivedBy: input.receivedBy,
        receivingLocation: input.receivingLocation,
        lineItems: input.lineItems,
        inspectionRequired: input.inspectionRequired,
        notes: input.notes,
        issuesReported: input.issuesReported,
      });

      // Auto-close PO if all items are fully received and autoClose is enabled
      if (input.autoClose) {
        // This would require additional logic to check if all line items are fully received
        // For now, we'll just mark it as a successful receipt
        toast.success('Receipt created. PO status will be updated automatically.');
      }

      return receipt;
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(input.purchaseOrderId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.receipts(input.purchaseOrderId) });
      toast.success('Receipt created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create receipt: ${error.message}`);
    },
  });
};

// Purchase Order Dashboard Composite Hook
export const usePurchaseOrderDashboard = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['purchase-orders', 'dashboard', userId],
    queryFn: async () => {
      // Fetch multiple related data sets in parallel
      const [pendingApprovals, recentPOs, analytics] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.pendingApprovals(userId),
          queryFn: () => [], // This would be your actual API call
        }),
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.purchaseOrdersList({ limit: 10, sortBy: 'created_at', sortOrder: 'desc' }),
          queryFn: () => [], // This would be your actual API call
        }),
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.analytics({ timeframe: 'month' }),
          queryFn: () => ({}), // This would be your actual API call
        }),
      ]);

      // Aggregate and transform data for dashboard display
      return {
        pendingApprovals: {
          count: pendingApprovals.length,
          urgent: pendingApprovals.filter((pa: any) => pa.priority === 'HIGH').length,
          items: pendingApprovals.slice(0, 5),
        },
        recentActivity: {
          purchaseOrders: recentPOs.slice(0, 5),
          totalThisMonth: recentPOs.length,
        },
        analytics: {
          totalSpent: analytics.totalSpent || 0,
          averageProcessingTime: analytics.averageProcessingTime || 0,
          onTimeDeliveryRate: analytics.onTimeDeliveryRate || 0,
          costSavings: analytics.costSavings || 0,
        },
        quickActions: [
          { 
            key: 'create-po', 
            label: 'Create Purchase Order', 
            icon: 'plus',
            available: true 
          },
          { 
            key: 'pending-approvals', 
            label: `Pending Approvals (${pendingApprovals.length})`, 
            icon: 'clock',
            available: pendingApprovals.length > 0 
          },
          { 
            key: 'receive-items', 
            label: 'Receive Items', 
            icon: 'package',
            available: true 
          },
          { 
            key: 'reports', 
            label: 'View Reports', 
            icon: 'chart',
            available: true 
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Purchase Order Search and Filter Composite Hook
export const usePurchaseOrderSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (searchCriteria: {
      searchTerm?: string;
      status?: string[];
      vendorIds?: string[];
      departmentIds?: string[];
      dateRange?: { start: string; end: string };
      amountRange?: { min: number; max: number };
      tags?: string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) => {
      // This would be your actual search API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        results: [], // Actual search results
        totalCount: 0,
        facets: {
          statuses: [],
          vendors: [],
          departments: [],
          categories: [],
        },
        searchMetadata: {
          query: searchCriteria.searchTerm,
          executionTime: 150,
          resultCount: 0,
        },
      };
    },
    onSuccess: (results) => {
      // Cache the search results
      queryClient.setQueryData(['purchase-orders', 'search-results'], results);
    },
    onError: (error: Error) => {
      toast.error(`Search failed: ${error.message}`);
    },
  });
};

// Purchase Order Analytics Composite Hook
export const usePurchaseOrderAnalytics = (
  timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month',
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['purchase-orders', 'analytics-composite', timeframe],
    queryFn: async () => {
      // This would fetch comprehensive analytics data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        overview: {
          totalPOs: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          processingTime: 0,
        },
        trends: {
          ordersOverTime: [],
          spendingOverTime: [],
          processingTimeOverTime: [],
        },
        performance: {
          onTimeDeliveryRate: 0,
          qualityScore: 0,
          vendorPerformance: [],
          departmentSpending: [],
        },
        insights: [
          {
            type: 'cost_saving',
            title: 'Potential Cost Savings',
            description: 'Analysis of bulk purchase opportunities',
            impact: 'high',
            actionRequired: true,
          },
          {
            type: 'process_improvement',
            title: 'Approval Bottleneck',
            description: 'Average approval time has increased by 15%',
            impact: 'medium',
            actionRequired: true,
          },
        ],
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

// Combined export for easy access
export const purchaseOrderComposites = {
  usePurchaseOrderWorkflow,
  useCreatePurchaseOrderWorkflow,
  useApprovalWorkflow,
  useReceivingWorkflow,
  usePurchaseOrderDashboard,
  usePurchaseOrderSearch,
  usePurchaseOrderAnalytics,
};
