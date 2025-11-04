/**
 * @fileoverview Purchase Order Dashboard Functions
 * @module lib/actions/purchase-orders.dashboard
 *
 * Dashboard statistics and data aggregation functions for purchase order analytics
 * and reporting with HIPAA-compliant audit logging.
 */

'use server';

import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { getPurchaseOrders } from './purchase-orders.cache';

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive purchase orders statistics for dashboard
 * @returns Promise<PurchaseOrdersStats> Statistics object with procurement metrics
 */
export async function getPurchaseOrdersStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  completedOrders: number;
  totalValue: number;
  averageOrderValue: number;
  monthlySpend: number;
  budgetUtilization: number;
  vendorCount: number;
  urgentOrders: number;
  overdueOrders: number;
}> {
  try {
    console.log('[PurchaseOrders] Loading purchase order statistics');

    // Get purchase orders data
    const orders = await getPurchaseOrders();

    // Calculate current month for filtering
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Calculate statistics based on purchase order schema properties
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const approvedOrders = orders.filter(o => o.status === 'approved').length;
    const rejectedOrders = orders.filter(o => o.status === 'cancelled').length; // Using cancelled as rejected equivalent
    const completedOrders = orders.filter(o => o.status === 'received').length; // Using received as completed equivalent
    const totalValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

    // Calculate monthly spend
    const monthlySpend = orders
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= currentMonth;
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Mock budget utilization (would come from budget settings)
    const budgetUtilization = monthlySpend > 0 ? Math.min((monthlySpend / 100000) * 100, 100) : 0;

    // Count unique vendors
    const uniqueVendors = new Set(orders.filter(o => o.vendorId).map(o => o.vendorId));
    const vendorCount = uniqueVendors.size;

    // Calculate urgent and overdue orders
    const urgentOrders = orders.filter(o => o.priority === 'urgent').length;
    const today = new Date();
    const overdueOrders = orders.filter(o => {
      if (!o.requestedDeliveryDate) return false;
      const expectedDate = new Date(o.requestedDeliveryDate);
      return expectedDate < today && o.status !== 'received';
    }).length;

    const stats = {
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      completedOrders,
      totalValue,
      averageOrderValue,
      monthlySpend,
      budgetUtilization,
      vendorCount,
      urgentOrders,
      overdueOrders,
    };

    console.log('[PurchaseOrders] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'purchase_orders_dashboard_stats',
      details: 'Retrieved purchase order dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[PurchaseOrders] Error calculating stats:', error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      approvedOrders: 0,
      rejectedOrders: 0,
      completedOrders: 0,
      totalValue: 0,
      averageOrderValue: 0,
      monthlySpend: 0,
      budgetUtilization: 0,
      vendorCount: 0,
      urgentOrders: 0,
      overdueOrders: 0,
    };
  }
}

/**
 * Get purchase orders dashboard data with recent orders and workflow metrics
 * @returns Promise<PurchaseOrdersDashboardData> Dashboard data with recent orders and approvals
 */
export async function getPurchaseOrdersDashboardData(): Promise<{
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    priority: string;
    total: number;
    vendor: string;
    timestamp: string;
    expectedDelivery?: string;
  }>;
  pendingApprovals: Array<{
    id: string;
    orderNumber: string;
    total: number;
    vendor: string;
    requestedBy: string;
    timestamp: string;
    priority: string;
  }>;
  ordersByStatus: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
  budgetTracking: {
    allocated: number;
    spent: number;
    remaining: number;
    utilizationPercent: number;
  };
  topVendors: Array<{
    vendorId: string;
    vendorName: string;
    orderCount: number;
    totalSpend: number;
  }>;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    rejectedOrders: number;
    completedOrders: number;
    totalValue: number;
    averageOrderValue: number;
    monthlySpend: number;
    budgetUtilization: number;
    vendorCount: number;
    urgentOrders: number;
    overdueOrders: number;
  };
}> {
  try {
    // Get stats and purchase orders data
    const stats = await getPurchaseOrdersStats();
    const orders = await getPurchaseOrders();

    // Sort orders by date descending and get recent orders (last 10)
    const sortedOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentOrders = sortedOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || `PO-${order.id.slice(-6)}`,
      status: order.status,
      priority: order.priority || 'normal',
      total: order.total || 0,
      vendor: order.vendorName || 'Unknown Vendor',
      timestamp: order.createdAt,
      expectedDelivery: order.requestedDeliveryDate,
    }));

    // Get pending approvals
    const pendingApprovals = orders
      .filter(o => o.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `PO-${order.id.slice(-6)}`,
        total: order.total || 0,
        vendor: order.vendorName || 'Unknown Vendor',
        requestedBy: order.requestedByName || 'Unknown User',
        timestamp: order.createdAt,
        priority: order.priority || 'normal',
      }));

    // Calculate orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      approved: orders.filter(o => o.status === 'approved').length,
      rejected: orders.filter(o => o.status === 'cancelled').length, // Using cancelled as rejected
      completed: orders.filter(o => o.status === 'received').length, // Using received as completed
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Mock budget tracking (would come from budget management system)
    const budgetTracking = {
      allocated: 100000, // Mock monthly budget
      spent: stats.monthlySpend,
      remaining: Math.max(0, 100000 - stats.monthlySpend),
      utilizationPercent: stats.budgetUtilization,
    };

    // Calculate top vendors
    const vendorSpending = orders.reduce((acc, order) => {
      if (!order.vendorId) return acc;

      const vendorId = order.vendorId;
      const vendorName = order.vendorName || 'Unknown Vendor';
      const amount = order.total || 0;

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName,
          orderCount: 0,
          totalSpend: 0,
        };
      }

      acc[vendorId].orderCount++;
      acc[vendorId].totalSpend += amount;

      return acc;
    }, {} as Record<string, { vendorId: string; vendorName: string; orderCount: number; totalSpend: number; }>);

    const topVendors = Object.values(vendorSpending)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5);

    const dashboardData = {
      recentOrders,
      pendingApprovals,
      ordersByStatus,
      budgetTracking,
      topVendors,
      stats,
    };

    console.log('[PurchaseOrders] Dashboard data prepared:', {
      recentCount: recentOrders.length,
      pendingCount: pendingApprovals.length,
      topVendorsCount: topVendors.length,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'purchase_orders_dashboard_data',
      details: 'Retrieved purchase order dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[PurchaseOrders] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentOrders: [],
      pendingApprovals: [],
      ordersByStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0,
      },
      budgetTracking: {
        allocated: 0,
        spent: 0,
        remaining: 0,
        utilizationPercent: 0,
      },
      topVendors: [],
      stats: await getPurchaseOrdersStats(), // Will return safe defaults
    };
  }
}
