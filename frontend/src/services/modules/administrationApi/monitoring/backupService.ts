/**
 * Administration API - Backup Management Service
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
 * import { createBackupService } from '@/services/modules/administrationApi/monitoring';
 * const service = createBackupService(apiClient);
 * const backup = await service.createBackup();
 * const logs = await service.getBackupLogs();
 *
 * // RECOMMENDED: Server actions approach
 * import { createBackup, getBackupLogs } from '@/lib/actions/admin.monitoring';
 * const backup = await createBackup();
 * const logs = await getBackupLogs();
 * ```
 *
 * Backup management service providing:
 * - Backup creation and scheduling
 * - Backup retrieval and listing
 * - Backup restoration
 * - Backup file downloads
 * - Backup statistics
 *
 * @module services/modules/administrationApi/monitoring/backupService
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type {
  BackupLog,
  CreateBackupData,
} from '../types';
import {
  createBackupSchema,
} from '../validation';

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
 * Factory function to create BackupService instance
 */
export function createBackupService(client: ApiClient): BackupService {
  return new BackupService(client);
}
