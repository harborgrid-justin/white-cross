/**
 * Integration Hub API Module
 * Provides enterprise-grade integration management capabilities
 *
 * Supports:
 * - SIS (Student Information System)
 * - EHR (Electronic Health Records)
 * - SMS/Email Gateway
 * - Insurance Verification
 * - Pharmacy Management
 * - Laboratory Information System
 * - Parent Portal
 * - Government Reporting
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';

// Integration Types
export type IntegrationType =
  | 'SIS'
  | 'EHR'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'INSURANCE'
  | 'PARENT_PORTAL'
  | 'HEALTH_APP'
  | 'GOVERNMENT_REPORTING';

export type IntegrationStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'TESTING' | 'SYNCING';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint?: string;
  apiKey?: string; // Will be masked on retrieval
  username?: string;
  password?: string; // Will be masked on retrieval
  settings?: Record<string, any>;
  isActive: boolean;
  lastSyncAt?: string;
  lastSyncStatus?: string;
  syncFrequency?: number; // in minutes
  createdAt: string;
  updatedAt: string;
  logs?: IntegrationLog[];
}

export interface IntegrationLog {
  id: string;
  integrationId?: string;
  integrationType: IntegrationType;
  action: string;
  status: string;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
  details?: Record<string, any>;
  createdAt: string;
  integration?: {
    name: string;
    type: IntegrationType;
  };
}

export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationType;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: Record<string, any>;
  syncFrequency?: number;
}

export interface UpdateIntegrationRequest {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: Record<string, any>;
  syncFrequency?: number;
  isActive?: boolean;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  status?: string;
  latency?: number;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number;
  errors?: string[];
}

export interface IntegrationStatistics {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  syncStatistics: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    successRate: number;
    totalRecordsProcessed: number;
    totalRecordsSucceeded: number;
    totalRecordsFailed: number;
  };
  statsByType: Record<string, {
    success: number;
    failed: number;
    total: number;
  }>;
}

export interface LogFilters {
  integrationId?: string;
  type?: string;
  page?: number;
  limit?: number;
}

// Validation Schemas
const integrationTypeSchema = z.enum([
  'SIS',
  'EHR',
  'PHARMACY',
  'LABORATORY',
  'INSURANCE',
  'PARENT_PORTAL',
  'HEALTH_APP',
  'GOVERNMENT_REPORTING'
]);

const createIntegrationSchema = z.object({
  name: z.string().min(1, 'Integration name is required'),
  type: integrationTypeSchema,
  endpoint: z.string().url().optional(),
  apiKey: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  settings: z.record(z.any()).optional(),
  syncFrequency: z.number().min(1).optional(),
});

const updateIntegrationSchema = createIntegrationSchema.partial();

/**
 * Integration API Service Class
 * Implements enterprise integration patterns with comprehensive error handling
 */
export class IntegrationApi {
  /**
   * Get all integrations with optional filtering
   */
  async getAll(type?: IntegrationType): Promise<{ integrations: Integration[] }> {
    try {
      const params = type ? `?type=${encodeURIComponent(type)}` : '';
      const response = await apiInstance.get<ApiResponse<{ integrations: Integration[] }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}${params}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integrations');
    }
  }

  /**
   * Get single integration by ID
   */
  async getById(id: string): Promise<{ integration: Integration }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.get<ApiResponse<{ integration: Integration }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integration');
    }
  }

  /**
   * Create new integration configuration
   */
  async create(data: CreateIntegrationRequest): Promise<{ integration: Integration }> {
    try {
      createIntegrationSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<{ integration: Integration }>>(
        API_ENDPOINTS.INTEGRATIONS.BASE,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create integration');
    }
  }

  /**
   * Update existing integration
   */
  async update(id: string, data: UpdateIntegrationRequest): Promise<{ integration: Integration }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      updateIntegrationSchema.parse(data);

      const response = await apiInstance.put<ApiResponse<{ integration: Integration }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to update integration');
    }
  }

  /**
   * Delete integration configuration
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete integration');
    }
  }

  /**
   * Test integration connection
   * Returns connection status and latency metrics
   */
  async testConnection(id: string): Promise<{ result: ConnectionTestResult }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.post<ApiResponse<{ result: ConnectionTestResult }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/test`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Connection test failed');
    }
  }

  /**
   * Trigger manual synchronization
   * Returns sync results including records processed and errors
   */
  async sync(id: string): Promise<{ result: SyncResult }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.post<ApiResponse<{ result: SyncResult }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/sync`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Synchronization failed');
    }
  }

  /**
   * Get integration logs with pagination
   */
  async getLogs(id: string, filters: LogFilters = {}): Promise<{
    logs: IntegrationLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const params = new URLSearchParams();
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 20));

      const response = await apiInstance.get<ApiResponse<{
        logs: IntegrationLog[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/logs?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integration logs');
    }
  }

  /**
   * Get all integration logs (across all integrations)
   */
  async getAllLogs(filters: LogFilters = {}): Promise<{
    logs: IntegrationLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 20));
      if (filters.type) params.append('type', filters.type);

      const response = await apiInstance.get<ApiResponse<{
        logs: IntegrationLog[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/logs/all?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch logs');
    }
  }

  /**
   * Get integration statistics and metrics
   * Provides overview of sync success rates, performance, and system health
   */
  async getStatistics(): Promise<{ statistics: IntegrationStatistics }> {
    try {
      const response = await apiInstance.get<ApiResponse<{ statistics: IntegrationStatistics }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/statistics/overview`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch statistics');
    }
  }

  /**
   * Batch operations - Enable multiple integrations
   */
  async batchEnable(ids: string[]): Promise<{ success: number; failed: number }> {
    try {
      if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

      const results = await Promise.allSettled(
        ids.map(id => this.update(id, { isActive: true }))
      );

      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { success, failed };
    } catch (error: any) {
      throw new Error('Failed to enable integrations');
    }
  }

  /**
   * Batch operations - Disable multiple integrations
   */
  async batchDisable(ids: string[]): Promise<{ success: number; failed: number }> {
    try {
      if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

      const results = await Promise.allSettled(
        ids.map(id => this.update(id, { isActive: false }))
      );

      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { success, failed };
    } catch (error: any) {
      throw new Error('Failed to disable integrations');
    }
  }

  /**
   * Get integration health status
   * Returns aggregated health information for all active integrations
   */
  async getHealthStatus(): Promise<{
    overall: 'healthy' | 'degraded' | 'critical';
    integrations: Array<{
      id: string;
      name: string;
      type: IntegrationType;
      status: IntegrationStatus;
      lastSync: string | null;
      health: 'healthy' | 'warning' | 'error';
    }>;
  }> {
    try {
      const { integrations } = await this.getAll();

      const healthyIntegrations = integrations.filter(i =>
        i.isActive && i.status === 'ACTIVE' && i.lastSyncStatus === 'success'
      );

      const warningIntegrations = integrations.filter(i =>
        i.isActive && (i.status === 'TESTING' || !i.lastSyncAt)
      );

      const errorIntegrations = integrations.filter(i =>
        i.isActive && (i.status === 'ERROR' || i.lastSyncStatus === 'failed')
      );

      let overall: 'healthy' | 'degraded' | 'critical';
      if (errorIntegrations.length > 0) {
        overall = 'critical';
      } else if (warningIntegrations.length > 0) {
        overall = 'degraded';
      } else {
        overall = 'healthy';
      }

      return {
        overall,
        integrations: integrations.map(i => ({
          id: i.id,
          name: i.name,
          type: i.type,
          status: i.status,
          lastSync: i.lastSyncAt || null,
          health: i.status === 'ERROR' || i.lastSyncStatus === 'failed'
            ? 'error'
            : i.status === 'TESTING' || !i.lastSyncAt
              ? 'warning'
              : 'healthy'
        }))
      };
    } catch (error: any) {
      throw new Error('Failed to fetch health status');
    }
  }
}

// Export singleton instance
export const integrationApi = new IntegrationApi();

// Legacy compatibility exports
export const getIntegrations = () => integrationApi.getAll();
export const updateIntegration = (id: string, config: UpdateIntegrationRequest) =>
  integrationApi.update(id, config);
export const testConnection = (id: string) => integrationApi.testConnection(id);
export const sync = (id: string) => integrationApi.sync(id);

export default integrationApi;
