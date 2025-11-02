/**
 * @fileoverview Next.js App Router Server Actions for Inventory Transactions
 * @module app/transactions/actions
 *
 * Enhanced with HIPAA-compliant audit logging and proper cache management.
 * Handles stock movements, transfers, and transaction management.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  Transaction,
  TransactionWithDetails,
  TransactionFilter,
  ReceiveStock,
  IssueStock,
  AdjustStock,
  ReserveStock,
  ReleaseReservedStock,
  TransferOrder,
  CreateTransferOrder,
  ApproveTransferOrder,
  SendTransferOrder,
  ReceiveTransferOrder,
  CancelTransferOrder,
  TransferOrderWithDetails,
  TransferOrderFilter,
  PhysicalCount,
  TransactionStatistics,
} from '@/schemas/transaction.schemas';

// Common interfaces
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// STOCK RECEIPT OPERATIONS
// ==========================================

/**
 * Receive stock into inventory with HIPAA audit logging
 */
export async function receiveStock(data: ReceiveStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/receive`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ itemId: data.itemId, quantity: data.quantity, locationId: data.locationId }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock received successfully',
    };
  } catch (error) {
    console.error('Failed to receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to receive stock',
    };
  }
}

/**
 * Bulk receive multiple items with HIPAA audit logging
 */
export async function bulkReceiveStock(
  items: ReceiveStock[]
): Promise<ActionResult<Transaction[]>> {

  try {
    const response = await apiClient.post<Transaction[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/receive/bulk`,
      { items }
    );

    await auditLogWithContext({
      userId: items[0]?.performedBy || 'system',
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transactions',
      details: JSON.stringify({ itemCount: items.length, totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0) }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: `Successfully received ${items.length} items`,
    };
  } catch (error) {
    console.error('Failed to bulk receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk receive stock',
    };
  }
}

// ==========================================
// STOCK ISSUE OPERATIONS
// ==========================================

/**
 * Issue stock from inventory with HIPAA audit logging
 */
export async function issueStock(data: IssueStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/issue`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ 
        itemId: data.itemId, 
        quantity: data.quantity, 
        locationId: data.locationId,
        issuedTo: data.issuedTo,
        referenceType: data.referenceType 
      }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    // If controlled substance, revalidate audit trail
    revalidateTag('controlled-substance-audit', 'default');

    return {
      success: true,
      data: response.data,
      message: 'Stock issued successfully',
    };
  } catch (error) {
    console.error('Failed to issue stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to issue stock',
    };
  }
}

// ==========================================
// STOCK ADJUSTMENT OPERATIONS
// ==========================================

/**
 * Adjust stock level with audit logging
 */
export async function adjustStock(data: AdjustStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/adjust`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ 
        itemId: data.itemId, 
        newQuantity: data.newQuantity, 
        locationId: data.locationId,
        reason: data.reason 
      }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock adjusted successfully',
    };
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to adjust stock',
    };
  }
}

// ==========================================
// STOCK RESERVATION OPERATIONS
// ==========================================

/**
 * Reserve stock for future use
 */
export async function reserveStock(data: ReserveStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/reserve`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ 
        itemId: data.itemId, 
        quantity: data.quantity, 
        locationId: data.locationId,
        reservedFor: data.reservedFor 
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Stock reserved successfully',
    };
  } catch (error) {
    console.error('Failed to reserve stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reserve stock',
    };
  }
}

/**
 * Release reserved stock
 */
export async function releaseReservedStock(
  data: ReleaseReservedStock
): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/release`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ 
        itemId: data.itemId, 
        quantity: data.quantity, 
        locationId: data.locationId 
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Reserved stock released successfully',
    };
  } catch (error) {
    console.error('Failed to release stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to release stock',
    };
  }
}

// ==========================================
// TRANSACTION QUERY OPERATIONS
// ==========================================

/**
 * Get transaction by ID
 */
export async function getTransaction(
  transactionId: string
): Promise<ActionResult<TransactionWithDetails>> {
  try {
    const response = await apiClient.get<TransactionWithDetails>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/${transactionId}`
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: transactionId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
    };
  }
}

/**
 * Get transactions with filtering and pagination
 */
export async function getTransactions(
  filter?: TransactionFilter
): Promise<ActionResult<PaginatedResult<TransactionWithDetails>>> {
  try {
    const params: Record<string, string | number | boolean> = {};
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params[key] = value.toISOString();
          } else {
            params[key] = String(value);
          }
        }
      });
    }

    const response = await apiClient.get<PaginatedResult<TransactionWithDetails>>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_transactions',
      details: JSON.stringify(filter),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
}

/**
 * Get transaction statistics for reporting
 */
export async function getTransactionStatistics(
  startDate: Date,
  endDate: Date,
  locationId?: string
): Promise<ActionResult<TransactionStatistics>> {
  try {
    const params: Record<string, string> = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    if (locationId) params.locationId = locationId;

    const response = await apiClient.get<TransactionStatistics>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/transaction-statistics`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify({ startDate, endDate, locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transaction statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
    };
  }
}

// ==========================================
// TRANSFER ORDER OPERATIONS
// ==========================================

/**
 * Create new transfer order with audit logging
 */
export async function createTransferOrder(
  data: CreateTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-orders`,
      data
    );

    await auditLogWithContext({
      userId: data.requestedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'transfer_order',
      resourceId: response.data.id,
      details: JSON.stringify({ 
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        itemCount: data.items.length 
      }),
    });

    revalidateTag('transfer-orders', 'default');
    revalidatePath('/inventory/transfers');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order created successfully',
    };
  } catch (error) {
    console.error('Failed to create transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transfer order',
    };
  }
}

/**
 * Approve transfer order
 */
export async function approveTransferOrder(
  data: ApproveTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-orders/${data.transferOrderId}/approve`,
      data
    );

    await auditLogWithContext({
      userId: data.approvedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'transfer_order',
      resourceId: data.transferOrderId,
      details: JSON.stringify({ itemAdjustments: data.itemAdjustments }),
    });

    revalidateTag('transfer-orders', 'default');
    revalidateTag(`transfer-order-${data.transferOrderId}`, 'default');
    revalidatePath('/inventory/transfers');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order approved successfully',
    };
  } catch (error) {
    console.error('Failed to approve transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve transfer order',
    };
  }
}

/**
 * Physical count operations with variance tracking
 */
export async function performPhysicalCount(
  data: PhysicalCount
): Promise<
  ActionResult<{
    transactionsCreated: number;
    itemsAdjusted: number;
    totalVariance: number;
  }>
> {
  try {
    const response = await apiClient.post<{
      transactionsCreated: number;
      itemsAdjusted: number;
      totalVariance: number;
    }>(
      `${API_ENDPOINTS.INVENTORY.BASE}/physical-count`,
      data
    );

    await auditLogWithContext({
      userId: data.countedBy,
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'physical_count',
      details: JSON.stringify({ 
        locationId: data.locationId,
        itemsAdjusted: response.data.itemsAdjusted,
        totalVariance: response.data.totalVariance,
        countDate: data.countedAt 
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag('inventory-transactions', 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/counts');

    return {
      success: true,
      data: response.data,
      message: `Physical count completed: ${response.data.itemsAdjusted} items adjusted`,
    };
  } catch (error) {
    console.error('Failed to perform physical count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform physical count',
    };
  }
}

/**
 * Get physical count history
 */
export async function getPhysicalCountHistory(
  locationId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<ActionResult<unknown[]>> {
  try {
    const params: Record<string, string> = {};
    if (locationId) params.locationId = locationId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const response = await apiClient.get<unknown[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/physical-count/history`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'physical_count_history',
      details: JSON.stringify({ locationId, startDate, endDate }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch physical count history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch physical count history',
    };
  }
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive transactions statistics for dashboard
 * @returns Promise<TransactionsStats> Statistics object with transaction metrics
 */
export async function getTransactionsStats(): Promise<{
  totalTransactions: number;
  receivedStock: number;
  issuedStock: number;
  adjustedStock: number;
  transferredStock: number;
  pendingTransfers: number;
  completedTransfers: number;
  totalValue: number;
  averageTransactionValue: number;
  todayTransactions: number;
  transactionsByType: {
    receive: number;
    issue: number;
    adjust: number;
    transfer: number;
    count: number;
  };
}> {
  try {
    console.log('[Transactions] Loading transaction statistics');

    // Get transactions data
    const response = await getTransactions();
    if (!response.success || !response.data) {
      throw new Error('Failed to load transactions');
    }

    const transactions = response.data;

    // Calculate today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate statistics based on transaction schema properties
    const totalTransactions = transactions.length;
    const receivedStock = transactions.filter((t: Transaction) => t.type === 'receive').length;
    const issuedStock = transactions.filter((t: Transaction) => t.type === 'issue').length;
    const adjustedStock = transactions.filter((t: Transaction) => t.type === 'adjustment').length;
    const transferredStock = transactions.filter((t: Transaction) => t.type === 'transfer').length;
    const pendingTransfers = transactions.filter((t: Transaction) => t.type === 'transfer' && t.status === 'pending').length;
    const completedTransfers = transactions.filter((t: Transaction) => t.type === 'transfer' && t.status === 'completed').length;

    // Calculate total value
    const totalValue = transactions.reduce((sum: number, t: Transaction) => sum + (t.totalValue || 0), 0);
    const averageTransactionValue = totalTransactions > 0 ? totalValue / totalTransactions : 0;

    // Today's transactions
    const todayTransactions = transactions.filter((t: Transaction) => {
      const transactionDate = new Date(t.createdAt);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    }).length;

    // Calculate transactions by type
    const transactionsByType = {
      receive: receivedStock,
      issue: issuedStock,
      adjust: adjustedStock,
      transfer: transferredStock,
      count: transactions.filter((t: Transaction) => t.type === 'count').length,
    };

    const stats = {
      totalTransactions,
      receivedStock,
      issuedStock,
      adjustedStock,
      transferredStock,
      pendingTransfers,
      completedTransfers,
      totalValue,
      averageTransactionValue,
      todayTransactions,
      transactionsByType,
    };

    console.log('[Transactions] Statistics calculated:', stats);

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'transactions_dashboard_stats',
      details: 'Retrieved transaction dashboard statistics',
    });

    return stats;
  } catch (error) {
    console.error('[Transactions] Error calculating stats:', error);
    return {
      totalTransactions: 0,
      receivedStock: 0,
      issuedStock: 0,
      adjustedStock: 0,
      transferredStock: 0,
      pendingTransfers: 0,
      completedTransfers: 0,
      totalValue: 0,
      averageTransactionValue: 0,
      todayTransactions: 0,
      transactionsByType: {
        receive: 0,
        issue: 0,
        adjust: 0,
        transfer: 0,
        count: 0,
      },
    };
  }
}

/**
 * Get transactions dashboard data with recent transactions and financial insights
 * @returns Promise<TransactionsDashboardData> Dashboard data with transaction flow analysis
 */
export async function getTransactionsDashboardData(): Promise<{
  recentTransactions: Array<{
    id: string;
    type: string;
    status: string;
    totalValue: number;
    itemCount: number;
    location: string;
    user: string;
    timestamp: string;
  }>;
  highValueTransactions: Array<{
    id: string;
    type: string;
    totalValue: number;
    itemCount: number;
    location: string;
    timestamp: string;
  }>;
  pendingTransfers: Array<{
    id: string;
    fromLocation: string;
    toLocation: string;
    itemCount: number;
    totalValue: number;
    requestedBy: string;
    timestamp: string;
  }>;
  financialSummary: {
    totalInbound: number;
    totalOutbound: number;
    netFlow: number;
    averageDailyValue: number;
  };
  locationActivity: Array<{
    locationId: string;
    locationName: string;
    transactionCount: number;
    totalValue: number;
  }>;
  stats: {
    totalTransactions: number;
    receivedStock: number;
    issuedStock: number;
    adjustedStock: number;
    transferredStock: number;
    pendingTransfers: number;
    completedTransfers: number;
    totalValue: number;
    averageTransactionValue: number;
    todayTransactions: number;
    transactionsByType: {
      receive: number;
      issue: number;
      adjust: number;
      transfer: number;
      count: number;
    };
  };
}> {
  try {
    // Get stats and transactions data
    const stats = await getTransactionsStats();
    const response = await getTransactions();
    
    if (!response.success || !response.data) {
      throw new Error('Failed to load transactions');
    }

    const transactions = response.data;

    // Sort transactions by date descending and get recent transactions (last 10)
    const sortedTransactions = transactions
      .sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentTransactions = sortedTransactions.map((transaction: Transaction) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      totalValue: transaction.totalValue || 0,
      itemCount: transaction.items?.length || 0,
      location: transaction.location?.name || 'Unknown Location',
      user: transaction.user?.name || 'System',
      timestamp: transaction.createdAt,
    }));

    // Get high value transactions (top 5 by value)
    const highValueTransactions = transactions
      .filter((t: Transaction) => (t.totalValue || 0) > 0)
      .sort((a: Transaction, b: Transaction) => (b.totalValue || 0) - (a.totalValue || 0))
      .slice(0, 5)
      .map((transaction: Transaction) => ({
        id: transaction.id,
        type: transaction.type,
        totalValue: transaction.totalValue || 0,
        itemCount: transaction.items?.length || 0,
        location: transaction.location?.name || 'Unknown Location',
        timestamp: transaction.createdAt,
      }));

    // Get pending transfers
    const pendingTransfers = transactions
      .filter((t: Transaction) => t.type === 'transfer' && t.status === 'pending')
      .slice(0, 5)
      .map((transaction: Transaction) => ({
        id: transaction.id,
        fromLocation: transaction.fromLocation?.name || 'Unknown',
        toLocation: transaction.toLocation?.name || 'Unknown',
        itemCount: transaction.items?.length || 0,
        totalValue: transaction.totalValue || 0,
        requestedBy: transaction.user?.name || 'System',
        timestamp: transaction.createdAt,
      }));

    // Calculate financial summary
    const inboundTransactions = transactions.filter((t: Transaction) => ['receive', 'transfer-in'].includes(t.type));
    const outboundTransactions = transactions.filter((t: Transaction) => ['issue', 'transfer-out'].includes(t.type));

    const totalInbound = inboundTransactions.reduce((sum: number, t: Transaction) => sum + (t.totalValue || 0), 0);
    const totalOutbound = outboundTransactions.reduce((sum: number, t: Transaction) => sum + (t.totalValue || 0), 0);
    const netFlow = totalInbound - totalOutbound;
    const averageDailyValue = transactions.length > 0 ? stats.totalValue / 30 : 0; // Mock 30-day average

    const financialSummary = {
      totalInbound,
      totalOutbound,
      netFlow,
      averageDailyValue,
    };

    // Calculate location activity
    const locationActivity = transactions.reduce((acc: any, transaction: Transaction) => {
      const locationId = transaction.location?.id || 'unknown';
      const locationName = transaction.location?.name || 'Unknown Location';
      const value = transaction.totalValue || 0;
      
      if (!acc[locationId]) {
        acc[locationId] = {
          locationId,
          locationName,
          transactionCount: 0,
          totalValue: 0,
        };
      }
      
      acc[locationId].transactionCount++;
      acc[locationId].totalValue += value;
      
      return acc;
    }, {} as Record<string, { locationId: string; locationName: string; transactionCount: number; totalValue: number; }>);

    const topLocations = Object.values(locationActivity)
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 5);

    const dashboardData = {
      recentTransactions,
      highValueTransactions,
      pendingTransfers,
      financialSummary,
      locationActivity: topLocations,
      stats,
    };

    console.log('[Transactions] Dashboard data prepared:', {
      recentCount: recentTransactions.length,
      highValueCount: highValueTransactions.length,
      pendingCount: pendingTransfers.length,
    });

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'transactions_dashboard_data',
      details: 'Retrieved transaction dashboard data',
    });

    return dashboardData;
  } catch (error) {
    console.error('[Transactions] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentTransactions: [],
      highValueTransactions: [],
      pendingTransfers: [],
      financialSummary: {
        totalInbound: 0,
        totalOutbound: 0,
        netFlow: 0,
        averageDailyValue: 0,
      },
      locationActivity: [],
      stats: await getTransactionsStats(), // Will return safe defaults
    };
  }
}
