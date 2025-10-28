import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { IntegrationConfig, IntegrationStatus } from '../entities/integration-config.entity';
import { IntegrationLog } from '../entities/integration-log.entity';

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
  statsByType: Record<string, { success: number; failed: number; total: number }>;
}

/**
 * Integration Statistics Service
 * Provides analytics and statistics for integration operations
 */
@Injectable()
export class IntegrationStatisticsService {
  private readonly logger = new Logger(IntegrationStatisticsService.name);

  constructor(
    @InjectRepository(IntegrationConfig)
    private readonly configRepository: Repository<IntegrationConfig>,
    @InjectRepository(IntegrationLog)
    private readonly logRepository: Repository<IntegrationLog>,
  ) {}

  /**
   * Get comprehensive integration statistics
   */
  async getStatistics(): Promise<IntegrationStatistics> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        totalIntegrations,
        activeIntegrations,
        recentLogs,
      ] = await Promise.all([
        this.configRepository.count(),
        this.configRepository.count({ where: { status: IntegrationStatus.ACTIVE } }),
        this.logRepository.find({
          where: {
            action: 'sync',
            createdAt: MoreThan(thirtyDaysAgo),
          },
          order: { createdAt: 'DESC' },
          take: 1000,
        }),
      ]);

      // Calculate sync statistics
      const totalSyncs = recentLogs.length;
      const successfulSyncs = recentLogs.filter(log => log.status === 'success').length;
      const failedSyncs = recentLogs.filter(log => log.status === 'failed').length;
      const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

      const totalRecordsProcessed = recentLogs.reduce((sum, log) => sum + (log.recordsProcessed || 0), 0);
      const totalRecordsSucceeded = recentLogs.reduce((sum, log) => sum + (log.recordsSucceeded || 0), 0);
      const totalRecordsFailed = recentLogs.reduce((sum, log) => sum + (log.recordsFailed || 0), 0);

      // Group stats by type
      const statsByType: Record<string, { success: number; failed: number; total: number }> = {};
      recentLogs.forEach(log => {
        if (!statsByType[log.integrationType]) {
          statsByType[log.integrationType] = { success: 0, failed: 0, total: 0 };
        }
        if (log.status === 'success') {
          statsByType[log.integrationType].success++;
        } else if (log.status === 'failed') {
          statsByType[log.integrationType].failed++;
        }
        statsByType[log.integrationType].total++;
      });

      return {
        totalIntegrations,
        activeIntegrations,
        inactiveIntegrations: totalIntegrations - activeIntegrations,
        syncStatistics: {
          totalSyncs,
          successfulSyncs,
          failedSyncs,
          successRate: parseFloat(successRate.toFixed(2)),
          totalRecordsProcessed,
          totalRecordsSucceeded,
          totalRecordsFailed,
        },
        statsByType,
      };
    } catch (error) {
      this.logger.error('Error fetching integration statistics', error);
      throw error;
    }
  }
}
