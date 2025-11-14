/**
 * @fileoverview Monitoring Service Module
 * @module services/modules/administration/MonitoringService
 * @category Services - Administration - Monitoring
 *
 * Provides system monitoring and observability functionality including:
 * - System health metrics and status monitoring
 * - Backup operations and log management
 * - Performance metrics recording and retrieval
 * - Audit log tracking and filtering
 * - Type-safe monitoring operations
 *
 * @example
 * ```typescript
 * import { MonitoringService } from '@/services/modules/administration/MonitoringService';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const monitoringService = new MonitoringService(apiClient);
 * const health = await monitoringService.getSystemHealth();
 * const metrics = await monitoringService.getMetrics({ metricType: 'API_RESPONSE_TIME' });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import {
  SystemHealth,
  BackupLog,
  PerformanceMetric,
  AuditLog,
  RecordMetricData,
  MetricFilters,
} from '../../../types/domain/administration';

// ==================== MONITORING SERVICE ====================

/**
 * Audit log filters for querying audit logs
 */
export interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Service class for monitoring and observability operations
 */
export class MonitoringService {
  constructor(private readonly client: ApiClient) {}

  // ==================== SYSTEM HEALTH METHODS ====================

  /**
   * Get system health metrics including uptime, resource usage, and status
   * @returns System health object with comprehensive status information
   * @throws {ApiError} When the API request fails
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<ApiResponse<SystemHealth>>(
        API_ENDPOINTS.ADMIN.SYSTEM_HEALTH
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system health');
    }
  }

  // ==================== BACKUP METHODS ====================

  /**
   * Get backup logs with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated list of backup logs
   * @throws {ApiError} When the API request fails
   */
  async getBackupLogs(page: number = 1, limit: number = 20): Promise<PaginatedResponse<BackupLog>> {
    try {
      const response = await this.client.get<ApiResponse<PaginatedResponse<BackupLog>>>(
        `${API_ENDPOINTS.ADMIN.BACKUPS}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch backup logs');
    }
  }

  /**
   * Create manual backup
   * @returns Created backup log entry
   * @throws {ApiError} When the API request fails
   */
  async createBackup(): Promise<BackupLog> {
    try {
      const response = await this.client.post<ApiResponse<{ backup: BackupLog }>>(
        API_ENDPOINTS.ADMIN.BACKUPS
      );

      return response.data.data.backup;
    } catch (error) {
      throw createApiError(error, 'Failed to create backup');
    }
  }

  // ==================== PERFORMANCE METRICS METHODS ====================

  /**
   * Get performance metrics with optional filtering
   * @param filters - Optional filters for metric type, date range, and limit
   * @returns Array of performance metrics
   * @throws {ApiError} When the API request fails
   */
  async getMetrics(filters: MetricFilters = {}): Promise<PerformanceMetric[]> {
    try {
      const params = new URLSearchParams();
      if (filters.metricType) params.append('metricType', filters.metricType);
      if (filters.startDate) {
        params.append('startDate', typeof filters.startDate === 'string' ? filters.startDate : filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append('endDate', typeof filters.endDate === 'string' ? filters.endDate : filters.endDate.toISOString());
      }
      if (filters.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<{ metrics: PerformanceMetric[] }>>(
        `${API_ENDPOINTS.ADMIN.METRICS}?${params.toString()}`
      );

      return response.data.data.metrics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch metrics');
    }
  }

  /**
   * Record a performance metric
   * @param metricData - Metric data to record
   * @returns Recorded performance metric
   * @throws {ApiError} When the API request fails
   */
  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    try {
      const response = await this.client.post<ApiResponse<{ metric: PerformanceMetric }>>(
        API_ENDPOINTS.ADMIN.METRICS,
        metricData
      );

      return response.data.data.metric;
    } catch (error) {
      throw createApiError(error, 'Failed to record metric');
    }
  }

  // ==================== AUDIT LOG METHODS ====================

  /**
   * Get audit logs with comprehensive filtering and pagination
   * @param filters - Optional filters for user, entity, action, dates, and pagination
   * @returns Paginated list of audit logs
   * @throws {ApiError} When the API request fails
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedResponse<AuditLog>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.entityId) params.append('entityId', filters.entityId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<PaginatedResponse<AuditLog>>>(
        `${API_ENDPOINTS.ADMIN.AUDIT_LOGS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch audit logs');
    }
  }
}

/**
 * Factory function to create a MonitoringService instance
 * @param client - ApiClient instance
 * @returns MonitoringService instance
 */
export function createMonitoringService(client: ApiClient): MonitoringService {
  return new MonitoringService(client);
}
