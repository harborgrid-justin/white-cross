/**
 * IntegrationLogRepository Implementation
 * Repository for IntegrationLog data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IntegrationLog } from '../../models/integration/IntegrationLog';
import {
  IIntegrationLogRepository,
  CreateIntegrationLogDTO,
  UpdateIntegrationLogDTO
} from '../interfaces/IIntegrationLogRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IntegrationLogRepository
  extends BaseRepository<IntegrationLog, any, any>
  implements IIntegrationLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IntegrationLog, auditLogger, cacheManager, 'IntegrationLog');
  }
  /**
   * Invalidate IntegrationLog-related caches
   */
  protected async invalidateCaches(entity: IntegrationLog): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:integrationlog:*`);
    } catch (error) {
      logger.warn('Error invalidating IntegrationLog caches:', error);
    }
  }

  /**
   * Sanitize IntegrationLog data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}