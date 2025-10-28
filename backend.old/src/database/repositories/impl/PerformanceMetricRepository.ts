/**
 * PerformanceMetricRepository Implementation
 * Repository for PerformanceMetric data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PerformanceMetric } from '../../models/administration/PerformanceMetric';
import {
  IPerformanceMetricRepository,
  CreatePerformanceMetricDTO,
  UpdatePerformanceMetricDTO
} from '../interfaces/IPerformanceMetricRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PerformanceMetricRepository
  extends BaseRepository<PerformanceMetric, any, any>
  implements IPerformanceMetricRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PerformanceMetric, auditLogger, cacheManager, 'PerformanceMetric');
  }
  /**
   * Invalidate PerformanceMetric-related caches
   */
  protected async invalidateCaches(entity: PerformanceMetric): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:performancemetric:*`);
    } catch (error) {
      logger.warn('Error invalidating PerformanceMetric caches:', error);
    }
  }

  /**
   * Sanitize PerformanceMetric data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}