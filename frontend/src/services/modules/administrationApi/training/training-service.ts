/**
 * Administration API - Combined Training Management Service
 *
 * Unified service providing:
 * - Module management (via TrainingModulesService)
 * - Completion tracking (via TrainingCompletionService)
 * - Dashboard and reporting
 * - Compliance management
 *
 * @module services/modules/administrationApi/training/training-service
 */

import type { ApiClient } from '../../../core/ApiClient';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type { TrainingCompletion } from '../types';
import { TrainingCategory } from '../types';
import { TrainingModulesService } from './training-modules';
import { TrainingCompletionService } from './training-completions';

/**
 * Combined Training Management Service
 *
 * This service aggregates both module management and completion tracking,
 * providing a unified interface for all training operations plus additional
 * dashboard and reporting capabilities.
 */
export class TrainingService {
  public readonly modules: TrainingModulesService;
  public readonly completions: TrainingCompletionService;

  constructor(client: ApiClient) {
    this.modules = new TrainingModulesService(client);
    this.completions = new TrainingCompletionService(client);
  }

  /**
   * Get training dashboard data
   *
   * Provides an overview of training system status including:
   * - Module counts and statistics
   * - Recent completion activity
   * - User compliance metrics
   * - Category breakdowns
   */
  async getTrainingDashboard(): Promise<{
    totalModules: number;
    activeModules: number;
    requiredModules: number;
    totalCompletions: number;
    recentCompletions: TrainingCompletion[];
    overdueUsers: number;
    averageScore: number;
    completionRate: number;
    modulesByCategory: Array<{
      category: TrainingCategory;
      count: number;
      requiredCount: number;
    }>;
  }> {
    try {
      const response = await this.modules['client'].get<ApiResponse<{
        totalModules: number;
        activeModules: number;
        requiredModules: number;
        totalCompletions: number;
        recentCompletions: TrainingCompletion[];
        overdueUsers: number;
        averageScore: number;
        completionRate: number;
        modulesByCategory: Array<{
          category: TrainingCategory;
          count: number;
          requiredCount: number;
        }>;
      }>>(
        `${this.modules['baseEndpoint']}/dashboard`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch training dashboard');
    }
  }

  /**
   * Get compliance report
   *
   * Generates comprehensive compliance reports showing user completion status,
   * overdue training, and overall organizational compliance metrics.
   *
   * @param filters - Report filtering options
   * @returns Compliance report data (JSON) or file (CSV/PDF)
   */
  async getComplianceReport(filters: {
    category?: TrainingCategory;
    includeExpired?: boolean;
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<Blob | {
    users: Array<{
      userId: string;
      userName: string;
      email: string;
      completionRate: number;
      requiredCompleted: number;
      requiredTotal: number;
      overdueModules: string[];
      lastActivity?: string;
    }>;
    summary: {
      totalUsers: number;
      compliantUsers: number;
      nonCompliantUsers: number;
      averageCompletionRate: number;
    };
  }> {
    try {
      const reportSchema = z.object({
        category: z.nativeEnum(TrainingCategory).optional(),
        includeExpired: z.boolean().optional().default(false),
        format: z.enum(['json', 'csv', 'pdf']).optional().default('json'),
      });

      const validatedFilters = reportSchema.parse(filters);

      const params = new URLSearchParams();
      if (validatedFilters.category) params.append('category', validatedFilters.category);
      if (validatedFilters.includeExpired !== undefined) params.append('includeExpired', String(validatedFilters.includeExpired));
      params.append('format', validatedFilters.format);

      if (validatedFilters.format === 'json') {
        const response = await this.modules['client'].get<ApiResponse<{
          users: Array<{
            userId: string;
            userName: string;
            email: string;
            completionRate: number;
            requiredCompleted: number;
            requiredTotal: number;
            overdueModules: string[];
            lastActivity?: string;
          }>;
          summary: {
            totalUsers: number;
            compliantUsers: number;
            nonCompliantUsers: number;
            averageCompletionRate: number;
          };
        }>>(
          `${this.modules['baseEndpoint']}/compliance-report?${params.toString()}`
        );

        return response.data.data;
      } else {
        const response = await this.modules['client'].get<Blob>(
          `${this.modules['baseEndpoint']}/compliance-report?${params.toString()}`,
          { responseType: 'blob' }
        );

        return response.data;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid report filters',
          'filters',
          { filters: ['Invalid report configuration'] },
          error
        );
      }
      throw createApiError(error, 'Failed to generate compliance report');
    }
  }
}

/**
 * Factory function for creating TrainingService instances
 *
 * @param client - Configured ApiClient instance
 * @returns New TrainingService instance
 */
export function createTrainingService(client: ApiClient): TrainingService {
  return new TrainingService(client);
}
