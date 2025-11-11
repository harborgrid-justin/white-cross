/**
 * Administration API - System Monitoring
 * 
 * Comprehensive system monitoring and health management including:
 * - System health monitoring
 * - Performance metrics tracking
 * - Service status monitoring
 * - Backup operations management
 * - System alerts and notifications
 * 
 * @module services/modules/administrationApi/monitoring
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../types';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  SystemHealth,
  ServiceHealth,
  BackupLog,
  PerformanceMetric,
  CreateBackupData,
  RecordMetricData,
  MetricFilters
} from './types';
import {
  createBackupSchema,
  recordMetricSchema,
  metricFiltersSchema
} from './validation';

/**
 * System Health Monitoring Service
 */
export class SystemHealthService {
  private readonly baseEndpoint = API_ENDPOINTS.SYSTEM.HEALTH;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'System health operation failed');
  }

  /**
   * Get current system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<ApiResponse<{ health: SystemHealth }>>(
        this.baseEndpoint
      );

      return response.data.data.health;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get detailed system status
   */
  async getSystemStatus(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<ApiResponse<{ status: SystemHealth }>>(
        API_ENDPOINTS.SYSTEM.STATUS
      );

      return response.data.data.status;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get individual service health
   */
  async getServiceHealth(serviceName: string): Promise<ServiceHealth> {
    try {
      if (!serviceName) throw new Error('Service name is required');

      const response = await this.client.get<ApiResponse<{ service: ServiceHealth }>>(
        `${this.baseEndpoint}/services/${encodeURIComponent(serviceName)}`
      );

      return response.data.data.service;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check all service health statuses
   */
  async checkAllServices(): Promise<ServiceHealth[]> {
    try {
      const response = await this.client.post<ApiResponse<{ services: ServiceHealth[] }>>(
        `${this.baseEndpoint}/check-all`,
        {}
      );

      return response.data.data.services;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get system configuration
   */
  async getSystemConfiguration(): Promise<Record<string, unknown>> {
    try {
      const response = await this.client.get<ApiResponse<{ configuration: Record<string, unknown> }>>(
        API_ENDPOINTS.SYSTEM.CONFIGURATION
      );

      return response.data.data.configuration;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update system configuration
   */
  async updateSystemConfiguration(config: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const configSchema = z.record(z.string(), z.unknown());
      configSchema.parse(config);

      const response = await this.client.put<ApiResponse<{ configuration: Record<string, unknown> }>>(
        API_ENDPOINTS.SYSTEM.CONFIGURATION,
        config
      );

      return response.data.data.configuration;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid configuration format',
          'configuration',
          { configuration: ['Configuration must be a valid object'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}

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
 * Backup Management Service
 */
export class BackupService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.BACKUPS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'Backup operation failed');
  }

  /**
   * Create a system backup
   */
  async createBackup(backupData: CreateBackupData = {}): Promise<BackupLog> {
    try {
      createBackupSchema.parse(backupData);

      const response = await this.client.post<ApiResponse<{ backup: BackupLog }>>(
        this.baseEndpoint,
        backupData
      );

      return response.data.data.backup;
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
   * Get all backup logs with pagination
   */
  async getBackupLogs(filters: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<BackupLog>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<PaginatedResponse<BackupLog>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get backup by ID
   */
  async getBackupById(id: string): Promise<BackupLog> {
    try {
      if (!id) throw new Error('Backup ID is required');

      const response = await this.client.get<ApiResponse<{ backup: BackupLog }>>(
        API_ENDPOINTS.ADMIN.BACKUP_BY_ID(id)
      );

      return response.data.data.backup;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Download backup file
   */
  async downloadBackup(id: string): Promise<Blob> {
    try {
      if (!id) throw new Error('Backup ID is required');

      const response = await this.client.get<Blob>(
        `${API_ENDPOINTS.ADMIN.BACKUP_BY_ID(id)}/download`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete backup
   */
  async deleteBackup(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Backup ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.BACKUP_BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(id: string, options: {
    overwriteExisting?: boolean;
    validateOnly?: boolean;
  } = {}): Promise<{
    restored: boolean;
    tablesRestored: number;
    recordsRestored: number;
    errors: string[];
  }> {
    try {
      if (!id) throw new Error('Backup ID is required');

      const restoreSchema = z.object({
        overwriteExisting: z.boolean().optional().default(false),
        validateOnly: z.boolean().optional().default(false),
      });

      restoreSchema.parse(options);

      const response = await this.client.post<ApiResponse<{
        restored: boolean;
        tablesRestored: number;
        recordsRestored: number;
        errors: string[];
      }>>(
        `${API_ENDPOINTS.ADMIN.BACKUP_BY_ID(id)}/restore`,
        options
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid restore options',
          'restore',
          { restore: ['Invalid restore configuration'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get backup statistics
   */
  async getBackupStatistics(): Promise<{
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
    totalSize: number;
    averageSize: number;
    lastBackup?: BackupLog;
    nextScheduledBackup?: string;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalBackups: number;
        successfulBackups: number;
        failedBackups: number;
        totalSize: number;
        averageSize: number;
        lastBackup?: BackupLog;
        nextScheduledBackup?: string;
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Combined System Monitoring Service
 */
export class MonitoringService {
  public readonly health: SystemHealthService;
  public readonly metrics: MetricsService;
  public readonly backups: BackupService;

  constructor(client: ApiClient) {
    this.health = new SystemHealthService(client);
    this.metrics = new MetricsService(client);
    this.backups = new BackupService(client);
  }

  /**
   * Get comprehensive system overview
   */
  async getSystemOverview(): Promise<{
    health: SystemHealth;
    recentMetrics: PerformanceMetric[];
    recentBackups: BackupLog[];
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: string;
    }>;
  }> {
    try {
      const [health, metrics, backups] = await Promise.all([
        this.health.getSystemHealth(),
        this.metrics.getMetrics({ limit: 10 }),
        this.backups.getBackupLogs({ limit: 5 })
      ]);

      // Generate alerts based on system status
      const alerts: Array<{
        type: 'warning' | 'error' | 'info';
        message: string;
        timestamp: string;
      }> = [];

      if (health.status === 'down') {
        alerts.push({
          type: 'error',
          message: 'System is currently down',
          timestamp: new Date().toISOString()
        });
      } else if (health.status === 'degraded') {
        alerts.push({
          type: 'warning',
          message: 'System performance is degraded',
          timestamp: new Date().toISOString()
        });
      }

      // Check for failed services
      health.services.forEach(service => {
        if (service.status === 'down') {
          alerts.push({
            type: 'error',
            message: `Service ${service.name} is down`,
            timestamp: service.lastCheck
          });
        } else if (service.status === 'degraded') {
          alerts.push({
            type: 'warning',
            message: `Service ${service.name} is degraded`,
            timestamp: service.lastCheck
          });
        }
      });

      return {
        health,
        recentMetrics: metrics,
        recentBackups: backups.data,
        alerts
      };
    } catch (error) {
      throw createApiError(error, 'Failed to get system overview');
    }
  }

  /**
   * Perform system health check
   */
  async performHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'down';
    checks: Array<{
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message: string;
      duration: number;
    }>;
    timestamp: string;
  }> {
    try {
      const startTime = Date.now();

      const checks: Array<{
        name: string;
        status: 'pass' | 'warn' | 'fail';
        message: string;
        duration: number;
      }> = [];

      try {
        const checkStart = Date.now();
        const health = await this.health.getSystemHealth();
        checks.push({
          name: 'System Health',
          status: health.status === 'healthy' ? 'pass' : health.status === 'degraded' ? 'warn' : 'fail',
          message: `System is ${health.status}`,
          duration: Date.now() - checkStart
        });
      } catch (error) {
        checks.push({
          name: 'System Health',
          status: 'fail',
          message: 'Failed to check system health',
          duration: Date.now() - startTime
        });
      }

      try {
        const checkStart = Date.now();
        await this.health.checkAllServices();
        checks.push({
          name: 'Services Check',
          status: 'pass',
          message: 'All services checked successfully',
          duration: Date.now() - checkStart
        });
      } catch (error) {
        const checkStart = Date.now();
        checks.push({
          name: 'Services Check',
          status: 'fail',
          message: 'Failed to check services',
          duration: Date.now() - checkStart
        });
      }

      // Determine overall status
      const hasFailures = checks.some(check => check.status === 'fail');
      const hasWarnings = checks.some(check => check.status === 'warn');
      const overall = hasFailures ? 'down' : hasWarnings ? 'degraded' : 'healthy';

      return {
        overall,
        checks,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw createApiError(error, 'Health check failed');
    }
  }
}

/**
 * Factory functions
 */
export function createSystemHealthService(client: ApiClient): SystemHealthService {
  return new SystemHealthService(client);
}

export function createMetricsService(client: ApiClient): MetricsService {
  return new MetricsService(client);
}

export function createBackupService(client: ApiClient): BackupService {
  return new BackupService(client);
}

export function createMonitoringService(client: ApiClient): MonitoringService {
  return new MonitoringService(client);
}
