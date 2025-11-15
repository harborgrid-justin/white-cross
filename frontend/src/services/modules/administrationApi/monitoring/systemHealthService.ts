/**
 * Administration API - System Health Service
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
 * import { createSystemHealthService } from '@/services/modules/administrationApi/monitoring';
 * const service = createSystemHealthService(apiClient);
 * const health = await service.getSystemHealth();
 * const status = await service.getSystemStatus();
 *
 * // RECOMMENDED: Server actions approach
 * import { getSystemHealth, getSystemStatus } from '@/lib/actions/admin.monitoring';
 * const health = await getSystemHealth();
 * const status = await getSystemStatus();
 * ```
 *
 * System health monitoring service providing:
 * - System health status checks
 * - Service health monitoring
 * - System configuration management
 *
 * @module services/modules/administrationApi/monitoring/systemHealthService
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z } from 'zod';
import {
  ApiResponse,
} from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type {
  SystemHealth,
  ServiceHealth,
} from '../types';

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
 * Factory function to create SystemHealthService instance
 */
export function createSystemHealthService(client: ApiClient): SystemHealthService {
  return new SystemHealthService(client);
}
