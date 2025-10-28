import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationLog } from '../entities/integration-log.entity';

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
  details?: any;
}

/**
 * Integration Log Service
 * Manages integration operation logs for audit and monitoring
 */
@Injectable()
export class IntegrationLogService {
  private readonly logger = new Logger(IntegrationLogService.name);

  constructor(
    @InjectRepository(IntegrationLog)
    private readonly logRepository: Repository<IntegrationLog>,
  ) {}

  /**
   * Create integration log entry
   */
  async create(data: CreateIntegrationLogDto): Promise<IntegrationLog> {
    try {
      const log = this.logRepository.create({
        ...data,
        startedAt: new Date(),
        completedAt: (data.status === 'success' || data.status === 'failed') ? new Date() : undefined,
      });

      return await this.logRepository.save(log);
    } catch (error) {
      this.logger.error('Error creating integration log', error);
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
  ): Promise<{ logs: IntegrationLog[]; pagination: any }> {
    try {
      const query = this.logRepository.createQueryBuilder('log')
        .leftJoinAndSelect('log.integration', 'integration')
        .orderBy('log.createdAt', 'DESC');

      if (integrationId) {
        query.andWhere('log.integrationId = :integrationId', { integrationId });
      }

      if (type) {
        query.andWhere('log.integrationType = :type', { type });
      }

      const offset = (page - 1) * limit;
      query.skip(offset).take(limit);

      const [logs, total] = await query.getManyAndCount();

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
      this.logger.error('Error fetching integration logs', error);
      throw error;
    }
  }
}
