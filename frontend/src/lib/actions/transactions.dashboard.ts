/**
 * @fileoverview Transaction Dashboard Analytics Server Actions
 * @module app/transactions/dashboard
 *
 * Provides dashboard statistics and analytics for transaction data.
 */

'use server';

import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import { getTransactions } from './transactions.queries';

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

    const transactionsData = response.data.data;

    // Calculate today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate statistics based on transaction schema properties
    const totalTransactions = transactionsData.length;
    const receivedStock = transactionsData.filter((t: any) => t.type === 'receive').length;
    const issuedStock = transactionsData.filter((t: any) => t.type === 'issue').length;
    const adjustedStock = transactionsData.filter((t: any) => t.type === 'adjust').length;
    const transferredStock = transactionsData.filter((t: any) => t.type === 'transfer').length;
    const pendingTransfers = transactionsData.filter((t: any) => t.type === 'transfer' && t.status === 'pending').length;
    const completedTransfers = transactionsData.filter((t: any) => t.type === 'transfer' && t.status === 'completed').length;

    // Calculate total value
    const totalValue = transactionsData.reduce((sum: number, t: any) => sum + (t.totalValue || 0), 0);
    const averageTransactionValue = totalTransactions > 0 ? totalValue / totalTransactions : 0;

    // Today's transactions
    const todayTransactions = transactionsData.filter((t: any) => {
      const transactionDate = new Date(t.createdAt || new Date());
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    }).length;

    // Calculate transactions by type
    const transactionsByType = {
      receive: receivedStock,
      issue: issuedStock,
      adjust: adjustedStock,
      transfer: transferredStock,
      count: transactionsData.filter((t: any) => t.type === 'count').length,
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

    const transactionsData = response.data.data;

    // Sort transactions by date descending and get recent transactions (last 10)
    const sortedTransactions = [...transactionsData]
      .sort((a: any, b: any) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime())
      .slice(0, 10);

    const recentTransactions = sortedTransactions.map((transaction: any) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      totalValue: transaction.totalValue || 0,
      itemCount: transaction.items?.length || 0,
      location: transaction.location?.name || transaction.locationId || 'Unknown Location',
      user: transaction.performer?.name || transaction.performedBy || 'System',
      timestamp: transaction.createdAt || new Date().toISOString(),
    }));

    // Get high value transactions (top 5 by value)
    const highValueTransactions = transactionsData
      .filter((t: any) => (t.totalValue || 0) > 0)
      .sort((a: any, b: any) => (b.totalValue || 0) - (a.totalValue || 0))
      .slice(0, 5)
      .map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        totalValue: transaction.totalValue || 0,
        itemCount: transaction.items?.length || 0,
        location: transaction.location?.name || transaction.locationId || 'Unknown Location',
        timestamp: transaction.createdAt || new Date().toISOString(),
      }));

    // Get pending transfers
    const pendingTransfers = transactionsData
      .filter((t: any) => t.type === 'transfer' && t.status === 'pending')
      .slice(0, 5)
      .map((transaction: any) => ({
        id: transaction.id,
        fromLocation: transaction.fromLocation?.name || transaction.fromLocationId || 'Unknown',
        toLocation: transaction.toLocation?.name || transaction.toLocationId || 'Unknown',
        itemCount: transaction.items?.length || 0,
        totalValue: transaction.totalValue || 0,
        requestedBy: transaction.performer?.name || transaction.performedBy || 'System',
        timestamp: transaction.createdAt || new Date().toISOString(),
      }));

    // Calculate financial summary
    const inboundTransactions = transactionsData.filter((t: any) => ['receive', 'transfer-in'].includes(t.type));
    const outboundTransactions = transactionsData.filter((t: any) => ['issue', 'transfer-out'].includes(t.type));

    const totalInbound = inboundTransactions.reduce((sum: number, t: any) => sum + (t.totalValue || 0), 0);
    const totalOutbound = outboundTransactions.reduce((sum: number, t: any) => sum + (t.totalValue || 0), 0);
    const netFlow = totalInbound - totalOutbound;
    const averageDailyValue = transactionsData.length > 0 ? stats.totalValue / 30 : 0; // Mock 30-day average

    const financialSummary = {
      totalInbound,
      totalOutbound,
      netFlow,
      averageDailyValue,
    };

    // Calculate location activity
    const locationActivity = transactionsData.reduce((acc: any, transaction: any) => {
      const locationId = transaction.location?.id || transaction.locationId || 'unknown';
      const locationName = transaction.location?.name || transaction.locationId || 'Unknown Location';
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

    const topLocations = (Object.values(locationActivity) as Array<{
      locationId: string;
      locationName: string;
      transactionCount: number;
      totalValue: number;
    }>)
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
