/**
 * LOC: 56944D7E5D-LOGS
 * WC-GEN-271-G | logManager.ts - Integration Log Management
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (local)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (integration service)
 *   - configManager.ts
 *   - connectionTester.ts
 *   - syncManager.ts
 */

/**
 * WC-GEN-271-G | logManager.ts - Integration Log Management
 * Purpose: Create and retrieve integration operation logs for audit and monitoring
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: All integration modules | Called by: Config, test, and sync operations
 * Related: configManager.ts, connectionTester.ts, syncManager.ts
 * Exports: LogManager class | Key Services: Audit logging
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Operation → Log creation → Database storage
 * LLM Context: HIPAA-compliant audit logging for healthcare integration operations
 */

import { logger } from '../../utils/logger';
import { IntegrationLog, IntegrationConfig } from '../../database/models';
import { CreateIntegrationLogData, PaginationResult } from './types';

/**
 * Service managing integration operation logs
 * Provides audit trail for HIPAA compliance and troubleshooting
 */
export class LogManager {
  /**
   * Create integration log entry
   * Records integration operations for audit and monitoring
   *
   * @param data - Log entry data
   * @returns Created log entry
   */
  static async createIntegrationLog(data: CreateIntegrationLogData) {
    try {
      const log = await IntegrationLog.create({
        integrationId: data.integrationId,
        integrationType: data.integrationType as any,
        action: data.action,
        status: data.status,
        recordsProcessed: data.recordsProcessed,
        recordsSucceeded: data.recordsSucceeded,
        recordsFailed: data.recordsFailed,
        startedAt: new Date(),
        completedAt: data.status === 'success' || data.status === 'failed' ? new Date() : undefined,
        duration: data.duration,
        errorMessage: data.errorMessage,
        details: data.details
      });

      return log;
    } catch (error) {
      logger.error('Error creating integration log:', error);
      throw error;
    }
  }

  /**
   * Get integration logs with pagination and filtering
   *
   * @param integrationId - Optional integration ID filter
   * @param type - Optional integration type filter
   * @param page - Page number (1-based)
   * @param limit - Records per page
   * @returns Paginated log entries
   */
  static async getIntegrationLogs(
    integrationId?: string,
    type?: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const whereClause: any = {};
      if (integrationId) whereClause.integrationId = integrationId;
      if (type) whereClause.integrationType = type;

      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await IntegrationLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: IntegrationConfig,
            as: 'integration',
            attributes: ['name', 'type']
          }
        ]
      });

      const pagination: PaginationResult = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      };

      return {
        logs,
        pagination
      };
    } catch (error) {
      logger.error('Error fetching integration logs:', error);
      throw error;
    }
  }
}
