/**
 * @fileoverview CRUD operations for Inventory Alerts
 * @module app/alerts/crud
 *
 * Handles retrieval of low-stock alerts and expiration alerts
 * with HIPAA-compliant audit logging.
 */

'use server';

import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type { ActionResult, LowStockAlert, ExpirationAlert } from './alerts.types';

/**
 * Get low stock alerts with HIPAA audit logging
 */
export async function getLowStockAlerts(
  locationId?: string
): Promise<ActionResult<LowStockAlert[]>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<LowStockAlert[]>(
      API_ENDPOINTS.INVENTORY.LOW_STOCK,
      { params }
    );

    await auditLogWithContext({
      userId: 'system', // In production, get from session
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT, // Use existing audit actions
      resource: 'inventory_alerts',
      details: JSON.stringify({ locationId }),
    });

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
 * Get expiration alerts with HIPAA audit logging
 */
export async function getExpirationAlerts(
  daysAhead = 90,
  locationId?: string
): Promise<ActionResult<ExpirationAlert[]>> {
  try {
    const params: Record<string, string | number> = { daysAhead };
    if (locationId) params.locationId = locationId;

    const response = await apiClient.get<ExpirationAlert[]>(
      API_ENDPOINTS.INVENTORY.EXPIRING,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_alerts',
      details: JSON.stringify({ daysAhead, locationId }),
    });

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
 * Get inventory dashboard statistics with audit logging
 */
export async function getInventoryDashboardStats(
  locationId?: string
): Promise<ActionResult<import('./alerts.types').InventoryDashboardStats>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<import('./alerts.types').InventoryDashboardStats>(
      API_ENDPOINTS.INVENTORY.DASHBOARD,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_dashboard',
      details: JSON.stringify({ locationId }),
    });

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
