import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IntegrationLog } from '@/database/models';
import { IntegrationConfig } from '@/database/models';
import type { PaginationMeta } from '../types/pagination.types';

import { BaseService } from '@/common/base';
/**
 * Error detail for integration log
 */
export interface IntegrationErrorDetail {
  code: string;
  message: string;
  field?: string;
  context?: Record<string, unknown>;
}

export interface CreateIntegrationLogDto {
  integrationId?: string;
  integrationType: string;
  action: string;
  status: string;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  duration?: number;
  errorMessage?: string;
  details?: IntegrationErrorDetail | IntegrationErrorDetail[] | Record<string, unknown>;
}

/**
 * Integration Log Service
 * Manages integration operation logs for audit and monitoring
 */
@Injectable()
export class IntegrationLogService extends BaseService {
  constructor(
    @InjectModel(IntegrationLog)
    private readonly logModel: typeof IntegrationLog,
  ) {
    super("IntegrationLogService");
  }

  /**
   * Create integration log entry
   */
  async create(data: CreateIntegrationLogDto): Promise<IntegrationLog> {
    try {
      return await this.logModel.create({
        ...data,
        startedAt: new Date(),
        completedAt:
          data.status === 'success' || data.status === 'failed'
            ? new Date()
            : undefined,
      });
    } catch (error) {
      this.logError('Error creating integration log', error);
      throw error;
    }
  }

  /**
   * Get integration logs with pagination and filtering
   */
  async findAll(
    integrationId?: string,
    type?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ logs: IntegrationLog[]; pagination: PaginationMeta }> {
    try {
      const whereClause: Record<string, string> = {};
      if (integrationId) {
        whereClause.integrationId = integrationId;
      }
      if (type) {
        whereClause.integrationType = type;
      }

      const offset = (page - 1) * limit;
      const { rows: logs, count: total } = await this.logModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: IntegrationConfig,
            as: 'integration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logError('Error fetching integration logs', error);
      throw error;
    }
  }
}
