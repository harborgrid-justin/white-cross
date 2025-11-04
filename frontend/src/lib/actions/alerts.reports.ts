/**
 * @fileoverview Report generation and export operations
 * @module app/alerts/reports
 *
 * Handles generation of stock level reports and export to CSV
 * with HIPAA-compliant audit logging.
 */

'use server';

import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type { ActionResult, StockLevelReport, ReportType } from './alerts.types';

/**
 * Generate stock level report with audit logging
 */
export async function generateStockLevelReport(
  locationId?: string,
  category?: string
): Promise<ActionResult<StockLevelReport>> {
  try {
    const params: Record<string, string> = {};
    if (locationId) params.locationId = locationId;
    if (category) params.category = category;

    const response = await apiClient.get<StockLevelReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/stock-level`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_report',
      resourceId: response.data.reportDate.toString(),
      details: JSON.stringify({ locationId, category }),
    });

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
 * Export report to CSV with audit logging
 */
export async function exportReportToCSV(
  reportType: ReportType,
  filters: Record<string, unknown>,
  userId: string
): Promise<ActionResult<Blob>> {
  try {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = String(value);
        }
      }
    });

    // Use fetch directly for blob response
    const response = await fetch(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/${reportType}/export?${new URLSearchParams(params).toString()}`,
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

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'inventory_report',
      details: JSON.stringify({ reportType, filters }),
    });

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
