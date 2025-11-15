/**
 * Administration API - Performance Metrics Service
 *
 * @deprecated This service is deprecated and will be removed in a future version.
 * Use '@/lib/actions/admin.monitoring' server actions instead.
 *
 * Migration Path:
 * 1. Replace ApiClient-based service with server actions
 * 2. Update imports from '@/lib/actions/admin.monitoring'
 * 3. Remove service instantiation code
 *
 * @example Migration example
 * ```typescript
 * // DEPRECATED: Legacy approach
 * import { createMetricsService } from '@/services/modules/administrationApi/monitoring';
 * const service = createMetricsService(apiClient);
 * const metrics = await service.getMetrics({ metricType: 'response_time' });
 * const summary = await service.getMetricsSummary();
 *
 * // RECOMMENDED: Server actions approach
 * import { getMetrics, getMetricsSummary } from '@/lib/actions/admin.monitoring';
 * const metrics = await getMetrics({ metricType: 'response_time' });
 * const summary = await getMetricsSummary();
 * ```
 *
 * Performance metrics tracking service providing:
 * - Metric recording
 * - Metric retrieval with filtering
 * - Metrics summary and analytics
 * - Old metrics cleanup
 *
 * @module services/modules/administrationApi/monitoring/metricsService
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
} from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type {
  PerformanceMetric,
  RecordMetricData,
  MetricFilters
} from '../types';
import {
  recordMetricSchema,
  metricFiltersSchema
} from '../validation';

/**
 * Performance Metrics Service
 */
export class MetricsService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.METRICS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'Metrics operation failed');
  }

  /**
   * Record a performance metric
   */
  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    try {
      recordMetricSchema.parse(metricData);

      const response = await this.client.post<ApiResponse<{ metric: PerformanceMetric }>>(
        this.baseEndpoint,
        metricData
      );

      return response.data.data.metric;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get performance metrics with filtering
   */
  async getMetrics(filters: MetricFilters = {}): Promise<PerformanceMetric[]> {
    try {
      metricFiltersSchema.parse(filters);

      const params = new URLSearchParams();
      if (filters.metricType) params.append('metricType', filters.metricType);
      if (filters.startDate) {
        const startDate = filters.startDate instanceof Date ? filters.startDate.toISOString() : filters.startDate;
        params.append('startDate', startDate);
      }
      if (filters.endDate) {
        const endDate = filters.endDate instanceof Date ? filters.endDate.toISOString() : filters.endDate;
        params.append('endDate', endDate);
      }
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.tags) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await this.client.get<ApiResponse<{ metrics: PerformanceMetric[] }>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data.metrics;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get metric by ID
   */
  async getMetricById(id: string): Promise<PerformanceMetric> {
    try {
      if (!id) throw new Error('Metric ID is required');

      const response = await this.client.get<ApiResponse<{ metric: PerformanceMetric }>>(
        API_ENDPOINTS.ADMIN.METRIC_BY_ID(id)
      );

      return response.data.data.metric;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete old metrics
   */
  async deleteOldMetrics(olderThanDays: number): Promise<{ deleted: number }> {
    try {
      if (olderThanDays < 1) throw new Error('Days must be at least 1');

      const response = await this.client.delete<ApiResponse<{ deleted: number }>>(
        `${this.baseEndpoint}/cleanup?olderThanDays=${olderThanDays}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get metrics summary
   */
  async getMetricsSummary(filters: Omit<MetricFilters, 'limit'> = {}): Promise<{
    totalMetrics: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    topMetrics: Array<{
      metricType: string;
      count: number;
      averageValue: number;
    }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters.metricType) params.append('metricType', filters.metricType);
      if (filters.startDate) {
        const startDate = filters.startDate instanceof Date ? filters.startDate.toISOString() : filters.startDate;
        params.append('startDate', startDate);
      }
      if (filters.endDate) {
        const endDate = filters.endDate instanceof Date ? filters.endDate.toISOString() : filters.endDate;
        params.append('endDate', endDate);
      }

      const response = await this.client.get<ApiResponse<{
        totalMetrics: number;
        averageResponseTime: number;
        errorRate: number;
        throughput: number;
        topMetrics: Array<{
          metricType: string;
          count: number;
          averageValue: number;
        }>;
      }>>(
        `${this.baseEndpoint}/summary?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create MetricsService instance
 */
export function createMetricsService(client: ApiClient): MetricsService {
  return new MetricsService(client);
}
