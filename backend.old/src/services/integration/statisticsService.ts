/**
 * LOC: 56944D7E5D-STATS
 * WC-GEN-271-H | statisticsService.ts - Integration Statistics and Analytics
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (local)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (integration service)
 */

/**
 * WC-GEN-271-H | statisticsService.ts - Integration Statistics and Analytics
 * Purpose: Generate analytics and statistics for integration operations
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: index.ts | Called by: IntegrationService main class
 * Related: logManager.ts, types.ts
 * Exports: StatisticsService class | Key Services: Analytics, reporting
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Query logs → Calculate metrics → Return statistics
 * LLM Context: Analytics for healthcare integration monitoring and reporting
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IntegrationConfig, IntegrationLog, sequelize } from '../../database/models';
import { IntegrationStatus } from '../../database/types/enums';
import { IntegrationStatistics, IntegrationStatsByType } from './types';

/**
 * Service providing analytics and statistics for integration operations
 * Supports monitoring, reporting, and decision-making
 */
export class StatisticsService {
  /**
   * Get comprehensive integration statistics
   * Includes counts, sync success rates, and type-specific metrics
   *
   * @returns Complete statistics object
   */
  static async getIntegrationStatistics(): Promise<IntegrationStatistics> {
    try {
      const [
        totalIntegrations,
        activeIntegrations,
        recentLogs,
        syncStats
      ] = await Promise.all([
        IntegrationConfig.count(),
        IntegrationConfig.count({ where: { status: IntegrationStatus.ACTIVE } }),
        IntegrationLog.findAll({
          limit: 100,
          order: [['createdAt', 'DESC']],
          where: {
            action: 'sync',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        IntegrationLog.findAll({
          attributes: [
            'integrationType',
            'status',
            [sequelize.fn('COUNT', sequelize.col('integrationType')), 'count']
          ],
          where: {
            action: 'sync',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          group: ['integrationType', 'status'],
          raw: true
        })
      ]);

      // Calculate sync statistics
      const totalSyncs = recentLogs.length;
      const successfulSyncs = recentLogs.filter((log: any) => log.status === 'success').length;
      const failedSyncs = recentLogs.filter((log: any) => log.status === 'failed').length;
      const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

      // Calculate total records processed
      const totalRecordsProcessed = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsProcessed || 0), 0);
      const totalRecordsSucceeded = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsSucceeded || 0), 0);
      const totalRecordsFailed = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsFailed || 0), 0);

      // Group stats by type
      const statsByType: Record<string, IntegrationStatsByType> = {};
      (syncStats as any[]).forEach((stat: any) => {
        if (!statsByType[stat.integrationType]) {
          statsByType[stat.integrationType] = {
            success: 0,
            failed: 0,
            total: 0
          };
        }
        (statsByType[stat.integrationType] as any)[stat.status] = parseInt(stat.count, 10);
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
          totalRecordsFailed
        },
        statsByType
      };
    } catch (error) {
      logger.error('Error fetching integration statistics:', error);
      throw error;
    }
  }
}
