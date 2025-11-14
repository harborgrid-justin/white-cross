/**
 * Analytics and Reporting for Inventory Management API
 *
 * Handles comprehensive analytics, cost analysis, usage trends, maintenance tracking,
 * and alerts for inventory management with performance insights.
 *
 * @module services/modules/inventoryApi/analytics
 */

import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '../../types';
import type {
  CostAnalysis,
  UsageTrend,
  InventoryAlert,
  AlertType,
  MaintenanceLog,
  MaintenanceType,
  InventoryFilters,
} from './types';
import { 
  createMaintenanceLogSchema, 
  acknowledgeAlertSchema,
  analyticsFiltersSchema,
  bulkImportSchema,
  exportFiltersSchema
} from './validation';
import { createApiError, createValidationError } from '../../core/errors';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';

/**
 * Analytics and Reporting API Operations
 */
export class AnalyticsApi {
  private readonly baseEndpoint = API_ENDPOINTS.INVENTORY.BASE;

  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // COST ANALYSIS & FINANCIAL METRICS
  // ==========================================

  /**
   * Get comprehensive cost analysis and optimization recommendations
   */
  async getCostAnalysis(filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<CostAnalysis> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);

      const response = await this.client.get<ApiResponse<CostAnalysis>>(
        `${this.baseEndpoint}/analytics/cost-analysis?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch cost analysis');
    }
  }

  /**
   * Get inventory valuation by category
   */
  async getInventoryValuation(): Promise<Array<{
    category: string;
    itemCount: number;
    totalValue: number;
    averageValue: number;
    percentageOfTotal: number;
    trend: {
      direction: 'UP' | 'DOWN' | 'STABLE';
      percentage: number;
      period: string;
    };
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ 
        valuation: Array<{
          category: string;
          itemCount: number;
          totalValue: number;
          averageValue: number;
          percentageOfTotal: number;
          trend: {
            direction: 'UP' | 'DOWN' | 'STABLE';
            percentage: number;
            period: string;
          };
        }>
      }>>(
        `${this.baseEndpoint}/analytics/valuation`
      );

      return response.data.data!.valuation;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory valuation');
    }
  }

  /**
   * Get comprehensive inventory statistics
   */
  async getInventoryStats(): Promise<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    expiringCount: number;
    maintenanceDueCount: number;
    categoryBreakdown: Array<{ category: string; count: number; value: number }>;
    topUsedItems: Array<{ itemId: string; name: string; usageCount: number }>;
    recentTransactions: number;
    trends: {
      inventoryGrowth: {
        period: string;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'STABLE';
      };
      costTrend: {
        period: string;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'STABLE';
      };
      usageTrend: {
        period: string;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'STABLE';
      };
    };
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalItems: number;
        totalValue: number;
        lowStockCount: number;
        expiringCount: number;
        maintenanceDueCount: number;
        categoryBreakdown: Array<{ category: string; count: number; value: number }>;
        topUsedItems: Array<{ itemId: string; name: string; usageCount: number }>;
        recentTransactions: number;
        trends: {
          inventoryGrowth: {
            period: string;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'STABLE';
          };
          costTrend: {
            period: string;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'STABLE';
          };
          usageTrend: {
            period: string;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'STABLE';
          };
        };
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory statistics');
    }
  }

  // ==========================================
  // USAGE ANALYTICS & TRENDS
  // ==========================================

  /**
   * Get usage trends and analytics
   */
  async getUsageAnalytics(filters: {
    startDate: string;
    endDate: string;
    category?: string;
    itemId?: string;
  }): Promise<UsageTrend[]> {
    try {
      analyticsFiltersSchema.parse(filters);

      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      if (filters.category) params.append('category', filters.category);
      if (filters.itemId) params.append('itemId', filters.itemId);

      const response = await this.client.get<ApiResponse<{ trends: UsageTrend[] }>>(
        `${this.baseEndpoint}/analytics/usage-trends?${params.toString()}`
      );

      return response.data.data!.trends;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to fetch usage analytics');
    }
  }

  /**
   * Get demand forecasting
   */
  async getDemandForecast(filters: {
    itemIds?: string[];
    category?: string;
    forecastDays?: number;
    includeSeasonality?: boolean;
  } = {}): Promise<Array<{
    itemId: string;
    itemName: string;
    category: string;
    currentStock: number;
    forecast: Array<{
      date: string;
      predictedDemand: number;
      confidence: number;
      recommendedStock: number;
      stockoutRisk: number;
    }>;
    recommendations: {
      suggestedReorderPoint: number;
      suggestedReorderQuantity: number;
      reasoning: string[];
    };
  }>> {
    try {
      const params = new URLSearchParams();
      if (filters.itemIds?.length) {
        filters.itemIds.forEach(id => params.append('itemIds', id));
      }
      if (filters.category) params.append('category', filters.category);
      if (filters.forecastDays) params.append('forecastDays', String(filters.forecastDays));
      if (filters.includeSeasonality !== undefined) {
        params.append('includeSeasonality', String(filters.includeSeasonality));
      }

      const response = await this.client.get<ApiResponse<{ 
        forecasts: Array<{
          itemId: string;
          itemName: string;
          category: string;
          currentStock: number;
          forecast: Array<{
            date: string;
            predictedDemand: number;
            confidence: number;
            recommendedStock: number;
            stockoutRisk: number;
          }>;
          recommendations: {
            suggestedReorderPoint: number;
            suggestedReorderQuantity: number;
            reasoning: string[];
          };
        }>
      }>>(
        `${this.baseEndpoint}/analytics/demand-forecast?${params.toString()}`
      );

      return response.data.data!.forecasts;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch demand forecast');
    }
  }

  // ==========================================
  // MAINTENANCE OPERATIONS
  // ==========================================

  /**
   * Create maintenance log
   */
  async createMaintenanceLog(data: {
    inventoryItemId: string;
    type: MaintenanceType;
    description: string;
    cost?: number;
    performedDate: string;
    nextMaintenanceDate?: string;
    vendor?: string;
    notes?: string;
  }): Promise<MaintenanceLog> {
    try {
      createMaintenanceLogSchema.parse(data);

      const response = await this.client.post<ApiResponse<MaintenanceLog>>(
        `${this.baseEndpoint}/maintenance`,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create maintenance log');
    }
  }

  /**
   * Get maintenance schedule
   */
  async getMaintenanceSchedule(filters?: {
    startDate?: string;
    endDate?: string;
    inventoryItemId?: string;
    type?: MaintenanceType;
    overdue?: boolean;
  }): Promise<MaintenanceLog[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.inventoryItemId) params.append('inventoryItemId', filters.inventoryItemId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.overdue !== undefined) params.append('overdue', String(filters.overdue));

      const response = await this.client.get<ApiResponse<{ schedule: MaintenanceLog[] }>>(
        `${this.baseEndpoint}/maintenance/schedule?${params.toString()}`
      );

      return response.data.data!.schedule;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch maintenance schedule');
    }
  }

  /**
   * Get maintenance history for an item
   */
  async getMaintenanceHistory(itemId: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<MaintenanceLog>> {
    try {
      if (!itemId) throw new Error('Item ID is required');

      const response = await this.client.get<ApiResponse<PaginatedResponse<MaintenanceLog>>>(
        `${this.baseEndpoint}/${itemId}/maintenance?page=${page}&limit=${limit}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch maintenance history');
    }
  }

  /**
   * Update maintenance log
   */
  async updateMaintenanceLog(logId: string, data: Partial<{
    description: string;
    cost: number;
    nextMaintenanceDate: string;
    vendor: string;
    notes: string;
  }>): Promise<MaintenanceLog> {
    try {
      if (!logId) throw new Error('Maintenance log ID is required');

      const response = await this.client.put<ApiResponse<MaintenanceLog>>(
        `${this.baseEndpoint}/maintenance/${logId}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update maintenance log');
    }
  }

  // ==========================================
  // ALERTS OPERATIONS
  // ==========================================

  /**
   * Get inventory alerts
   */
  async getInventoryAlerts(filters?: {
    type?: AlertType;
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
    acknowledged?: boolean;
    itemId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<InventoryAlert>> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.acknowledged !== undefined) params.append('acknowledged', String(filters.acknowledged));
      if (filters?.itemId) params.append('itemId', filters.itemId);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<InventoryAlert>>>(
        `${this.baseEndpoint}/alerts?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory alerts');
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<InventoryAlert> {
    try {
      if (!alertId) throw new Error('Alert ID is required');
      acknowledgeAlertSchema.parse({ acknowledgedBy });

      const response = await this.client.post<ApiResponse<InventoryAlert>>(
        `${this.baseEndpoint}/alerts/${alertId}/acknowledge`,
        { acknowledgedBy }
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to acknowledge alert');
    }
  }

  /**
   * Dismiss alert
   */
  async dismissAlert(alertId: string, dismissedBy: string, reason?: string): Promise<InventoryAlert> {
    try {
      if (!alertId) throw new Error('Alert ID is required');
      if (!dismissedBy) throw new Error('Dismissed by is required');

      const response = await this.client.post<ApiResponse<InventoryAlert>>(
        `${this.baseEndpoint}/alerts/${alertId}/dismiss`,
        { dismissedBy, reason }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to dismiss alert');
    }
  }

  /**
   * Create custom alert
   */
  async createCustomAlert(data: {
    itemId: string;
    type: AlertType;
    threshold: number;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
  }): Promise<InventoryAlert> {
    try {
      if (!data.itemId) throw new Error('Item ID is required');
      if (!data.message) throw new Error('Alert message is required');

      const response = await this.client.post<ApiResponse<InventoryAlert>>(
        `${this.baseEndpoint}/alerts`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to create custom alert');
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Bulk import inventory items
   */
  async bulkImportItems(items: Array<{
    name: string;
    category: string;
    description?: string;
    sku?: string;
    supplier?: string;
    unitCost: number;
    initialStock?: number;
    reorderLevel: number;
    reorderQuantity: number;
    location?: string;
    notes?: string;
  }>): Promise<{
    imported: number;
    failed: number;
    errors: Array<{ index: number; error: string; item: typeof items[0] }>;
  }> {
    try {
      bulkImportSchema.parse({ items });

      const response = await this.client.post<ApiResponse<{
        imported: number;
        failed: number;
        errors: Array<{ index: number; error: string; item: typeof items[0] }>;
      }>>(
        `${this.baseEndpoint}/bulk-import`,
        { items }
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to bulk import items');
    }
  }

  /**
   * Export inventory to CSV/Excel
   */
  async exportInventory(format: 'csv' | 'excel' = 'csv', filters?: InventoryFilters): Promise<Blob> {
    try {
      const exportData = {
        format,
        category: filters?.category,
        supplier: filters?.supplier,
        location: filters?.location,
        isActive: filters?.isActive,
      };

      exportFiltersSchema.parse(exportData);

      const params = new URLSearchParams();
      params.append('format', format);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.supplier) params.append('supplier', filters.supplier);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get(
        `${this.baseEndpoint}/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      return response.data as Blob;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to export inventory');
    }
  }

  // ==========================================
  // PERFORMANCE METRICS
  // ==========================================

  /**
   * Get inventory performance dashboard data
   */
  async getPerformanceDashboard(): Promise<{
    kpis: {
      inventoryTurnover: number;
      stockoutFrequency: number;
      carryingCostRatio: number;
      orderAccuracy: number;
      supplierPerformance: number;
    };
    alerts: {
      critical: number;
      warning: number;
      info: number;
    };
    trends: {
      costTrend: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
      usageTrend: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
      wasteReduction: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
    };
    recommendations: Array<{
      type: 'REORDER' | 'OPTIMIZE' | 'MAINTENANCE' | 'COST_SAVING';
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      title: string;
      description: string;
      estimatedImpact: string;
      actionRequired: string;
    }>;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        kpis: {
          inventoryTurnover: number;
          stockoutFrequency: number;
          carryingCostRatio: number;
          orderAccuracy: number;
          supplierPerformance: number;
        };
        alerts: {
          critical: number;
          warning: number;
          info: number;
        };
        trends: {
          costTrend: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
          usageTrend: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
          wasteReduction: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number };
        };
        recommendations: Array<{
          type: 'REORDER' | 'OPTIMIZE' | 'MAINTENANCE' | 'COST_SAVING';
          priority: 'HIGH' | 'MEDIUM' | 'LOW';
          title: string;
          description: string;
          estimatedImpact: string;
          actionRequired: string;
        }>;
      }>>(
        `${this.baseEndpoint}/analytics/dashboard`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch performance dashboard data');
    }
  }
}
