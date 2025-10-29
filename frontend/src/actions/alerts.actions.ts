/**
 * @fileoverview Server Actions for Inventory Alerts and Reports
 * @module actions/alerts
 *
 * Next.js Server Actions for low-stock alerts, expiration monitoring,
 * reorder recommendations, and inventory reporting.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  LowStockAlert,
  ExpirationAlert,
  ReorderRecommendation,
  BulkReorderRecommendations,
  StockTransferRecommendation,
  StockLevelReport,
  TransactionSummaryReport,
  ExpirationReport,
  VarianceReport,
  InventoryDashboardStats,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
} from '@/schemas/stock.schemas';
import type { ActionResult } from './inventory.actions';

// ==========================================
// ALERT OPERATIONS
// ==========================================

/**
 * Get low stock alerts
 */
export async function getLowStockAlerts(
  locationId?: string
): Promise<ActionResult<LowStockAlert[]>> {
  try {
    const params = locationId ? `?locationId=${locationId}` : '';
    const response = await apiClient.get<LowStockAlert[]>(
      `${API_ENDPOINTS.INVENTORY.ALERTS}/low-stock${params}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch low stock alerts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch low stock alerts',
    };
  }
}

/**
 * Get expiration alerts
 */
export async function getExpirationAlerts(
  daysAhead = 90,
  locationId?: string
): Promise<ActionResult<ExpirationAlert[]>> {
  try {
    const params = new URLSearchParams({ daysAhead: String(daysAhead) });
    if (locationId) params.append('locationId', locationId);

    const response = await apiClient.get<ExpirationAlert[]>(
      `${API_ENDPOINTS.INVENTORY.ALERTS}/expiring?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch expiration alerts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch expiration alerts',
    };
  }
}

/**
 * Acknowledge alert
 */
export async function acknowledgeAlert(
  alertId: string,
  userId: string,
  actionTaken?: string
): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/acknowledge`, {
      userId,
      actionTaken,
    });

    revalidateTag('inventory-alerts');
    revalidatePath('/inventory/low-stock');
    revalidatePath('/inventory/expiring');

    return {
      success: true,
      message: 'Alert acknowledged successfully',
    };
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
    };
  }
}

/**
 * Dismiss alert
 */
export async function dismissAlert(alertId: string): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/dismiss`);

    revalidateTag('inventory-alerts');
    revalidatePath('/inventory/low-stock');
    revalidatePath('/inventory/expiring');

    return {
      success: true,
      message: 'Alert dismissed successfully',
    };
  } catch (error) {
    console.error('Failed to dismiss alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to dismiss alert',
    };
  }
}

// ==========================================
// RECOMMENDATION OPERATIONS
// ==========================================

/**
 * Get reorder recommendations
 */
export async function getReorderRecommendations(
  locationId?: string
): Promise<ActionResult<BulkReorderRecommendations>> {
  try {
    const params = locationId ? `?locationId=${locationId}` : '';
    const response = await apiClient.get<BulkReorderRecommendations>(
      `${API_ENDPOINTS.INVENTORY.ALERTS}/reorder-recommendations${params}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch reorder recommendations:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch reorder recommendations',
    };
  }
}

/**
 * Get stock transfer recommendations (balance between locations)
 */
export async function getTransferRecommendations(): Promise<
  ActionResult<StockTransferRecommendation[]>
> {
  try {
    const response = await apiClient.get<StockTransferRecommendation[]>(
      `${API_ENDPOINTS.INVENTORY.ALERTS}/transfer-recommendations`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transfer recommendations:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch transfer recommendations',
    };
  }
}

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Get stock usage analytics
 */
export async function getStockUsageAnalytics(
  filter: UsageAnalyticsFilter
): Promise<ActionResult<StockUsageAnalytics[]>> {
  try {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get<StockUsageAnalytics[]>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/usage?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch usage analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage analytics',
    };
  }
}

/**
 * Get inventory valuation
 */
export async function getInventoryValuation(
  locationId?: string
): Promise<ActionResult<TotalStockValuation>> {
  try {
    const params = locationId ? `?locationId=${locationId}` : '';
    const response = await apiClient.get<TotalStockValuation>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/valuation${params}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch inventory valuation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch valuation',
    };
  }
}

// ==========================================
// DASHBOARD OPERATIONS
// ==========================================

/**
 * Get inventory dashboard statistics
 */
export async function getInventoryDashboardStats(
  locationId?: string
): Promise<ActionResult<InventoryDashboardStats>> {
  try {
    const params = locationId ? `?locationId=${locationId}` : '';
    const response = await apiClient.get<InventoryDashboardStats>(
      `${API_ENDPOINTS.INVENTORY.DASHBOARD}${params}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
    };
  }
}

// ==========================================
// REPORT OPERATIONS
// ==========================================

/**
 * Generate stock level report
 */
export async function generateStockLevelReport(
  locationId?: string,
  category?: string
): Promise<ActionResult<StockLevelReport>> {
  try {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (category) params.append('category', category);

    const response = await apiClient.get<StockLevelReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/stock-level?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to generate stock level report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

/**
 * Generate transaction summary report
 */
export async function generateTransactionSummaryReport(
  startDate: Date,
  endDate: Date,
  locationId?: string
): Promise<ActionResult<TransactionSummaryReport>> {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    if (locationId) params.append('locationId', locationId);

    const response = await apiClient.get<TransactionSummaryReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/transaction-summary?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to generate transaction summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

/**
 * Generate expiration report
 */
export async function generateExpirationReport(
  daysAhead = 90,
  locationId?: string
): Promise<ActionResult<ExpirationReport>> {
  try {
    const params = new URLSearchParams({ daysAhead: String(daysAhead) });
    if (locationId) params.append('locationId', locationId);

    const response = await apiClient.get<ExpirationReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/expiration?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to generate expiration report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

/**
 * Generate variance report from physical count
 */
export async function generateVarianceReport(
  locationId: string,
  countDate: Date
): Promise<ActionResult<VarianceReport>> {
  try {
    const params = new URLSearchParams({
      locationId,
      countDate: countDate.toISOString(),
    });

    const response = await apiClient.get<VarianceReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/variance?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to generate variance report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

/**
 * Export report to CSV
 */
export async function exportReportToCSV(
  reportType: 'stock-level' | 'transaction-summary' | 'expiration' | 'variance',
  filters: Record<string, any>
): Promise<ActionResult<Blob>> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await fetch(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/${reportType}/export?${params.toString()}`,
      {
        headers: {
          Accept: 'text/csv',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    const blob = await response.blob();

    return {
      success: true,
      data: blob,
      message: 'Report exported successfully',
    };
  } catch (error) {
    console.error('Failed to export report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export report',
    };
  }
}
